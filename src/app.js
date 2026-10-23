/* ---- App ---- */
(function(){
'use strict';
applyLang(typeof navigator!='undefined'&&navigator.language?navigator.language.slice(0,2).toLowerCase():'nl');
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const MND=['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];
const M3=['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];
const DAGN=['zondag','maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag'];
const DAG=864e5, KEY='moestuin.v1';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cap=s=>s[0].toUpperCase()+s.slice(1);
const mid=d=>new Date(d.getFullYear(),d.getMonth(),d.getDate(),12);
const TODAY=mid(new Date());
const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const parse=s=>{const[a,b,c]=s.split('-').map(Number);return new Date(a,b-1,c,12)};
const fmt=d=>`${d.getDate()} ${M3[d.getMonth()]}`;
const addDays=(d,n)=>new Date(d.getTime()+n*DAG);
const diff=(a,b)=>Math.round((b-a)/DAG);
const doy=d=>diff(new Date(d.getFullYear(),0,1,12),d)+1;
const weekOf=d=>Math.min(52,Math.floor((doy(d)-1)/7)+1);
const dateOfDoy=(y,n)=>new Date(y,0,n,12);
const clamp=n=>Math.max(1,Math.min(52,n));
const rel=n=>n<=0?'vandaag':n==1?'morgen':`over ${n} dagen`;

/* ---- Staat ---- */
const Y0=TODAY.getFullYear();
const S={view:'maand',y:Y0,m:TODAY.getMonth(),frost:20,shift:0,plantings:null,confirm:null,shared:false,me:null,names:{},db:null,local:null};
try{const j=JSON.parse(localStorage.getItem(KEY)||'null');if(j){S.frost=j.frost||20;S.plantings=j.plantings||[]}}catch(e){}
if(S.plantings){
  S.plantings.forEach(p=>{if(p.crop=='aardappel')p.crop=doy(parse(p.date))<=105?'aardappel-vroeg':'aardappel-laat'});
  S.plantings=S.plantings.filter(p=>CROP[p.crop]);
}
if(!S.plantings){
  const ago=n=>iso(addDays(TODAY,-n)),late=TODAY.getMonth()>=7;
  S.plantings=late?[
    {id:'v1',crop:'knoflook',method:'buiten',date:ago(7),bed:'Bak 1',ex:1},
    {id:'v2',crop:'spinazie',method:'buiten',date:ago(35),bed:'Bak 2',ex:1},
    {id:'v3',crop:'veldsla',method:'buiten',date:ago(47),bed:'Bak 3',ex:1}]:[
    {id:'v1',crop:'tomaat',method:'binnen',date:ago(35),bed:'Vensterbank',ex:1},
    {id:'v2',crop:'sla',method:'buiten',date:ago(20),bed:'Bak 2',ex:1},
    {id:'v3',crop:'radijs',method:'buiten',date:ago(12),bed:'Bak 1',ex:1}];
}
const save=()=>{if(S.shared)return;try{localStorage.setItem(KEY,JSON.stringify({frost:S.frost,plantings:S.plantings}))}catch(e){}};

/* ---- Samen tuinieren (gedeelde database, anders alleen lokaal) ---- */
const whoName=id=>id&&id==S.me?'jij':(S.names[id]||'iemand');
const dbSet=p=>{if(S.shared&&S.db)S.db.doc('plantings/'+p.id).set({crop:p.crop,method:p.method,date:p.date,label:p.label||'',bed:p.bed||'',by:p.by||S.me||''}).catch(()=>{})};
const dbDel=id=>{if(S.shared&&S.db)S.db.doc('plantings/'+id).delete().catch(()=>{})};
const dbFrost=()=>{if(S.shared&&S.db)S.db.doc('garden/settings').set({frost:S.frost}).catch(()=>{})};
async function loadNames(){
  try{const u=await claude.use('user');if(!u)return;const ids=[...new Set(S.plantings.map(p=>p.by).filter(Boolean))];if(!ids.length)return;
    const ps=await u.profiles(ids);ids.forEach(i=>{if(ps[i]&&ps[i].name)S.names[i]=ps[i].name});render()}catch(e){}
}
function attach(db,onLost){
  if(!S.shared)S.local=S.plantings.filter(p=>!p.ex);
  S.db=db;S.shared=true;
  return [
    db.collection('plantings').onSnapshot(snap=>{
      S.plantings=snap.docs.map(d=>Object.assign({id:d.id},d.data())).filter(p=>CROP[p.crop]);
      render();if(!C.fb)loadNames();
    },onLost||(()=>{})),
    db.doc('garden/settings').onSnapshot(sn=>{const d=sn.data();if(d&&d.frost){S.frost=d.frost;render()}},()=>{})
  ];
}
async function startShared(){
  try{
    const db=await claude.use('db');if(!db)return;
    const u=await claude.use('user');S.me=u&&u.id?await u.id():null;
    attach(db);
  }catch(e){}
}

/* ---- Account en samen tuinieren in de webversie (Firebase) ----
   Firestore: users/{uid} {garden, gardens:{gid:naam}, name}
              gardens/{gid} {owner, name, frost} met plantings/{id} en members/{uid} {role: owner|edit|view, name, invite?}
              invites/{code} {garden, gname, role, by}
   Wie wat mag: zie firestore.rules. */
const C={fb:null,user:null,gid:null,gname:'',role:null,members:[],gardens:{},unsub:[],err:'',newName:''};
const INV_KEY='sowly.uitnodiging';
const hasFB=()=>typeof FB_CONFIG!='undefined'&&typeof claude=='undefined';
const canEdit=()=>!C.fb||!S.shared||C.role!='view';
const myName=()=>(C.newName||(C.user&&(C.user.displayName||(C.user.email||'').split('@')[0]))||'iemand').slice(0,40);
const ROLE={owner:'eigenaar',edit:'werkt mee',view:'kijkt mee'};
const getInv=()=>{try{return sessionStorage.getItem(INV_KEY)}catch(e){return null}};
const dropInv=()=>{try{sessionStorage.removeItem(INV_KEY)}catch(e){}};
function toast(t){const el=document.createElement('div');el.className='toast';el.setAttribute('role','status');el.textContent=t;document.body.appendChild(el);setTimeout(()=>el.remove(),4500)}
function cloudDb(gid){
  /* Zelfde vorm als claude.use('db'), zodat dbSet, dbDel en dbFrost niets hoeven te weten */
  const {F,db}=C.fb,base='gardens/'+gid,isSet=p=>p=='garden/settings';
  const ref=p=>isSet(p)?F.doc(db,base):F.doc(db,base+'/'+p);
  return {
    doc:p=>({set:d=>isSet(p)?F.setDoc(ref(p),d,{merge:true}):F.setDoc(ref(p),d),delete:()=>F.deleteDoc(ref(p)),onSnapshot:(cb,er)=>F.onSnapshot(ref(p),cb,er)}),
    collection:n=>({onSnapshot:(cb,er)=>F.onSnapshot(F.collection(db,base+'/'+n),cb,er)})
  };
}
async function startCloud(){
  if(!hasFB())return;
  const inv=new URLSearchParams(location.search).get('uitnodiging');
  if(inv){try{sessionStorage.setItem(INV_KEY,inv)}catch(e){}history.replaceState(null,'',location.pathname)}
  try{C.fb=await fbLoad()}catch(e){C.err='Inloggen is nu niet bereikbaar. Je tuin blijft op dit apparaat.';render();return}
  let first=true;
  C.fb.Au.onAuthStateChanged(C.fb.auth,u=>{
    C.user=u;
    if(u)enterCloud().catch(e=>{C.err='Je online tuin kon niet worden geopend. Probeer het later opnieuw.';console.error(e);render()});
    else if(S.shared)location.reload();
    else if(first&&getInv())openLogin('in','Je bent uitgenodigd voor een tuin. Log in of maak een account om mee te doen.');
    first=false;render();
  });
}
async function isMember(gid){
  const {F,db}=C.fb;
  try{return (await F.getDoc(F.doc(db,`gardens/${gid}/members/${C.user.uid}`))).exists()}catch(e){return false}
}
async function enterCloud(){
  const {F,db}=C.fb,u=C.user,uref=F.doc(db,'users/'+u.uid);
  const prof=(await F.getDoc(uref)).data()||{};
  const gardens=prof.gardens||{};let gid=prof.garden;
  const inv=getInv();
  if(inv){dropInv();const j=await joinInvite(inv);if(j){gardens[j.gid]=j.name;gid=j.gid;toast('Je doet nu mee in '+j.name+'.');S.view='tuin'}}
  for(const g of Object.keys(gardens))if(!(await isMember(g)))delete gardens[g];
  if(!gid||!gardens[gid])gid=Object.keys(gardens)[0];
  let moved=false;
  if(!gid){
    /* Eerste keer: eigen tuin aanmaken en de planten van dit apparaat meenemen */
    gid=F.doc(F.collection(db,'gardens')).id;
    await F.setDoc(F.doc(db,'gardens/'+gid),{owner:u.uid,name:'Tuin van '+myName(),frost:S.frost});
    await F.setDoc(F.doc(db,`gardens/${gid}/members/${u.uid}`),{role:'owner',name:myName()});
    const b=F.writeBatch(db);
    S.plantings.filter(p=>!p.ex).forEach(p=>b.set(F.doc(db,`gardens/${gid}/plantings/${p.id}`),{crop:p.crop,method:p.method,date:p.date,label:p.label||'',bed:p.bed||'',by:u.uid}));
    await b.commit();gardens[gid]='Mijn tuin';moved=true;
  }
  await F.setDoc(uref,{garden:gid,gardens,name:myName()});
  C.gardens=gardens;C.newName='';C.err='';
  await openGarden(gid);
  if(moved)S.local=[];
  render();
}
async function joinInvite(code){
  const {F,db}=C.fb;
  let iv;try{iv=(await F.getDoc(F.doc(db,'invites/'+code))).data()}catch(e){}
  if(!iv){toast('Deze uitnodiging bestaat niet meer.');return null}
  if(!(await isMember(iv.garden)))await F.setDoc(F.doc(db,`gardens/${iv.garden}/members/${C.user.uid}`),{role:iv.role,name:myName(),invite:code});
  return {gid:iv.garden,name:iv.gname||'Gedeelde tuin'};
}
async function openGarden(gid){
  const {F,db}=C.fb;
  C.unsub.forEach(f=>f());C.unsub=[];
  const [me,g]=await Promise.all([F.getDoc(F.doc(db,`gardens/${gid}/members/${C.user.uid}`)),F.getDoc(F.doc(db,'gardens/'+gid))]);
  C.gid=gid;C.role=me.data().role;C.gname=(g.data()||{}).name||'';S.me=C.user.uid;
  const lost=()=>{toast('Je hebt geen toegang meer tot deze tuin.');enterCloud().catch(()=>{})};
  C.unsub=attach(cloudDb(gid),lost);
  C.unsub.push(F.onSnapshot(F.collection(db,`gardens/${gid}/members`),sn=>{
    C.members=sn.docs.map(d=>Object.assign({uid:d.id},d.data()));C.members.forEach(m=>S.names[m.uid]=m.name);render();
  },()=>{}));
}
async function switchGarden(gid){
  const {F,db}=C.fb;
  await F.setDoc(F.doc(db,'users/'+C.user.uid),{garden:gid},{merge:true});
  await openGarden(gid);render();
}
async function leaveGarden(){
  const {F,db}=C.fb,gid=C.gid;
  await F.deleteDoc(F.doc(db,`gardens/${gid}/members/${C.user.uid}`));
  delete C.gardens[gid];
  await F.setDoc(F.doc(db,'users/'+C.user.uid),{garden:Object.keys(C.gardens)[0]||null,gardens:C.gardens});
  await enterCloud();
}
async function kick(uid){
  /* Ook de uitnodiging intrekken waarmee die persoon binnenkwam, anders kan die zo weer terug */
  const {F,db}=C.fb,m=C.members.find(x=>x.uid==uid);
  await F.deleteDoc(F.doc(db,`gardens/${C.gid}/members/${uid}`));
  if(m&&m.invite)await F.deleteDoc(F.doc(db,'invites/'+m.invite)).catch(()=>{});
}
function inviteCode(){const a=new Uint8Array(16);crypto.getRandomValues(a);return [...a].map(x=>'abcdefghijkmnpqrstuvwxyz23456789'[x%32]).join('')}
async function makeInvite(role){
  const {F,db}=C.fb,code=inviteCode();
  await F.setDoc(F.doc(db,'invites/'+code),{garden:C.gid,gname:C.gname||'Gedeelde tuin',role,by:C.user.uid});
  const url=location.origin+location.pathname+'?uitnodiging='+code;
  openSheet(`<h2 id="sh-title" style="padding-right:48px">Uitnodiging gemaakt</h2><p>Wie deze link opent en inlogt, ${role=='edit'?'kan meewerken in je tuin: planten toevoegen, aanpassen en verwijderen':'kan meekijken in je tuin, maar niets aanpassen'}.</p><div class="field"><label for="inv-url">Link</label><input id="inv-url" readonly value="${esc(url)}"></div><div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn" data-a="copyinv">Kopiëren</button>${navigator.share?'<button class="btn ghost" data-a="shareinv">Delen</button>':''}</div><p class="small muted" style="margin-top:12px">Iedereen met deze link kan meedoen zolang de link bestaat. Deel hem alleen met wie je vertrouwt. Haal je iemand weg met het kruisje bij de naam, dan werkt de link waarmee die persoon binnenkwam ook niet meer.</p>`);
}
function openInvite(){
  openSheet(`<h2 id="sh-title" style="padding-right:48px">Iemand uitnodigen</h2><p>Wat mag de ander in je tuin?</p><div class="stack" style="gap:8px"><button class="btn" data-a="mkinv" data-m="edit">Meewerken: planten toevoegen, aanpassen en verwijderen</button><button class="btn ghost" data-a="mkinv" data-m="view">Meekijken: alleen bekijken</button></div><p class="small muted" style="margin-top:12px">Je krijgt een link die je zelf doorstuurt, bijvoorbeeld via WhatsApp of mail. De ander moet inloggen of een account maken.</p>`);
}
const AUTH_ERR={'auth/invalid-credential':'E-mailadres of wachtwoord klopt niet.','auth/wrong-password':'E-mailadres of wachtwoord klopt niet.','auth/user-not-found':'E-mailadres of wachtwoord klopt niet.','auth/invalid-email':'Dit e-mailadres klopt niet.','auth/email-already-in-use':'Er is al een account met dit e-mailadres. Log in of vraag een nieuw wachtwoord aan.','auth/weak-password':'Kies een wachtwoord van minstens 6 tekens.','auth/too-many-requests':'Te veel pogingen. Wacht even en probeer het opnieuw.','auth/network-request-failed':'Geen verbinding. Controleer je internet.','auth/operation-not-allowed':'Deze manier van inloggen staat nog niet aan.','auth/unauthorized-domain':'Inloggen is op dit adres nog niet toegestaan.','auth/popup-blocked':'Je browser blokkeerde het inlogvenster. Sta pop-ups toe voor deze site.'};
const authErr=x=>x&&(x.code=='auth/popup-closed-by-user'||x.code=='auth/cancelled-popup-request')?'':(AUTH_ERR[x&&x.code]||'Er ging iets mis. Probeer het opnieuw.');
function openLogin(mode,intro){
  const nieuw=mode=='nieuw',verg=mode=='vergeten';
  openSheet(`<h2 id="sh-title" style="padding-right:48px;margin-bottom:10px">${verg?'Wachtwoord vergeten':nieuw?'Account maken':'Inloggen'}</h2>${intro?`<p>${intro}</p>`:''}${verg?'':`<button class="btn" style="width:100%" data-a="google">Doorgaan met Google</button><p class="small muted" style="text-align:center;margin:12px 0">of met je e-mailadres</p>`}<form id="loginf">${nieuw?'<div class="field"><label for="l-name">Je naam</label><input id="l-name" maxlength="40" autocomplete="name" required><span class="small muted">Anderen in een gedeelde tuin zien deze naam.</span></div>':''}<div class="field"><label for="l-mail">E-mailadres</label><input type="email" id="l-mail" autocomplete="email" required></div>${verg?'':`<div class="field"><label for="l-pw">Wachtwoord${nieuw?' (minstens 6 tekens)':''}</label><input type="password" id="l-pw" minlength="6" autocomplete="${nieuw?'new-password':'current-password'}" required></div>`}<p class="small" id="l-err" role="alert" style="margin:0 0 10px"></p><button class="btn" type="submit">${verg?'Stuur herstelmail':nieuw?'Account maken':'Inloggen'}</button></form><p class="small" style="margin-top:14px">${mode=='in'?'<a href="#" data-a="login" data-m="nieuw">Nog geen account? Maak er een</a><br><a href="#" data-a="login" data-m="vergeten">Wachtwoord vergeten?</a>':'<a href="#" data-a="login" data-m="in">Terug naar inloggen</a>'}</p>`);
  $('#loginf').onsubmit=async e=>{
    e.preventDefault();
    const {Au,auth}=C.fb,mail=$('#l-mail').value.trim(),out=$('#l-err'),btn=e.target.querySelector('[type=submit]');
    out.textContent='';btn.disabled=true;
    try{
      if(verg){await Au.sendPasswordResetEmail(auth,mail);out.textContent='Als er een account met dit adres is, staat er nu een mail klaar om je wachtwoord opnieuw in te stellen. Kijk ook in je spam.';btn.disabled=false;return}
      if(nieuw){C.newName=$('#l-name').value.trim();const r=await Au.createUserWithEmailAndPassword(auth,mail,$('#l-pw').value);await Au.updateProfile(r.user,{displayName:C.newName})}
      else await Au.signInWithEmailAndPassword(auth,mail,$('#l-pw').value);
      closeSheet();
    }catch(x){C.newName='';out.textContent=authErr(x);btn.disabled=false}
  };
}
function google(){
  const {Au,auth}=C.fb;
  Au.signInWithPopup(auth,new Au.GoogleAuthProvider()).then(closeSheet).catch(x=>{const m=authErr(x),o=$('#l-err');if(m&&o)o.textContent=m});
}
function accountCard(){
  if(!C.fb)return `<section class="card"><div class="sec-h"><h3>Account</h3></div><p class="muted small" style="margin:0">${C.err||'Even laden…'}</p></section>`;
  if(!C.user){
    const n=S.plantings.filter(p=>!p.ex).length;
    return `<section class="card"><div class="sec-h"><h3>${n>=3?'Zet je tuin veilig':'Account'}</h3></div><p class="small" style="margin:0 0 10px">Je tuin staat nu alleen op dit apparaat. Log in om hem op al je apparaten te gebruiken en samen te tuinieren. Wat je al hebt geplant, gaat mee.</p><button class="btn sm" data-a="login" data-m="in">Inloggen of account maken</button></section>`;
  }
  if(!S.shared)return `<section class="card"><div class="sec-h"><h3>Account</h3></div><p class="small" style="margin:0 0 10px">${C.err||'Je online tuin wordt geopend…'}</p><a href="#" class="small" data-a="logout">Uitloggen</a></section>`;
  const own=C.role=='owner',gs=Object.entries(C.gardens);
  const sel=gs.length>1?`<div class="field"><label for="g-sel">Tuin</label><select id="g-sel">${gs.map(([g,n])=>`<option value="${g}"${g==C.gid?' selected':''}>${esc(n)}</option>`).join('')}</select></div>`:'';
  const who=C.members.map(m=>`<span class="pill" style="--pc:var(--muted)">${esc(m.name||'iemand')}${m.uid==S.me?' (jij)':''} · ${ROLE[m.role]||''}${own&&m.uid!=S.me?` <button class="linkbtn" data-a="kick" data-id="${m.uid}" aria-label="${esc(m.name||'iemand')} uit je tuin halen">${S.confirm=='kick:'+m.uid?'zeker?':'×'}</button>`:''}</span>`).join(' ');
  const extra=(S.local||[]).filter(p=>!S.plantings.some(q=>q.id==p.id));
  const mig=extra.length&&canEdit()?`<button class="btn sm" data-a="migrate">${extra.length} ${extra.length==1?'plant':'planten'} van dit apparaat meenemen</button>`:'';
  const intro=own?'Dit is jouw tuin. Nodig iemand uit om mee te kijken of mee te werken.':C.role=='edit'?`Je werkt mee in <b>${esc(C.gname)}</b>.`:`Je kijkt mee in <b>${esc(C.gname)}</b>. Aanpassen kan alleen de eigenaar of wie meewerkt.`;
  return `<section class="card"><div class="sec-h"><h3>Samen tuinieren</h3></div>${sel}<p class="small" style="margin:0 0 8px">${intro}</p>${who?`<div class="row" style="gap:6px;flex-wrap:wrap;margin-bottom:10px">${who}</div>`:''}<div class="row" style="gap:8px;flex-wrap:wrap">${own?'<button class="btn sm" data-a="invite">Iemand uitnodigen</button>':`<button class="btn sm ghost" data-a="leave">${S.confirm=='leave'?'Zeker weten?':'Deze tuin verlaten'}</button>`}${mig}</div><p class="small muted" style="margin:12px 0 0">Ingelogd als ${esc(myName())}${C.user.email?' ('+esc(C.user.email)+')':''}. <a href="#" data-a="logout">Uitloggen</a></p></section>`;
}

/* ---- Kalenderlogica ---- */
/* Alle weken in de gegevens zijn relatief aan REF_FROST (laatste nachtvorst in NL/BE: week 20).
   Vorstgevoelige gewassen schuiven mee met de gekozen vorstweek (S.frost). S.shift is een extra
   verschuiving voor een ander klimaat of halfrond (bijv. 26 weken op het zuidelijk halfrond); weken lopen rond. */
const REF_FROST=20;
function stepsOf(c){
  const out=[];
  const add=(t,a,b,l)=>{
    const k=S.shift+(c.tender&&t!='oogst'?S.frost-REF_FROST:0);
    let x=a+k,y=b+k;
    if(!S.shift){out.push({t,a:clamp(x),b:clamp(y),l});return}
    const m=n=>((n-1)%52+52)%52+1;
    if(y-x>=51){out.push({t,a:1,b:52,l});return}
    x=m(x);y=x+(b-a)+(y-x-(b-a));
    const len=b-a;y=x+len;
    if(y>52){out.push({t,a:x,b:52,l});out.push({t,a:1,b:y-52,l})}else out.push({t,a:x,b:y,l});
  };
  c.s.forEach(([t,a,b,l])=>add(t,a,b,l));
  if(c.d.verpot){const w=Math.round(c.d.verpot/7);c.s.filter(x=>x[0]=='binnen'||x[0]=='glas').forEach(([t,a,b])=>add('verpot',a+w,b+w))}
  const by={};out.forEach(x=>(by[x.t]=by[x.t]||[]).push(x));
  return Object.values(by).flatMap(a=>{a.sort((p,q)=>p.a-q.a);const r=[];a.forEach(x=>{const l=r[r.length-1];if(l&&x.a<=l.b+1)l.b=Math.max(l.b,x.b);else r.push({...x})});return r});
}
const wm=w=>Math.min(11,Math.floor(((w-1)*7+3)/30.44));
function ranges(c,types){
  const r=stepsOf(c).filter(x=>types.includes(x.t)).map(x=>[x.a,x.b]).sort((a,b)=>a[0]-b[0]),m=[];
  r.forEach(x=>{const l=m[m.length-1];if(l&&x[0]<=l[1]+1)l[1]=Math.max(l[1],x[1]);else m.push([...x])});
  return m.map(([a,b])=>wm(a)==wm(b)?M3[wm(a)]:`${M3[wm(a)]}–${M3[wm(b)]}`).join(', ');
}
function monthTasks(y,m){
  const wA=weekOf(new Date(y,m,1,12)),wB=weekOf(new Date(y,m+1,0,12)),g={};
  CROPS.forEach(c=>stepsOf(c).forEach(st=>{if(st.a<=wB&&st.b>=wA){(g[st.t]=g[st.t]||[]);if(!g[st.t].some(x=>x.c==c))g[st.t].push({c,st,wA})}}));
  return g;
}
const methodsOf=c=>['binnen','glas','buiten'].filter(t=>c.s.some(x=>x[0]==t));

/* ---- Tijdlijn per plant ---- */
function timeline(p){
  const c=CROP[p.crop],d=c.d,t0=parse(p.date),ev=[];
  const A=(k,off,l,end)=>ev.push({k,dt:addDays(t0,off),l,end:end==null?null:addDays(t0,end)});
  A('zaai',0,c.poten&&p.method=='buiten'?'Poten':ACT[p.method].n);
  A('kiem',d.kiem,c.poten?'Eerste scheut':'Kiemt');
  if(p.method!='buiten'&&d.verpot)A('verpot',d.verpot,ACT.verpot.n);
  if(p.method!='buiten'&&d.uit)A('uitplant',d.uit,ACT.uitplant.n);
  A('oogst',d.oogst[0],ACT.oogst.n,d.oogst[1]);
  return ev.sort((a,b)=>a.dt-b.dt);
}
function stageOf(p){
  const c=CROP[p.crop],t=diff(parse(p.date),TODAY),os=c.d.oogst[0];
  if(t<c.d.kiem)return 0;
  return t<.25*os?1:t<.6*os?2:t<os?3:4;
}

/* ---- Weergaves ---- */
const TAGC=['#E5452E','#2B7FD6','#8E5BD6','#E09A00','#17A398','#D6478A'];
const dot=p=>{const same=S.plantings.filter(x=>x.crop==p.crop);return same.length<2?'':`<span class="tagdot" style="--tg:${TAGC[same.indexOf(p)%TAGC.length]}"></span>`};
const nm=p=>CROP[p.crop].n+(p.label?' · '+esc(p.label):'');
const taskPlant=(c,st)=>`<div class="pp">${plantSVG(c,st)}</div>`;
/* ---- Zaad kopen (voorbeeld: affiliate-links nog niet actief) ---- */
/* Zaad-knoppen en advertenties uit tot de KvK-inschrijving rond is (zie notes/openstaande-punten.md) */
const COMMERCE=false;
const adSlot=()=>COMMERCE?'<div class="ad">Hier komt later een advertentie (AdMob in de Android-app).</div>':'';
const SHOPS=[{n:'Zaadwinkel 1',u:''},{n:'Zaadwinkel 2',u:''},{n:'Zaadwinkel 3',u:''}];
function seedList(){
  const w=weekOf(TODAY),L=[];
  CROPS.forEach(c=>{
    const s=stepsOf(c).filter(x=>x.t=='binnen'||x.t=='glas'||x.t=='buiten').sort((p,q)=>p.a-q.a);
    const nxt=s.find(x=>x.b>=w);if(!nxt)return;
    const gap=Math.max(0,nxt.a-w);if(gap<=4)L.push({c,gap,a:nxt.a});
  });
  return L.sort((p,q)=>p.gap-q.gap||p.c.n.localeCompare(q.c.n)).slice(0,6);
}
function zaadCard(){
  const L=seedList();if(!L.length)return '';
  return `<section class="card"><div class="sec-h"><h3>Zaad halen voor de komende weken</h3><span class="pill" style="--pc:var(--muted)">voorbeeld</span></div>${L.map(({c,gap,a})=>`<div class="task"><div class="task-main" style="cursor:default">${taskPlant(c,3)}<span><b>${c.n}</b><span class="muted small">${gap?`zaaien vanaf ${fmt(dateOfDoy(Y0,(a-1)*7+1))}`:'nu zaaien'}</span></span></div><button class="btn sm" data-a="seed" data-id="${c.id}">Zaad zoeken</button></div>`).join('')}<p class="muted small" style="margin:8px 0 0">Links naar webwinkels zijn affiliate-links: de planner krijgt een kleine vergoeding als je koopt. Dat kost jou niets extra.</p></section>`;
}
function openSeed(id){
  const c=CROP[id];
  openSheet(`<h2 id="sh-title" style="padding-right:48px">Zaad zoeken: ${c.n}</h2><div class="bigplant"><div class="pp">${plantSVG(c,4)}</div></div><p style="margin:12px 0 8px">Kies een webwinkel. Je gaat naar de zoekresultaten voor <b>${c.n.toLowerCase()}zaad</b>.</p><div class="stack" style="gap:8px">${SHOPS.map(s=>`<button class="btn" style="width:100%${s.u?'':';opacity:.75'}" ${s.u?'':'disabled'}>${s.n} <span class="small">(affiliate-link)</span></button>`).join('')}</div><p class="muted small" style="margin:12px 0 0"><b>Voorbeeld:</b> hier komen de echte winkelknoppen met jouw Daisycon-links zodra je programma's zijn goedgekeurd. Elke knop wordt zichtbaar gemarkeerd als affiliate-link.</p>`);
}
function vMaand(){
  const g=monthTasks(S.y,S.m),order=Object.keys(ACT).sort((a,b)=>ACT[a].o-ACT[b].o);
  const fd=dateOfDoy(S.y,S.frost*7-3);
  let h=`<div class="stack"><div class="monthnav"><button class="icon-btn" data-a="mprev" aria-label="Vorige maand">‹</button><h2>${cap(MND[S.m])} ${S.y}</h2><button class="icon-btn" data-a="mnext" aria-label="Volgende maand">›</button></div>`;
  h+=`<div class="frost"><div class="grow1"><b>Laatste nachtvorst: week ${S.frost}</b> <span class="muted">(rond ${fmt(fd)})</span><div class="small muted">Vorstgevoelige gewassen schuiven mee.</div></div><button class="icon-btn" data-a="fminus" aria-label="Een week eerder">−</button><button class="icon-btn" data-a="fplus" aria-label="Een week later">+</button></div>`;
  const cur=S.y==Y0&&S.m==TODAY.getMonth();
  if(COMMERCE&&cur)h+=zaadCard();
  let n=0;
  order.forEach(k=>{
    const L=g[k];if(!L)return;n+=L.length;
    h+=`<section class="card"><div class="sec-h"><span class="pill" style="--pc:var(${ACT[k].c})">${ACT[k].n}</span><span class="muted small">${L.length} ${L.length==1?'gewas':'gewassen'}</span></div>`;
    /* In de huidige maand: wat vóór vandaag is afgelopen grijs en onderaan */
    L.map(x=>{const ed=dateOfDoy(S.y,x.st.b*7);return {...x,ed,past:cur&&mid(ed)<mid(TODAY)}}).sort((p,q)=>p.past-q.past).forEach(({c,st,wA,ed,past})=>{
      const sd=dateOfDoy(S.y,(st.a-1)*7+1);
      const note=(past?'voorbij · ':'')+(st.l?st.l+' · ':'')+(st.a>=wA?`vanaf ${fmt(sd)}`:`t/m ${fmt(ed)}`);
      const sow=k=='binnen'||k=='glas'||k=='buiten';
      h+=`<div class="task${past?' past':''}"><button class="task-main" data-a="crop" data-id="${c.id}">${taskPlant(c,sow?4:ACT[k].st)}<span><b>${c.n}</b><span class="muted small">${note}</span>${yearChart(c,1)}</span></button>${sow?`<button class="btn sm ghost" data-a="add" data-id="${c.id}" data-m="${k}">Planten</button>`:''}</div>`;
    });
    h+='</section>';
  });
  if(!n)h+=`<div class="card empty"><b>Deze maand valt er weinig te doen.</b><p class="muted">Kijk bij Gewassen wat je alvast kunt voorbereiden.</p></div>`;
  h+=`${adSlot()}</div>`;
  return h;
}
const KOOL=KOOLID;
const expand=a=>a.flatMap(x=>x=='aardappel'?['aardappel-vroeg','aardappel-laat']:x=='kool'?KOOL:[x]);
const LV={l:{zon:['Volle zon',3],zh:['Zon tot halfschaduw',2],half:['Halfschaduw',1]},w:{veel:['Veel water',3],gemiddeld:['Gemiddeld water',2],weinig:['Weinig water',1]},v:{zwaar:['Zware eter',3],middel:['Matige eter',2],licht:['Lichte eter',1]}};
const chip=x=>CROP[x]?`<button class="chip" data-a="crop" data-id="${x}">${CROP[x].n}</button>`:`<span class="chip">${x=='aardappel'?'Aardappel':x=='kool'?'Koolsoorten':esc(x)}</span>`;
function careHTML(id){
  const k=NB[id];if(!k)return '';
  const row=(t,key)=>{const [lv,txt]=k[key],[name,n]=LV[key][lv],ok=k.b[key];return `<div class="cr"><span class="cl">${t}</span><span class="cv"><span class="dots" aria-hidden="true">${'●'.repeat(n)}${'○'.repeat(3-n)}</span> ${name}</span><span class="cd">${txt}</span><span class="${ok?'bv':'nb'}">${ok?'Bevestigd door Nederlandse of Belgische bron':'Nog niet bevestigd door een Nederlandse of Belgische bron'}</span></div>`};
  const lijst=(arr,cls,t)=>arr.length?`<div class="small muted" style="margin:10px 0 4px">${t}</div><div class="chips ${cls}">${arr.map(chip).join('')}</div>`:'';
  const bev=lijst(k.g,'good','Gaan goed samen')+lijst(k.s,'bad','Liever niet ernaast');
  const meer=k.g2.length||k.s2.length?`<details class="more"><summary>Ook genoemd, niet bevestigd door een Nederlandse of Belgische bron</summary>${lijst(k.g2,'good unc','Zou goed samen kunnen gaan')}${lijst(k.s2,'bad unc','Zou liever niet ernaast kunnen')}</details>`:'';
  return `<h3 style="margin-top:14px">Verzorging</h3><div class="care">${row('Licht','l')}${row('Water','w')}${row('Voeding','v')}</div><h3 style="margin-top:14px">Buren</h3>${bev||'<p class="small muted" style="margin:6px 0 0">Geen bevestigde buurregel gevonden.</p>'}${meer}`;
}
function neighbourCard(){
  const by={};S.plantings.forEach(p=>{const b=(p.bed||'').trim().toLowerCase();if(b)(by[b]=by[b]||[]).push(p)});
  const out=[],seen=new Set();
  Object.values(by).forEach(L=>{for(let i=0;i<L.length;i++)for(let j=i+1;j<L.length;j++){
    const a=L[i],c=L[j];if(a.crop==c.crop)continue;
    const A=NB[a.crop],B=NB[c.crop],key=[a.crop,c.crop].sort().join('|')+L[0].bed.toLowerCase();if(!A||!B||seen.has(key))continue;seen.add(key);
    const bad=expand(A.s).includes(c.crop)||expand(B.s).includes(a.crop),good=expand(A.g).includes(c.crop)||expand(B.g).includes(a.crop);
    if(bad||good)out.push({bad,t:`${CROP[a.crop].n} en ${CROP[c.crop].n} (${esc(L[0].bed)}): ${bad?'liever niet naast elkaar.':'gaan goed samen.'}`});
  }});
  if(!out.length)return '';
  out.sort((x,y)=>y.bad-x.bad);
  return `<section class="card"><div class="sec-h"><h3>Buren in je tuin</h3></div>${out.slice(0,8).map(o=>`<div class="row" style="padding:4px 0"><span class="pill" style="--pc:var(${o.bad?'--c-oogst':'--c-buiten'})">${o.bad?'Let op':'Goed'}</span><span class="grow1 small">${o.t}</span></div>`).join('')}<p class="small muted" style="margin:6px 0 0">Alleen combinaties die een Nederlandse bron noemt, gebaseerd op de plek die je bij elke plant invult.</p></section>`;
}
const byName=(a,b)=>a.n.localeCompare(b.n,'nl');
function gridHTML(){
  const q=(S.q||'').trim().toLowerCase(),L=[...CROPS].sort(byName).filter(c=>c.n.toLowerCase().includes(q));
  return L.length?L.map(c=>`<button class="crop" data-a="crop" data-id="${c.id}"><div class="pp">${plantSVG(c,4)}</div><h3>${c.n}</h3><span class="small muted">Zaaien: ${ranges(c,['binnen','glas','buiten'])}<br>Oogst: ${ranges(c,['oogst'])}</span><span class="seedrow">${COMMERCE?`<span class="seedlink" role="button" data-a="seed" data-id="${c.id}">Zaad zoeken</span>`:''}<span class="seedlink plant" role="button" data-a="add" data-id="${c.id}">+ Planten</span></span></button>`).join(''):`<p class="muted">Geen gewas gevonden voor "${esc(S.q)}".</p>`;
}
function vGewassen(){
  return `<div class="stack"><div class="row"><h2 class="grow1">Gewassen</h2><span class="muted small">${CROPS.length} gewassen</span></div><div class="field" style="margin:0"><label for="q">Zoek een gewas</label><input id="q" type="search" value="${esc(S.q||'')}" placeholder="Bijvoorbeeld tomaat" autocomplete="off"></div><div class="grid" id="grid">${gridHTML()}</div></div>`;
}
function ganttOf(p,ev){
  const seq=ev.filter(e=>e.k!='kiem'),t0=ev[0].dt,end=seq[seq.length-1].end,tot=Math.max(1,diff(t0,end));
  const segs=seq.map((e,i)=>{const to=seq[i+1]?seq[i+1].dt:e.end,w=Math.max(0,diff(e.dt,to))/tot*100,col=e.k=='zaai'?ACT[p.method].c:ACT[e.k].c;return `<i style="width:${w.toFixed(2)}%;--sc:var(${col})"></i>`}).join('');
  const pos=Math.max(0,Math.min(100,diff(t0,TODAY)/tot*100));
  return `<div class="gantt" role="img" aria-label="Tijdlijn van zaaien tot einde oogst">${segs}<span class="t" style="left:calc(${pos.toFixed(1)}% - 1.5px)"></span></div>`;
}
function plantCard(p){
  const c=CROP[p.crop],ev=timeline(p),st=stageOf(p),t=diff(parse(p.date),TODAY);
  const firstOpen=ev.findIndex(e=>TODAY<=(e.end||e.dt));
  let steps='';
  ev.forEach((e,i)=>{
    const over=TODAY>(e.end||e.dt),cls=over?'done':i==firstOpen?'now':'';
    const dt=e.end?`${fmt(e.dt)} – ${fmt(e.end)}`:fmt(e.dt);
    const sub=i==firstOpen&&!over?` <span class="muted small">· ${e.end&&TODAY>=e.dt?'nu bezig':rel(diff(TODAY,e.dt))}</span>`:'';
    steps+=`<li class="${cls}"><span class="dot">${over?'✓':''}</span><span><b>${e.l}</b><br><span class="small">${dt}</span>${sub}</span></li>`;
  });
  const status=firstOpen<0?'Seizoen afgerond':t<0?`Zaaien op ${fmt(parse(p.date))}`:`Dag ${t+1} · ${STAGE_NAMES[st].toLowerCase()}`;
  return `<article class="card plant-card${S.newId==p.id?' pop':''}"><div class="plant-head"><div class="pp">${plantSVG(c,Math.max(0,st))}</div><div class="grow1"><h3>${dot(p)}${nm(p)}${p.ex?' <span class="pill" style="--pc:var(--muted)">voorbeeld</span>':''}</h3><div class="small muted">${p.bed?esc(p.bed)+' · ':''}${METHODS[p.method]} op ${fmt(parse(p.date))}${S.shared&&p.by?' · door '+esc(whoName(p.by)):''}</div><div class="small"><b>${status}</b></div></div><div class="del row"><button class="btn sm ghost" data-a="edit" data-id="${p.id}">Wijzigen</button><button class="btn sm ghost" data-a="del" data-id="${p.id}">${S.confirm==p.id?'Zeker weten?':'Verwijderen'}</button></div></div>${ganttOf(p,ev)}<ol class="steps">${steps}</ol></article>`;
}
function upcoming(){
  const L=[];
  S.plantings.forEach(p=>timeline(p).forEach(e=>{
    if(e.k=='zaai'||e.k=='kiem')return;
    const act=e.end&&e.dt<=TODAY&&e.end>=TODAY,soon=e.dt>=TODAY&&diff(TODAY,e.dt)<=30;
    if(act||soon)L.push({dt:act?TODAY:e.dt,p,e,act});
  }));
  L.sort((a,b)=>a.dt-b.dt);
  const rows=L.slice(0,8).map(x=>`<div class="row" style="padding:6px 0"><b style="min-width:62px">${x.act?'Nu':fmt(x.dt)}</b><span class="pill" style="--pc:var(${ACT[x.e.k].c})">${ACT[x.e.k].n}</span><span class="grow1">${dot(x.p)}${nm(x.p)}</span></div>`).join('');
  return `<section class="card"><div class="sec-h"><h3>Komende 30 dagen</h3></div>${rows||'<p class="muted" style="margin:0">Geen taken de komende 30 dagen.</p>'}</section>`;
}
function samenCard(){
  if(hasFB())return accountCard();
  if(!S.shared)return `<section class="card"><div class="sec-h"><h3>Samen tuinieren</h3></div><p class="muted small" style="margin:0">Samen tuinieren werkt hier nog niet. Je tuin staat alleen op dit apparaat.</p></section>`;
  const ids=[...new Set(S.plantings.map(p=>p.by).filter(Boolean))];
  const who=ids.length?ids.map(i=>`<span class="pill" style="--pc:var(--muted)">${esc(S.names[i]||'iemand')}${i==S.me?' (jij)':''}</span>`).join(' '):'';
  const mig=S.local&&S.local.length&&!S.plantings.length?`<button class="btn sm" data-a="migrate">Mijn ${S.local.length} lokale planten meenemen</button>`:'';
  return `<section class="card"><div class="sec-h"><h3>Samen tuinieren</h3></div><p class="small" style="margin:0 0 8px">Deze tuin wordt gedeeld: wie je uitnodigt ziet en bewerkt dezelfde planten, direct.</p><p class="muted small" style="margin:0 0 8px"><b>Uitnodigen:</b> kies bovenaan in Claude <b>Delen</b>, voeg de ander toe en geef bewerkrechten. Met alleen kijkrechten kan iemand meekijken maar niets wijzigen.</p>${who?`<div class="row" style="gap:6px;flex-wrap:wrap">${who}</div>`:''}${mig}</section>`;
}
function vTuin(){
  let h=`<div class="stack"><div class="row"><h2 class="grow1">Mijn tuin</h2>${canEdit()?'<button class="btn" data-a="add">+ Gewas planten</button>':''}</div>`;
  /* Herinnering: wie niet inlogt en al 3 planten heeft, ziet het account bovenaan */
  const top=hasFB()&&C.fb&&!C.user&&S.plantings.filter(p=>!p.ex).length>=3;
  if(top)h+=samenCard();
  if(!S.plantings.length)return h+`<div class="card empty"><b>Je tuin is nog leeg.</b><p class="muted">Voeg een gewas toe en zie direct wanneer je moet verpotten, uitplanten en oogsten.</p></div>${samenCard()}</div>`;
  h+=upcoming()+neighbourCard()+(top?'':samenCard());
  const sorted=[...S.plantings].sort((a,b)=>a.date<b.date?1:-1);
  sorted.forEach(p=>h+=plantCard(p));
  return h+`${adSlot()}</div>`;
}
function render(){
  $('#main').innerHTML=S.view=='maand'?vMaand():S.view=='gewassen'?vGewassen():vTuin();
  $$('.tab').forEach(b=>b.setAttribute('aria-current',b.dataset.view==S.view?'page':'false'));
}

/* ---- Bladen (sheets) ---- */
let playT=null;
function openSheet(html){$('#sh-body').innerHTML=html;$('#ov').hidden=false;$('#sh-close').focus();$('.sheet').scrollTop=0}
function closeSheet(){$('#ov').hidden=true;clearInterval(playT);playT=null}
function yearChart(c,mini){
  const st=stepsOf(c),types=Object.keys(ACT).filter(t=>st.some(x=>x.t==t)).sort((a,b)=>ACT[a].o-ACT[b].o);
  const dim=[31,28,31,30,31,30,31,31,30,31,30,31],np=((doy(TODAY)-.5)/365*100).toFixed(1);
  return `<div class="yc${mini?' mini':''}"><div class="yc-h"><span></span><div class="months">${dim.map((d,i)=>`<span style="--d:${d}">${'JFMAMJJASOND'[i]}</span>`).join('')}</div></div>`+types.map(t=>{const lb=c.poten&&t=='buiten'?'Poten':ACT[t].s;return `<div class="yr" title="${lb}"><span>${lb}</span><div class="yt">${st.filter(x=>x.t==t).map(x=>`<i class="bar" style="left:${((x.a-1)/52*100).toFixed(1)}%;width:${((x.b-x.a+1)/52*100).toFixed(1)}%;--bc:var(${ACT[t].c})"></i>`).join('')}<i class="now" style="left:${np}%"></i></div></div>`}).join('')+`</div>`;
}
function openCrop(id){
  const c=CROP[id];
  openSheet(`<h2 id="sh-title" style="padding-right:48px">${c.n}</h2><div class="bigplant"><div class="pp" id="bigp">${plantSVG(c,4)}</div></div><div class="stages" role="group" aria-label="Groeistadium">${STAGE_NAMES.map((n,i)=>`<button data-a="stage" data-s="${i}" data-id="${id}" aria-pressed="${i==4}">${n}</button>`).join('')}<button data-a="play" data-id="${id}">▶ Afspelen</button></div><p>${c.tip}</p>${careHTML(id)}<h3 style="margin-top:14px">Het hele jaar</h3>${yearChart(c)}<p class="small muted">De streep geeft vandaag aan.</p><div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn" data-a="add" data-id="${id}">Planten in mijn tuin</button>${COMMERCE?`<button class="btn ghost" data-a="seed" data-id="${id}">Zaad zoeken</button>`:''}</div>`);
}
function setStage(id,s){
  $('#bigp').innerHTML=plantSVG(CROP[id],s);
  $$('.stages [data-s]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.s==s)));
}
function openAdd(id,m){
  const c=CROP[id||'tomaat'];
  openSheet(`<h2 id="sh-title" style="padding-right:48px;margin-bottom:14px">Gewas planten</h2><form id="addf"><div class="field"><label for="f-crop">Gewas</label><select id="f-crop">${[...CROPS].sort(byName).map(x=>`<option value="${x.id}"${x.id==c.id?' selected':''}>${x.n}</option>`).join('')}</select></div><div class="field"><label for="f-method">Zaaimethode</label><select id="f-method"></select></div><div class="field"><label for="f-date">Datum van zaaien of poten</label><input type="date" id="f-date" required value="${iso(TODAY)}"></div><div class="field"><label for="f-label">Herkenning (optioneel)</label><input id="f-label" maxlength="30" placeholder="Bijvoorbeeld Roma of Rij 2"><span class="small muted" id="f-hint"></span></div><div class="field"><label for="f-bed">Plek (optioneel)</label><input id="f-bed" maxlength="30" placeholder="Bijvoorbeeld Bak 1"></div><div class="row"><button class="btn" type="submit">Toevoegen</button><button class="btn ghost" type="button" data-a="close">Annuleren</button></div></form>`);
  const fill=pref=>{const cc=CROP[$('#f-crop').value];$('#f-method').innerHTML=methodsOf(cc).map(t=>`<option value="${t}"${t==pref?' selected':''}>${METHODS[t]}</option>`).join('')};
  const hint=()=>{const cc=CROP[$('#f-crop').value],n=S.plantings.filter(x=>x.crop==cc.id).length;$('#f-hint').textContent=n?`Je hebt al ${n} ${cc.n.toLowerCase()} in je tuin. Geef deze een eigen naam, zoals de variëteit of de rij. Laat je het leeg, dan wordt het #${n+1}.`:''};
  fill(m);hint();$('#f-crop').onchange=()=>{fill();hint()};
  $('#addf').onsubmit=e=>{
    e.preventDefault();
    const cid=$('#f-crop').value,n=S.plantings.filter(x=>x.crop==cid).length;
    S.plantings.push({id:'p'+Date.now()+Math.random().toString(36).slice(2,6),crop:cid,method:$('#f-method').value,date:$('#f-date').value,label:$('#f-label').value.trim()||(n?'#'+(n+1):''),bed:$('#f-bed').value.trim(),by:S.me||''});
    save();dbSet(S.plantings[S.plantings.length-1]);closeSheet();S.view='tuin';S.newId=S.plantings[S.plantings.length-1].id;render();scrollTo(0,0);plantFx(CROP[cid]);setTimeout(()=>{S.newId=null;$$('.plant-card.pop').forEach(x=>x.classList.remove('pop'))},9000);
  };
}

function plantFx(c){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const el=document.createElement('div');el.className='fx';el.setAttribute('role','status');el.innerHTML=fxHTML(c);
  const bye=()=>{el.classList.add('out');setTimeout(()=>el.remove(),400)};
  el.addEventListener('click',bye);document.body.appendChild(el);setTimeout(bye,5600);
}
function openEdit(id){
  const p=S.plantings.find(x=>x.id==id);if(!p)return;
  openSheet(`<h2 id="sh-title" style="padding-right:48px;margin-bottom:14px">${CROP[p.crop].n} aanpassen</h2><form id="editf"><div class="field"><label for="e-date">Datum van zaaien of poten</label><input type="date" id="e-date" required value="${esc(p.date)}"></div><div class="field"><label for="e-label">Herkenning</label><input id="e-label" maxlength="30" value="${esc(p.label||'')}" placeholder="Bijvoorbeeld Roma of Rij 2"></div><div class="field"><label for="e-bed">Plek</label><input id="e-bed" maxlength="30" value="${esc(p.bed||'')}"></div><div class="row"><button class="btn" type="submit">Opslaan</button><button class="btn ghost" type="button" data-a="close">Annuleren</button></div></form>`);
  $('#editf').onsubmit=e=>{e.preventDefault();if($('#e-date').value)p.date=$('#e-date').value;p.label=$('#e-label').value.trim();p.bed=$('#e-bed').value.trim();save();dbSet(p);closeSheet();render()};
}

/* ---- Events ---- */
document.addEventListener('click',e=>{
  if(e.target.id=='ov'){closeSheet();return}
  const tab=e.target.closest('.tab');
  if(tab){S.view=tab.dataset.view;S.confirm=null;render();scrollTo(0,0);return}
  const t=e.target.closest('[data-a]');if(!t)return;
  const a=t.dataset.a,id=t.dataset.id;
  if(t.tagName=='A')e.preventDefault();
  if(!canEdit()&&['add','edit','del','migrate','fminus','fplus'].includes(a)){toast('Je kijkt mee in deze tuin. Aanpassen kan alleen de eigenaar of wie meewerkt.');return}
  if(a=='close')closeSheet();
  else if(a=='mprev'){S.m--;if(S.m<0){S.m=11;S.y--}render()}
  else if(a=='mnext'){S.m++;if(S.m>11){S.m=0;S.y++}render()}
  else if(a=='fminus'||a=='fplus'){S.frost=Math.max(14,Math.min(26,S.frost+(a=='fplus'?1:-1)));save();dbFrost();render()}
  else if(a=='crop')openCrop(id);
  else if(a=='seed'&&COMMERCE)openSeed(id);
  else if(a=='add')openAdd(id,t.dataset.m);
  else if(a=='edit')openEdit(id);
  else if(a=='stage'){clearInterval(playT);setStage(id,+t.dataset.s)}
  else if(a=='play'){
    clearInterval(playT);let s=0;setStage(id,0);
    playT=setInterval(()=>{s++;if(s>4){clearInterval(playT);return}setStage(id,s)},1100);
  }
  else if(a=='migrate'){(S.local||[]).forEach(p=>{const q=Object.assign({},p,{by:S.me||''});dbSet(q)});S.local=[]}
  else if(a=='login')openLogin(t.dataset.m||'in');
  else if(a=='google')google();
  else if(a=='logout')C.fb.Au.signOut(C.fb.auth);
  else if(a=='invite')openInvite();
  else if(a=='mkinv')makeInvite(t.dataset.m).catch(()=>toast('De uitnodiging kon niet worden gemaakt. Probeer het opnieuw.'));
  else if(a=='copyinv'){const u=$('#inv-url');u.select();(navigator.clipboard?navigator.clipboard.writeText(u.value):Promise.reject()).then(()=>toast('Link gekopieerd.'),()=>{try{document.execCommand('copy');toast('Link gekopieerd.')}catch(x){}})}
  else if(a=='shareinv')navigator.share({title:'Sowly',text:'Doe mee in mijn moestuin op Sowly',url:$('#inv-url').value}).catch(()=>{});
  else if(a=='kick'){
    if(S.confirm=='kick:'+id){S.confirm=null;kick(id).catch(()=>toast('Dat lukte niet. Probeer het opnieuw.'))}else S.confirm='kick:'+id;
    render();
  }
  else if(a=='leave'){
    if(S.confirm=='leave'){S.confirm=null;leaveGarden().catch(()=>toast('Dat lukte niet. Probeer het opnieuw.'))}else S.confirm='leave';
    render();
  }
  else if(a=='del'){
    if(S.confirm==id){S.plantings=S.plantings.filter(p=>p.id!=id);S.confirm=null;save();dbDel(id)}else S.confirm=id;
    render();
  }
});
document.addEventListener('change',e=>{if(e.target.id=='g-sel')switchGarden(e.target.value).catch(()=>toast('Die tuin kon niet worden geopend.'))});
document.addEventListener('input',e=>{if(e.target.id=='q'){S.q=e.target.value;$('#grid').innerHTML=gridHTML()}});
$('#sh-close').onclick=closeSheet;
document.addEventListener('keydown',e=>{if(e.key=='Escape'&&!$('#ov').hidden)closeSheet()});

/* ---- Start ---- */
$('#today').textContent=`${cap(DAGN[TODAY.getDay()])} ${TODAY.getDate()} ${MND[TODAY.getMonth()]} · week ${weekOf(TODAY)}`;
const MASCOT=`<svg class="pl" viewBox="0 0 120 124" role="img" aria-label="Kiempje, de mascotte van Sowly"><ellipse class="mshadow" cx="60" cy="114" rx="30" ry="6" style="fill:#000;stroke:none;opacity:.28"/><g class="mbody mz"><path class="marmL" d="M38 84 C26 86 20 78 22 70 C30 70 36 74 40 80Z" style="fill:var(--leaf)"/><path class="marmR" d="M82 84 C94 86 100 78 98 70 C90 70 84 74 80 80Z" style="fill:var(--leaf)"/><path d="M26 112 C22 92 34 60 60 60 C86 60 98 92 94 112 C80 118 40 118 26 112Z" style="fill:var(--leaf3)"/><path d="M30 106 C40 112 80 112 90 106" style="fill:none;stroke:var(--soil);stroke-width:7"/><path d="M24 114 C34 106 86 106 96 114 C86 120 34 120 24 114Z" style="fill:var(--soil)"/><g class="mhead"><path d="M60 62 C60 52 59 46 60 38" style="fill:none;stroke-width:4"/><path class="mleafL" d="M60 42 C46 44 32 36 30 22 C46 20 58 28 60 42Z" style="fill:var(--leaf)"/><path class="mleafR" d="M60 42 C74 40 90 32 92 18 C76 16 62 26 60 42Z" style="fill:var(--leaf2)"/><path class="vein" d="M58 40 C50 34 42 28 36 24"/><path class="vein" d="M62 40 C70 32 80 26 88 20"/></g><circle cx="48" cy="80" r="9" style="fill:#fff"/><circle cx="72" cy="80" r="9" style="fill:#fff"/><g class="mpupil"><circle cx="50" cy="81" r="4.6" style="fill:var(--line);stroke:none"/><circle cx="51.6" cy="79.2" r="1.5" style="fill:#fff;stroke:none"/><g class="mwink"><circle cx="74" cy="81" r="4.6" style="fill:var(--line);stroke:none"/><circle cx="75.6" cy="79.2" r="1.5" style="fill:#fff;stroke:none"/></g></g><ellipse cx="38" cy="93" rx="5" ry="3.2" style="fill:#F4958C;stroke:none;opacity:.8"/><ellipse cx="82" cy="93" rx="5" ry="3.2" style="fill:#F4958C;stroke:none;opacity:.8"/><path d="M52 93 Q60 102 68 93Z" style="fill:#B3392F;stroke-width:2.2"/></g><path class="mheart" d="M92 42 C86 36 80 42 92 52 C104 42 98 36 92 42Z" style="fill:var(--radish);stroke-width:2"/></svg>`;
$('#mascot').innerHTML=MASCOT;
$('#mascot').addEventListener('click',function(){this.classList.remove('jump');void this.offsetWidth;this.classList.add('jump');setTimeout(()=>this.classList.remove('jump'),950)});
render();startShared();startCloud();
})();
