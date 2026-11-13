/* ---- App ---- */
(function(){
'use strict';
applyLang(pickLang());
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const DAG=864e5;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cap=s=>s[0].toUpperCase()+s.slice(1);
const mid=d=>new Date(d.getFullYear(),d.getMonth(),d.getDate(),12);
const TODAY=mid(new Date());
const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const parse=s=>{const[a,b,c]=s.split('-').map(Number);return new Date(a,b-1,c,12)};
const fmt=d=>tx('date',{d:d.getDate(),m:CAL.m3[d.getMonth()]});
const addDays=(d,n)=>new Date(d.getTime()+n*DAG);
const diff=(a,b)=>Math.round((b-a)/DAG);
const doy=d=>diff(new Date(d.getFullYear(),0,1,12),d)+1;
const weekOf=d=>Math.min(52,Math.floor((doy(d)-1)/7)+1);
const dateOfDoy=(y,n)=>new Date(y,0,n,12);
const clamp=n=>Math.max(1,Math.min(52,n));
const rel=n=>n<=0?tx('rel.0'):n==1?tx('rel.1'):tx('rel.n',{n});

/* ---- Staat ---- */
const Y0=TODAY.getFullYear();
const S={view:'maand',y:Y0,m:TODAY.getMonth(),frost:20,shift:0,plantings:null,confirm:null,shared:false,me:null,names:{},db:null};
/* Niets in localStorage: wie zijn cache leegt, zou zijn tuin kwijt zijn. Opslaan kan alleen online
   (inloggen in de webversie, de database van Claude in Claude). Tot dan zie je voorbeeldplanten. */
function examples(){
  const ago=n=>iso(addDays(TODAY,-n)),late=TODAY.getMonth()>=7,bak=n=>tx('ex.bed',{n});
  return late?[
    {id:'v1',crop:'knoflook',method:'buiten',date:ago(7),bed:bak(1),ex:1},
    {id:'v2',crop:'spinazie',method:'buiten',date:ago(35),bed:bak(2),ex:1},
    {id:'v3',crop:'veldsla',method:'buiten',date:ago(47),bed:bak(3),ex:1}]:[
    {id:'v1',crop:'tomaat',method:'binnen',date:ago(35),bed:tx('ex.sill'),ex:1},
    {id:'v2',crop:'sla',method:'buiten',date:ago(20),bed:bak(2),ex:1},
    {id:'v3',crop:'radijs',method:'buiten',date:ago(12),bed:bak(1),ex:1}];
}
S.plantings=examples();

/* ---- Samen tuinieren (gedeelde database; zonder database wordt niets opgeslagen) ---- */
const whoName=id=>id&&id==S.me?tx('you'):(S.names[id]||tx('someone'));
const dbSet=p=>{if(S.shared&&S.db)S.db.doc('plantings/'+p.id).set({crop:p.crop,method:p.method,date:p.date,label:p.label||'',bed:p.bed||'',by:p.by||S.me||''}).catch(()=>{})};
const dbDel=id=>{if(S.shared&&S.db)S.db.doc('plantings/'+id).delete().catch(()=>{})};
const dbFrost=()=>{if(S.shared&&S.db)S.db.doc('garden/settings').set({frost:S.frost}).catch(()=>{})};
async function loadNames(){
  try{const u=await claude.use('user');if(!u)return;const ids=[...new Set(S.plantings.map(p=>p.by).filter(Boolean))];if(!ids.length)return;
    const ps=await u.profiles(ids);ids.forEach(i=>{if(ps[i]&&ps[i].name)S.names[i]=ps[i].name});render()}catch(e){}
}
function attach(db,onLost){
  S.db=db;S.shared=true;
  return [
    db.collection('plantings').onSnapshot(snap=>{
      S.plantings=snap.docs.map(d=>Object.assign({id:d.id},d.data())).filter(p=>CROP[p.crop]&&p.method in METHODS&&/^[A-Za-z0-9_-]{1,40}$/.test(p.id));
      render();if(!C.sb)loadNames();
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

/* ---- Account en samen tuinieren in de webversie (Supabase) ----
   Tabellen: profiles {id, garden, gardens:{gid:naam}, name}
             gardens {id, owner, name, frost}, members {garden, uid, role: owner|edit|view, name, invite?}
             plantings {garden, id, crop, method, date, label, bed, by}, invites {code, garden, gname, role, by}
   Wie wat mag: zie supabase.sql. Inloggen kan pas na het bevestigen van het e-mailadres. */
const C={sb:null,user:null,gid:null,gname:'',role:null,members:[],gardens:{},unsub:[],err:'',newName:'',pend:null,mail:''};
const INV_KEY='sowly.uitnodiging';
const hasCloud=()=>typeof SB_URL!='undefined'&&typeof claude=='undefined';
const canEdit=()=>!C.sb||!S.shared||C.role!='view';
const myName=()=>(C.newName||(C.user&&((C.user.user_metadata||{}).name||(C.user.email||'').split('@')[0]))||tx('someone')).slice(0,40);
const role=r=>['owner','edit','view'].includes(r)?tx('role.'+r):'';
const here=()=>location.origin+location.pathname;
/* localStorage, niet sessionStorage: de bevestigingslink in de mail opent een nieuw tabblad */
const getInv=()=>{try{return localStorage.getItem(INV_KEY)}catch(e){return null}};
const dropInv=()=>{try{localStorage.removeItem(INV_KEY)}catch(e){}};
/* Alleen een vlaggetje dát je ingelogd was (niet de tuin zelf), zodat Sowly direct op Mijn tuin opent zonder hapering */
const IN_KEY='sowly.ingelogd';
const wasIn=()=>{try{return !!localStorage.getItem(IN_KEY)}catch(e){return false}};
const setIn=on=>{try{on?localStorage.setItem(IN_KEY,'1'):localStorage.removeItem(IN_KEY)}catch(e){}};
function toast(t){const el=document.createElement('div');el.className='toast';el.setAttribute('role','status');el.textContent=t;document.body.appendChild(el);setTimeout(()=>el.remove(),4500)}
const must=r=>{if(r&&r.error)throw r.error;return r&&r.data};
/* Live meelezen: ophalen, en opnieuw ophalen bij elke wijziging in de tabel (rij met kolom k == v).
   Verwijderen laat zich in Supabase niet filteren, dus dat filteren we zelf. Geeft een stopfunctie terug. */
function live(table,k,v,fetch,cb){
  let n=0;
  const load=()=>{const me=++n;fetch().then(r=>{if(me==n&&!r.error)cb(r.data)},()=>{})};
  const f={schema:'public',table,filter:`${k}=eq.${v}`};
  const ch=C.sb.channel('sowly-'+table+'-'+Math.random().toString(36).slice(2))
    .on('postgres_changes',Object.assign({event:'INSERT'},f),load)
    .on('postgres_changes',Object.assign({event:'UPDATE'},f),load)
    .on('postgres_changes',{event:'DELETE',schema:'public',table},p=>{if(p.old&&p.old[k]==v)load()})
    .subscribe(st=>{if(st=='SUBSCRIBED')load()});
  load();
  return ()=>{C.sb.removeChannel(ch)};
}
function cloudDb(gid){
  /* Zelfde vorm als claude.use('db'), zodat dbSet, dbDel en dbFrost niets hoeven te weten */
  const sb=C.sb;
  const snap=rows=>({docs:rows.map(r=>{const {garden,id,...d}=r;return {id,data:()=>d}})});
  return {
    doc:p=>{
      if(p=='garden/settings')return {
        set:d=>sb.from('gardens').update({frost:d.frost}).eq('id',gid).then(must),
        onSnapshot:cb=>live('gardens','id',gid,()=>sb.from('gardens').select('frost').eq('id',gid).maybeSingle(),d=>cb({data:()=>d}))
      };
      const id=p.split('/')[1];
      return {
        /* "by" vult de database zelf in (zie supabase.sql) */
        set:d=>{const {by,...r}=d;return sb.from('plantings').upsert(Object.assign(r,{garden:gid,id})).then(must)},
        delete:()=>sb.from('plantings').delete().eq('garden',gid).eq('id',id).then(must)
      };
    },
    collection:n=>({onSnapshot:cb=>live(n,'garden',gid,()=>sb.from(n).select('*').eq('garden',gid),rows=>cb(snap(rows)))})
  };
}
async function startCloud(){
  if(!hasCloud())return;
  const inv=new URLSearchParams(location.search).get('uitnodiging');
  if(inv){try{localStorage.setItem(INV_KEY,inv)}catch(e){}history.replaceState(null,'',location.pathname+location.hash)}
  /* Een verlopen of al gebruikte link uit een mail komt terug met een fout achter het hekje */
  const h=new URLSearchParams(location.hash.slice(1));
  if(h.get('error')){history.replaceState(null,'',location.pathname);setTimeout(()=>toast(tx(h.get('error_code')=='otp_expired'?'link.expired':'link.bad')),300)}
  try{C.sb=await sbLoad()}catch(e){C.wait=false;C.err=tx('err.loginDown');render();return}
  let first=true,uid;
  C.sb.auth.onAuthStateChange((ev,ses)=>{
    const u=ses&&ses.user||null,same=!first&&(u&&u.id)==uid;
    C.user=u;uid=u&&u.id;setIn(!!u);
    if(/access_token|type=/.test(location.hash))history.replaceState(null,'',location.pathname);
    /* Geen Supabase-aanroepen binnen deze terugroep (dat blokkeert), dus pas erna */
    setTimeout(()=>{
      if(ev=='PASSWORD_RECOVERY')openLogin('nieuwpw');
      if(same){render();return}/* alleen een ververste sessie */
      if(u){C.mail='';enterCloud().catch(e=>{C.wait=false;C.err=tx('err.gardenOpen');console.error(e);render()})}
      else{
        C.wait=false;C.newName='';
        if(S.shared){location.reload();return}
        if(first&&getInv())openLogin('in',tx('login.invited'));
      }
      first=false;render();
    },0);
  });
}
/* Bevestigingsmail opnieuw sturen naar het adres waarmee je net een account maakte */
const sendVerify=()=>C.sb.auth.resend({type:'signup',email:C.mail,options:{emailRedirectTo:here()}}).then(must);
async function checkVerified(){
  const s=must(await C.sb.auth.getSession());
  if(!s||!s.session)openLogin('in',tx('login.clickFirst'));
}
async function isMember(gid){
  const r=await C.sb.from('members').select('uid').eq('garden',gid).eq('uid',C.user.id).maybeSingle();
  return !r.error&&!!r.data;
}
async function enterCloud(){
  const sb=C.sb,u=C.user;
  const prof=must(await sb.from('profiles').select('garden,gardens').eq('id',u.id).maybeSingle())||{};
  const gardens=Object.assign({},prof.gardens);let gid=prof.garden;
  const inv=getInv();
  if(inv){dropInv();const j=await joinInvite(inv);if(j){gardens[j.gid]=j.name;gid=j.gid;toast(tx('joined',{name:j.name}));S.view='tuin'}}
  for(const g of Object.keys(gardens))if(!(await isMember(g)))delete gardens[g];
  if(!gid||!gardens[gid])gid=Object.keys(gardens)[0];
  if(!gid){
    /* Eerste keer: eigen tuin aanmaken, met jezelf als eigenaar */
    gid=must(await sb.rpc('create_garden',{gname:tx('garden.of',{name:myName()}).slice(0,80),gfrost:S.frost,mname:myName()}));
    gardens[gid]=tx('garden.mine');
  }
  must(await sb.from('profiles').upsert({id:u.id,garden:gid,gardens,name:myName()}));
  C.gardens=gardens;C.newName='';C.err='';
  await openGarden(gid);
  /* Ingelogd: Mijn tuin is de startpagina, tenzij je zelf al een ander tabblad koos */
  if(!S.picked)S.view='tuin';
  C.wait=false;
  render();
  /* Wie vóór het inloggen op Planten klikte, gaat daar nu verder */
  if(C.pend&&canEdit()){const p=C.pend;C.pend=null;S.view='tuin';render();openAdd(p.id,p.m)}
}
async function joinInvite(code){
  const r=await C.sb.rpc('join_invite',{code,mname:myName()}),j=r.data&&r.data[0];
  if(r.error||!j){toast(tx('invite.gone'));return null}
  return {gid:j.garden,name:j.gname||tx('garden.shared')};
}
async function openGarden(gid){
  const sb=C.sb;
  C.unsub.forEach(f=>f());C.unsub=[];
  const [me,g]=await Promise.all([sb.from('members').select('role').eq('garden',gid).eq('uid',C.user.id).maybeSingle(),sb.from('gardens').select('name').eq('id',gid).maybeSingle()]);
  if(!must(me))throw new Error('Geen lid van deze tuin');
  C.gid=gid;C.role=me.data.role;C.gname=(g.data||{}).name||'';S.me=C.user.id;
  let gone=false;
  const lost=()=>{if(gone)return;gone=true;toast(tx('noAccess'));enterCloud().catch(()=>{})};
  C.unsub=attach(cloudDb(gid),lost);
  /* Zie je jezelf niet meer bij de leden, dan ben je uit de tuin gehaald */
  C.unsub.push(live('members','garden',gid,()=>sb.from('members').select('uid,role,name,invite').eq('garden',gid),rows=>{
    if(!C.user||C.gid!=gid)return;
    if(!rows.some(m=>m.uid==C.user.id))return lost();
    C.members=rows;C.members.forEach(m=>S.names[m.uid]=m.name);render();
  }));
}
async function switchGarden(gid){
  must(await C.sb.from('profiles').update({garden:gid}).eq('id',C.user.id));
  await openGarden(gid);render();
}
async function leaveGarden(){
  const sb=C.sb,gid=C.gid;
  must(await sb.from('members').delete().eq('garden',gid).eq('uid',C.user.id));
  delete C.gardens[gid];
  must(await sb.from('profiles').update({garden:Object.keys(C.gardens)[0]||null,gardens:C.gardens}).eq('id',C.user.id));
  await enterCloud();
}
async function kick(uid){
  /* Ook de uitnodiging intrekken waarmee die persoon binnenkwam, anders kan die zo weer terug */
  const sb=C.sb,m=C.members.find(x=>x.uid==uid);
  must(await sb.from('members').delete().eq('garden',C.gid).eq('uid',uid));
  if(m&&m.invite)await sb.from('invites').delete().eq('code',m.invite);
}
function inviteCode(){const a=new Uint8Array(16);crypto.getRandomValues(a);return [...a].map(x=>'abcdefghijkmnpqrstuvwxyz23456789'[x%32]).join('')}
async function makeInvite(role){
  const code=inviteCode();
  must(await C.sb.from('invites').insert({code,garden:C.gid,gname:C.gname||tx('garden.shared'),role,by:C.user.id}));
  const url=here()+'?uitnodiging='+code;
  openSheet(`<h2 id="sh-title" style="padding-right:48px">${tx('inv.madeTitle')}</h2><p>${tx(role=='edit'?'inv.madeEdit':'inv.madeView')}</p><div class="field"><label for="inv-url">${tx('inv.link')}</label><input id="inv-url" readonly value="${esc(url)}"></div><div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn" data-a="copyinv">${tx('inv.copy')}</button>${navigator.share?`<button class="btn ghost" data-a="shareinv">${tx('inv.share')}</button>`:''}</div><p class="small muted" style="margin-top:12px">${tx('inv.madeNote')}</p>`);
}
function openInvite(){
  openSheet(`<h2 id="sh-title" style="padding-right:48px">${tx('inv.title')}</h2><p>${tx('inv.q')}</p><div class="stack" style="gap:8px"><button class="btn" data-a="mkinv" data-m="edit">${tx('inv.edit')}</button><button class="btn ghost" data-a="mkinv" data-m="view">${tx('inv.view')}</button></div><p class="small muted" style="margin-top:12px">${tx('inv.note')}</p>`);
}
const AUTH_ERR={invalid_credentials:'cred',email_address_invalid:'mail',validation_failed:'mail',user_already_exists:'exists',email_exists:'exists',weak_password:'weak',same_password:'same',over_request_rate_limit:'rate',over_email_send_rate_limit:'mailrate',signup_disabled:'nosignup',email_provider_disabled:'noprovider'};
const authErr=x=>tx('ae.'+(AUTH_ERR[x&&x.code]||(x&&(x.name=='AuthRetryableFetchError'||x.status===0)?'offline':'generic')));
/* mode: in, nieuw, vergeten, nieuwpw (na de link uit de herstelmail) */
function openLogin(mode,intro){
  const nieuw=mode=='nieuw',verg=mode=='vergeten',npw=mode=='nieuwpw';
  const title=tx(npw?'lg.newpw':verg?'lg.forgot':nieuw?'lg.signup':'lg.login');
  const pw=verg?'':`<div class="field"><label for="l-pw">${tx(npw?'lg.newpw':'lg.pw')}${nieuw||npw?' '+tx('lg.min8'):''}</label><input type="password" id="l-pw"${nieuw||npw?' minlength="8"':''} autocomplete="${nieuw||npw?'new-password':'current-password'}" required></div>`;
  const links=npw?'':`<p class="small" style="margin-top:14px">${mode=='in'?`<a href="#" data-a="login" data-m="nieuw">${tx('lg.noAccount')}</a><br><a href="#" data-a="login" data-m="vergeten">${tx('lg.forgotQ')}</a>`:`<a href="#" data-a="login" data-m="in">${tx('lg.back')}</a>`}</p>`;
  openSheet(`<h2 id="sh-title" style="padding-right:48px;margin-bottom:10px">${title}</h2>${intro?`<p>${intro}</p>`:''}<form id="loginf">${nieuw?`<div class="field"><label for="l-name">${tx('lg.name')}</label><input id="l-name" maxlength="40" autocomplete="name" required><span class="small muted">${tx('lg.nameNote')}</span></div>`:''}${npw?'':`<div class="field"><label for="l-mail">${tx('lg.mail')}</label><input type="email" id="l-mail" autocomplete="email" required></div>`}${pw}<p class="small" id="l-err" role="alert" style="margin:0 0 10px"></p><button class="btn" type="submit">${tx(npw?'lg.savePw':verg?'lg.sendReset':nieuw?'lg.signup':'lg.login')}</button></form>${links}`);
  if(C.mail&&$('#l-mail'))$('#l-mail').value=C.mail;
  $('#loginf').onsubmit=async e=>{
    e.preventDefault();
    const sb=C.sb,auth=sb.auth,mail=npw?'':$('#l-mail').value.trim(),out=$('#l-err'),btn=e.target.querySelector('[type=submit]');
    const done=()=>{closeSheet();S.view='tuin';render();scrollTo(0,0)};
    out.textContent='';btn.disabled=true;
    try{
      if(npw){must(await auth.updateUser({password:$('#l-pw').value}));closeSheet();toast(tx('lg.pwChanged'));return}
      if(verg){must(await auth.resetPasswordForEmail(mail,{redirectTo:here()}));out.textContent=tx('lg.resetSent');btn.disabled=false;return}
      if(nieuw){
        C.newName=$('#l-name').value.trim();
        const d=must(await auth.signUp({email:mail,password:$('#l-pw').value,options:{data:{name:C.newName,lang:LANG.slice(0,2)},emailRedirectTo:here()}}));
        /* Bestaat het adres al, dan geeft Supabase een gebruiker zonder identiteiten terug en stuurt geen mail */
        if(d.user&&d.user.identities&&!d.user.identities.length)throw {code:'user_already_exists'};
        if(!d.session)C.mail=mail;/* eerst het e-mailadres bevestigen, zie accountCard */
        return done();
      }
      const r=await auth.signInWithPassword({email:mail,password:$('#l-pw').value});
      if(r.error&&r.error.code=='email_not_confirmed'){C.mail=mail;done();toast(tx('lg.confirmFirst'));return}
      must(r);done();
    }catch(x){if(nieuw)C.newName='';out.textContent=authErr(x);btn.disabled=false}
  };
}
function needLogin(pend){
  if(!C.sb){toast(C.err||tx('need.loading'));return}
  if(C.user){toast(C.err||tx('need.opening'));return}
  C.pend=pend;
  if(C.mail){closeSheet();S.view='tuin';render();scrollTo(0,0);toast(tx('need.confirm'));return}
  openLogin('in',tx('need.login'));
}
function accountCard(){
  if(!C.sb)return `<section class="card"><div class="sec-h"><h3>${tx('acc.title')}</h3></div><p class="muted small" style="margin:0">${C.err||tx('acc.loading')}</p></section>`;
  if(!C.user&&C.mail)return `<section class="card"><div class="sec-h"><h3>${tx('acc.confTitle')}</h3></div><p class="small" style="margin:0 0 10px">${tx('acc.confText',{mail:`<b>${esc(C.mail)}</b>`})}</p><div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn sm" data-a="verified">${tx('acc.confirmed')}</button><button class="btn sm ghost" data-a="resend">${tx('acc.resend')}</button></div><p class="small muted" style="margin:12px 0 0"><a href="#" data-a="login" data-m="in">${tx('acc.other')}</a></p></section>`;
  if(!C.user){
    return `<section class="card"><div class="sec-h"><h3>${tx('acc.saveTitle')}</h3></div><p class="small" style="margin:0 0 10px">${tx('acc.saveText')}</p><button class="btn sm" data-a="login" data-m="in">${tx('acc.saveBtn')}</button></section>`;
  }
  if(!S.shared)return `<section class="card"><div class="sec-h"><h3>${tx('acc.title')}</h3></div><p class="small" style="margin:0 0 10px">${C.err||tx('acc.opening')}</p><a href="#" class="small" data-a="logout">${tx('logout')}</a></section>`;
  const own=C.role=='owner',gs=Object.entries(C.gardens);
  const sel=gs.length>1?`<div class="field"><label for="g-sel">${tx('acc.garden')}</label><select id="g-sel">${gs.map(([g,n])=>`<option value="${g}"${g==C.gid?' selected':''}>${esc(n)}</option>`).join('')}</select></div>`:'';
  const who=C.members.map(m=>`<span class="pill soft">${esc(m.name||tx('someone'))}${m.uid==S.me?' '+tx('youMark'):''} · ${role(m.role)}${own&&m.uid!=S.me?` <button class="linkbtn" data-a="kick" data-id="${esc(m.uid)}" aria-label="${esc(tx('kick.label',{name:m.name||tx('someone')}))}">${S.confirm=='kick:'+m.uid?tx('kick.yes'):'×'}</button>`:''}</span>`).join(' ');
  const intro=own?tx('acc.own'):tx(C.role=='edit'?'acc.edit':'acc.view',{g:`<b>${esc(C.gname)}</b>`});
  return `${sel}<p class="small" style="margin:0 0 8px">${intro}</p>${who?`<div class="row" style="gap:6px;flex-wrap:wrap;margin-bottom:10px">${who}</div>`:''}<div class="row" style="gap:8px;flex-wrap:wrap">${own?`<button class="btn sm" data-a="invite">${tx('acc.invite')}</button>`:`<button class="btn sm ghost" data-a="leave">${tx(S.confirm=='leave'?'leave.yes':'leave')}</button>`}</div><p class="small muted" style="margin:12px 0 0">${tx('loggedAs',{name:esc(myName())})}${C.user.email?' ('+esc(C.user.email)+')':''}. <a href="#" data-a="logout">${tx('logout')}</a></p>`;
}
/* Ingelogd met een online tuin: Samen tuinieren als knopje rechts bovenin, de inhoud in een blad */
const samenBtn=()=>`<button class="btn sm ghost" data-a="samen" aria-label="${tx('samen.aria',{n:C.members.length,p:tx(C.members.length==1?'person1':'personN')})}">${tx('samen')} <span class="pill soft">${C.members.length}</span></button>`;
function openSamen(){openSheet(`<h2 id="sh-title" style="padding-right:48px">${tx('samen.title')}</h2><div id="samen-b">${accountCard()}</div>`)}

/* ---- Rechtsboven: vlag (taal, altijd) en tandwiel (instellingen, alleen ingelogd) ---- */
const loggedIn=()=>hasCloud()?!!C.user:S.shared;
const GEAR='<svg class="gear" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
const topBtns=()=>`<button class="icon-btn topb" data-a="langs" aria-label="${esc(tx('lang.btn',{name:LANGS[LANG].name}))}">${flagSVG(LANG)}</button>${loggedIn()?`<button class="icon-btn topb" data-a="settings" aria-label="${tx('set.btn')}">${GEAR}</button>`:''}`;
const langList=()=>`<div class="langs">${LANG_ORDER.filter(c=>LANGS[c]).map(c=>`<button class="btn ghost langb" data-a="lang" data-l="${c}" lang="${c}" aria-pressed="${c==LANG}">${flagSVG(c)}<span>${LANGS[c].name}</span></button>`).join('')}</div>`;
function openLangs(){openSheet(`<h2 id="sh-title" style="padding-right:48px">${tx('lang.title')}</h2><div id="lang-s">${langList()}</div><p class="small muted" style="margin:12px 0 0">${tx('lang.note')}</p>`)}
function settingsBody(){
  const fd=dateOfDoy(Y0,S.frost*7-3);
  const acc=hasCloud()&&C.user?`<section class="card"><div class="sec-h"><h3>${tx('set.account')}</h3></div><p class="small" style="margin:0 0 10px">${tx('loggedAs',{name:`<b>${esc(myName())}</b>`})}${C.user.email?' ('+esc(C.user.email)+')':''}</p><div class="row" style="gap:8px;flex-wrap:wrap">${S.shared?`<button class="btn sm ghost" data-a="samen">${tx('set.samen')}</button>`:''}<button class="btn sm ghost" data-a="logout">${tx('logout')}</button></div></section>`:'';
  return `<h2 id="sh-title" style="padding-right:48px">${tx('set.title')}</h2><div class="stack"><section class="card"><div class="sec-h"><h3>${tx('set.lang')}</h3></div>${langList()}<p class="small muted" style="margin:10px 0 0">${tx('lang.note')}</p></section><section class="card">${frostRow(fd)}${S.shared&&C.members.length>1?`<p class="small muted" style="margin:8px 0 0">${tx('set.frostShared')}</p>`:''}</section>${acc}</div>`;
}
function openSettings(){openSheet(`<div id="set-b">${settingsBody()}</div>`)}
/* Vaste teksten in de pagina zelf (template.html): data-t vult de tekst, data-ta het aria-label */
function applyStatic(){
  if(document.documentElement)document.documentElement.lang=LANG;
  $$('[data-t]').forEach(el=>{el.textContent=tx(el.dataset.t)});
  $$('[data-ta]').forEach(el=>el.setAttribute('aria-label',tx(el.dataset.ta)));
  $('#today').textContent=tx('today',{day:cap(CAL.d[TODAY.getDay()]),d:TODAY.getDate(),month:CAL.m[TODAY.getMonth()],w:weekOf(TODAY)});
  const m=$('#mascot svg');if(m)m.setAttribute('aria-label',tx('mascot'));
}
/* Taal wisselen: onthouden in deze browser (alleen de taal, niet de tuin) */
function setLang(code){
  if(!LANGS[code]||code==LANG){if($('#lang-s'))closeSheet();return}
  try{localStorage.setItem(LANG_KEY,code)}catch(e){}
  const fromLangs=!!$('#lang-s');
  applyLang(code);applyStatic();
  /* Taal ook in het account, zodat de mails van Supabase later in de juiste taal kunnen (.Data.lang in de mailsjablonen) */
  if(C.sb&&C.user)C.sb.auth.updateUser({data:{lang:LANG.slice(0,2)}}).catch(()=>{});
  if(S.plantings.every(p=>p.ex))S.plantings=examples();
  render();
  if(fromLangs)closeSheet();
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
  return m.map(([a,b])=>wm(a)==wm(b)?CAL.m3[wm(a)]:`${CAL.m3[wm(a)]}–${CAL.m3[wm(b)]}`).join(', ');
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
  A('zaai',0,c.poten&&p.method=='buiten'?tx('tl.plant'):ACT[p.method].n);
  A('kiem',d.kiem,tx(c.poten?'tl.shoot':'tl.sprout'));
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
const adSlot=()=>COMMERCE?`<div class="ad">${tx('ad')}</div>`:'';
const SHOPS=[{n:'',u:''},{n:'',u:''},{n:'',u:''}];/* n leeg: voorbeeldnaam uit de taal */
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
  return `<section class="card"><div class="sec-h"><h3>${tx('seed.title')}</h3><span class="pill soft">${tx('example')}</span></div>${L.map(({c,gap,a})=>`<div class="task"><div class="task-main" style="cursor:default">${taskPlant(c,3)}<span><b>${c.n}</b><span class="muted small">${gap?tx('seed.from',{d:fmt(dateOfDoy(Y0,(a-1)*7+1))}):tx('seed.now')}</span></span></div><button class="btn sm" data-a="seed" data-id="${c.id}">${tx('seed.find')}</button></div>`).join('')}<p class="muted small" style="margin:8px 0 0">${tx('seed.aff')}</p></section>`;
}
function openSeed(id){
  const c=CROP[id];
  openSheet(`<h2 id="sh-title" style="padding-right:48px">${tx('seed.sheet',{c:c.n})}</h2><div class="bigplant"><div class="pp">${plantSVG(c,4)}</div></div><p style="margin:12px 0 8px">${tx('seed.pick',{q:`<b>${tx('seed.q',{c:lc(c.n)})}</b>`})}</p><div class="stack" style="gap:8px">${SHOPS.map((s,i)=>`<button class="btn" style="width:100%${s.u?'':';opacity:.75'}" ${s.u?'':'disabled'}>${s.n||tx('shop',{n:i+1})} <span class="small">${tx('seed.afflabel')}</span></button>`).join('')}</div><p class="muted small" style="margin:12px 0 0">${tx('seed.example')}</p>`);
}
/* Laatste nachtvorst: in Deze maand en in de instellingen */
function frostRow(fd){
  return `<div class="frost"><div class="grow1"><b>${tx('frost.title',{w:S.frost})}</b> <span class="muted">${tx('frost.around',{d:fmt(fd)})}</span><div class="small muted">${tx('frost.note')}</div></div><button class="icon-btn" data-a="fminus" aria-label="${tx('frost.earlier')}">−</button><button class="icon-btn" data-a="fplus" aria-label="${tx('frost.later')}">+</button></div>`;
}
function vMaand(){
  const g=monthTasks(S.y,S.m),order=Object.keys(ACT).sort((a,b)=>ACT[a].o-ACT[b].o);
  const fd=dateOfDoy(S.y,S.frost*7-3);
  let h=`<div class="stack"><div class="monthnav"><button class="icon-btn" data-a="mprev" aria-label="${tx('m.prev')}">‹</button><h2>${cap(CAL.m[S.m])} ${S.y}</h2><button class="icon-btn" data-a="mnext" aria-label="${tx('m.next')}">›</button></div>`;
  h+=frostRow(fd);
  const cur=S.y==Y0&&S.m==TODAY.getMonth();
  if(COMMERCE&&cur)h+=zaadCard();
  let n=0;
  order.forEach(k=>{
    const L=g[k];if(!L)return;n+=L.length;
    h+=`<section class="card"><div class="sec-h"><span class="pill" style="--pc:var(${ACT[k].c})">${ACT[k].n}</span><span class="muted small">${L.length} ${tx(L.length==1?'crop1':'cropN')}</span></div>`;
    /* In de huidige maand: wat vóór vandaag is afgelopen grijs en onderaan */
    L.map(x=>{const ed=dateOfDoy(S.y,x.st.b*7);return {...x,ed,past:cur&&mid(ed)<mid(TODAY)}}).sort((p,q)=>p.past-q.past).forEach(({c,st,wA,ed,past})=>{
      const sd=dateOfDoy(S.y,(st.a-1)*7+1);
      const note=(past?tx('past')+' · ':'')+(st.l?tx('per.'+st.l)+' · ':'')+(st.a>=wA?tx('from',{d:fmt(sd)}):tx('until',{d:fmt(ed)}));
      const sow=k=='binnen'||k=='glas'||k=='buiten';
      h+=`<div class="task${past?' past':''}"><button class="task-main" data-a="crop" data-id="${c.id}">${taskPlant(c,sow?4:ACT[k].st)}<span><b>${c.n}</b><span class="muted small">${note}</span>${yearChart(c,1)}</span></button>${sow?`<button class="btn sm ghost" data-a="add" data-id="${c.id}" data-m="${k}">${tx('plantBtn')}</button>`:''}</div>`;
    });
    h+='</section>';
  });
  if(!n)h+=`<div class="card empty"><b>${tx('m.emptyT')}</b><p class="muted">${tx('m.emptyP')}</p></div>`;
  h+=`${adSlot()}</div>`;
  return h;
}
const KOOL=KOOLID;
const expand=a=>a.flatMap(x=>x=='aardappel'?['aardappel-vroeg','aardappel-laat']:x=='kool'?KOOL:[x]);
const LV={l:{zon:3,zh:2,half:1},w:{veel:3,gemiddeld:2,weinig:1},v:{zwaar:3,middel:2,licht:1}};
const chip=x=>CROP[x]?`<button class="chip" data-a="crop" data-id="${x}">${CROP[x].n}</button>`:`<span class="chip">${x=='aardappel'||x=='kool'?tx('chip.'+x):esc(x)}</span>`;
function careHTML(id){
  const k=NB[id];if(!k)return '';
  const row=(t,key)=>{const [lv,txt]=k[key],n=LV[key][lv],name=tx('lv.'+key+'.'+lv),ok=k.b[key];return `<div class="cr"><span class="cl">${t}</span><span class="cv"><span class="dots" aria-hidden="true">${'●'.repeat(n)}${'○'.repeat(3-n)}</span> ${name}</span><span class="cd">${txt}</span><span class="${ok?'bv':'nb'}">${tx(ok?'care.ok':'care.unc')}</span></div>`};
  const lijst=(arr,cls,t)=>arr.length?`<div class="small muted" style="margin:10px 0 4px">${t}</div><div class="chips ${cls}">${arr.map(chip).join('')}</div>`:'';
  const bev=lijst(k.g,'good',tx('nb.good'))+lijst(k.s,'bad',tx('nb.bad'));
  const meer=k.g2.length||k.s2.length?`<details class="more"><summary>${tx('nb.more')}</summary>${lijst(k.g2,'good unc',tx('nb.good2'))}${lijst(k.s2,'bad unc',tx('nb.bad2'))}</details>`:'';
  return `<h3 style="margin-top:14px">${tx('care.title')}</h3><div class="care">${row(tx('care.l'),'l')}${row(tx('care.w'),'w')}${row(tx('care.v'),'v')}</div><h3 style="margin-top:14px">${tx('nb.title')}</h3>${bev||`<p class="small muted" style="margin:6px 0 0">${tx('nb.none')}</p>`}${meer}`;
}
function neighbourCard(){
  const by={};S.plantings.forEach(p=>{const b=(p.bed||'').trim().toLowerCase();if(b)(by[b]=by[b]||[]).push(p)});
  const out=[],seen=new Set();
  Object.values(by).forEach(L=>{for(let i=0;i<L.length;i++)for(let j=i+1;j<L.length;j++){
    const a=L[i],c=L[j];if(a.crop==c.crop)continue;
    const A=NB[a.crop],B=NB[c.crop],key=[a.crop,c.crop].sort().join('|')+L[0].bed.toLowerCase();if(!A||!B||seen.has(key))continue;seen.add(key);
    const bad=expand(A.s).includes(c.crop)||expand(B.s).includes(a.crop),good=expand(A.g).includes(c.crop)||expand(B.g).includes(a.crop);
    if(bad||good)out.push({bad,t:tx('nbc.pair',{a:CROP[a.crop].n,b:CROP[c.crop].n,bed:esc(L[0].bed),v:tx(bad?'nbc.bad':'nbc.good')})});
  }});
  if(!out.length)return '';
  out.sort((x,y)=>y.bad-x.bad);
  return `<section class="card"><div class="sec-h"><h3>${tx('nbc.title')}</h3></div>${out.slice(0,8).map(o=>`<div class="row" style="padding:4px 0"><span class="pill" style="--pc:var(${o.bad?'--c-oogst':'--c-buiten'})">${tx(o.bad?'nbc.warn':'nbc.ok')}</span><span class="grow1 small">${o.t}</span></div>`).join('')}<p class="small muted" style="margin:6px 0 0">${tx('nbc.note')}</p></section>`;
}
const byName=(a,b)=>a.n.localeCompare(b.n,LANG);
function gridHTML(){
  const q=(S.q||'').trim().toLowerCase(),L=[...CROPS].sort(byName).filter(c=>c.n.toLowerCase().includes(q));
  return L.length?L.map(c=>`<button class="crop" data-a="crop" data-id="${c.id}"><div class="pp">${plantSVG(c,4)}</div><h3>${c.n}</h3><span class="small muted">${tx('g.sow',{r:ranges(c,['binnen','glas','buiten'])})}<br>${tx('g.harvest',{r:ranges(c,['oogst'])})}</span><span class="seedrow">${COMMERCE?`<span class="seedlink" role="button" data-a="seed" data-id="${c.id}">${tx('seed.find')}</span>`:''}<span class="seedlink plant" role="button" data-a="add" data-id="${c.id}">${tx('g.plus')}</span></span></button>`).join(''):`<p class="muted">${tx('g.none',{q:esc(S.q)})}</p>`;
}
function vGewassen(){
  return `<div class="stack"><div class="row"><h2 class="grow1">${tx('g.title')}</h2><span class="muted small">${tx('g.count',{n:CROPS.length})}</span></div><div class="field" style="margin:0"><label for="q">${tx('g.search')}</label><input id="q" type="search" value="${esc(S.q||'')}" placeholder="${tx('g.ph')}" autocomplete="off"></div><div class="grid" id="grid">${gridHTML()}</div></div>`;
}
function ganttOf(p,ev){
  const seq=ev.filter(e=>e.k!='kiem'),t0=ev[0].dt,end=seq[seq.length-1].end,tot=Math.max(1,diff(t0,end));
  const segs=seq.map((e,i)=>{const to=seq[i+1]?seq[i+1].dt:e.end,w=Math.max(0,diff(e.dt,to))/tot*100,col=e.k=='zaai'?ACT[p.method].c:ACT[e.k].c;return `<i style="width:${w.toFixed(2)}%;--sc:var(${col})"></i>`}).join('');
  const pos=Math.max(0,Math.min(100,diff(t0,TODAY)/tot*100));
  return `<div class="gantt" role="img" aria-label="${tx('gantt')}">${segs}<span class="t" style="left:calc(${pos.toFixed(1)}% - 1.5px)"></span></div>`;
}
function plantCard(p){
  const c=CROP[p.crop],ev=timeline(p),st=stageOf(p),t=diff(parse(p.date),TODAY);
  const firstOpen=ev.findIndex(e=>TODAY<=(e.end||e.dt));
  let steps='';
  ev.forEach((e,i)=>{
    const over=TODAY>(e.end||e.dt),cls=over?'done':i==firstOpen?'now':'';
    const dt=e.end?`${fmt(e.dt)} – ${fmt(e.end)}`:fmt(e.dt);
    const sub=i==firstOpen&&!over?` <span class="muted small">· ${e.end&&TODAY>=e.dt?tx('pc.busy'):rel(diff(TODAY,e.dt))}</span>`:'';
    steps+=`<li class="${cls}"><span class="dot">${over?'✓':''}</span><span><b>${e.l}</b><br><span class="small">${dt}</span>${sub}</span></li>`;
  });
  const status=firstOpen<0?tx('pc.done'):t<0?tx('pc.sowOn',{d:fmt(parse(p.date))}):tx('pc.day',{n:t+1,stage:lc(STAGE_NAMES[st])});
  return `<article class="card plant-card${S.newId==p.id?' pop':''}"><div class="plant-head"><div class="pp">${plantSVG(c,Math.max(0,st))}</div><div class="grow1"><h3>${dot(p)}${nm(p)}${p.ex?` <span class="pill soft">${tx('example')}</span>`:''}</h3><div class="small muted">${p.bed?esc(p.bed)+' · ':''}${tx('pc.methodOn',{m:METHODS[p.method],d:fmt(parse(p.date))})}${S.shared&&p.by?' · '+tx('pc.by',{name:esc(whoName(p.by))}):''}</div><div class="small"><b>${status}</b></div></div><div class="del row"><button class="btn sm ghost" data-a="edit" data-id="${esc(p.id)}">${tx('edit')}</button><button class="btn sm ghost" data-a="del" data-id="${esc(p.id)}">${tx(S.confirm==p.id?'del.yes':'del')}</button></div></div>${ganttOf(p,ev)}<ol class="steps">${steps}</ol></article>`;
}
function upcoming(){
  const L=[];
  S.plantings.forEach(p=>timeline(p).forEach(e=>{
    if(e.k=='zaai'||e.k=='kiem')return;
    const act=e.end&&e.dt<=TODAY&&e.end>=TODAY,soon=e.dt>=TODAY&&diff(TODAY,e.dt)<=30;
    if(act||soon)L.push({dt:act?TODAY:e.dt,p,e,act});
  }));
  L.sort((a,b)=>a.dt-b.dt);
  const rows=L.slice(0,8).map(x=>`<div class="row" style="padding:6px 0"><b style="min-width:62px">${x.act?tx('up.now'):fmt(x.dt)}</b><span class="pill" style="--pc:var(${ACT[x.e.k].c})">${ACT[x.e.k].n}</span><span class="grow1">${dot(x.p)}${nm(x.p)}</span></div>`).join('');
  return `<section class="card"><div class="sec-h"><h3>${tx('up.title')}</h3></div>${rows||`<p class="muted" style="margin:0">${tx('up.none')}</p>`}</section>`;
}
/* ---- Jaarplanning om uit te printen of als pdf op te slaan (printvenster van de browser) ---- */
const mine=()=>S.plantings.filter(p=>!p.ex);
const planEv=p=>timeline(p).filter(e=>e.k!='kiem');
function planYears(){
  const ys=new Set();mine().forEach(p=>planEv(p).forEach(e=>{ys.add(e.dt.getFullYear());if(e.end)ys.add(e.end.getFullYear())}));
  return [...ys].sort().slice(-4);
}
function yearPlanHTML(y){
  const y0=new Date(y,0,1,12),y1=new Date(y,11,31,12),len=diff(y0,y1)+1;
  const pct=d=>(Math.max(0,Math.min(len,diff(y0,d)))/len*100).toFixed(2);
  const dim=[...Array(12)].map((_,i)=>new Date(y,i+1,0).getDate());
  const track=bars=>`<div class="jp-t">${dim.map(d=>`<span style="--d:${d}"></span>`).join('')}${bars}</div>`;
  const used=new Set(),rows=[],todo=[...Array(12)].map(()=>[]);
  mine().map(p=>({p,ev:planEv(p)})).sort((a,b)=>a.ev[0].dt-b.ev[0].dt).forEach(({p,ev})=>{
    /* Balk: van elke stap tot de volgende, net als de tijdlijn op de plantkaart */
    const bars=ev.map((e,i)=>{const to=ev[i+1]?ev[i+1].dt:e.end;if(!to||to<y0||e.dt>y1)return '';const col=e.k=='zaai'?ACT[p.method].c:ACT[e.k].c;used.add(e.k=='zaai'?p.method:e.k);
      return `<i style="left:${pct(e.dt)}%;width:${(pct(to)-pct(e.dt)).toFixed(2)}%;--sc:var(${col})"></i>`}).join('');
    if(bars)rows.push(`<div class="jp-r"><span><b>${nm(p)}</b>${p.bed?`<br><span class="jp-s">${esc(p.bed)}</span>`:''}</span>${track(bars)}</div>`);
    ev.forEach(e=>{if(e.dt.getFullYear()==y)todo[e.dt.getMonth()].push({p,e})});
  });
  const legend=Object.keys(ACT).filter(k=>used.has(k)).sort((a,b)=>ACT[a].o-ACT[b].o).map(k=>`<span class="pill" style="--pc:var(${ACT[k].c})">${ACT[k].n}</span>`).join(' ');
  const months=todo.map((L,m)=>L.length?`<section><h3>${cap(CAL.m[m])}</h3><ul>${L.sort((a,b)=>a.e.dt-b.e.dt).map(({p,e})=>`<li><span class="jp-box"></span><span>${e.end?`${fmt(e.dt)} – ${fmt(e.end)}`:fmt(e.dt)}</span><span class="pill" style="--pc:var(${e.k=='zaai'?ACT[p.method].c:ACT[e.k].c})">${e.l}</span><span>${nm(p)}${p.bed?' · '+esc(p.bed):''}</span></li>`).join('')}</ul></section>`:'').join('');
  const fd=dateOfDoy(y,S.frost*7-3);
  const today=tx('longdate',{d:TODAY.getDate(),month:CAL.m[TODAY.getMonth()],y:Y0});
  return `<div class="jp"><h1>${tx('yp.title',{y})}</h1><p class="jp-s">${tx('yp.sub',{g:esc(C.gname||tx('garden.mine')),w:S.frost,d:fmt(fd),today})}</p><div class="jp-r jp-h"><span></span><div class="jp-t">${dim.map((d,i)=>`<span style="--d:${d}">${CAL.m3[i]}</span>`).join('')}</div></div>${rows.join('')}<p>${legend}</p><div class="jp-m"><h2>${tx('yp.month')}</h2>${months}</div><p class="jp-s">${tx('note')}</p></div>`;
}
function openYear(){
  const ys=planYears();
  openSheet(`<h2 id="sh-title" style="padding-right:48px">${tx('yp.sheet')}</h2><p>${tx('yp.intro')}</p><div class="row" style="gap:8px">${ys.map(y=>`<button class="btn" data-a="print" data-y="${y}">${y}</button>`).join('')}</div><p class="small muted" style="margin-top:12px">${tx('yp.pdf')}</p>`);
}
function printYear(y){
  const el=$('#print'),t=document.title;
  el.innerHTML=yearPlanHTML(y);closeSheet();
  document.title=tx('yp.file',{y});/* wordt de bestandsnaam van de pdf */
  addEventListener('afterprint',()=>{document.title=t;el.innerHTML=''},{once:true});
  try{print()}catch(e){toast(tx('yp.noprint'))}
}
function samenCard(){
  if(hasCloud())return S.shared?'':accountCard();
  if(!S.shared)return `<section class="card"><div class="sec-h"><h3>${tx('samen.title')}</h3></div><p class="muted small" style="margin:0">${tx('cl.nosave')}</p></section>`;
  const ids=[...new Set(S.plantings.map(p=>p.by).filter(Boolean))];
  const who=ids.length?ids.map(i=>`<span class="pill soft">${esc(S.names[i]||tx('someone'))}${i==S.me?' '+tx('youMark'):''}</span>`).join(' '):'';
  return `<section class="card"><div class="sec-h"><h3>${tx('samen.title')}</h3></div><p class="small" style="margin:0 0 8px">${tx('cl.shared')}</p><p class="muted small" style="margin:0 0 8px">${tx('cl.invite')}</p>${who?`<div class="row" style="gap:6px;flex-wrap:wrap">${who}</div>`:''}</section>`;
}
/* Sorteren in Mijn tuin: standaard wat het eerst aandacht nodig heeft; lege herkenning of plek onderaan */
const SORTS=['aandacht','alfabet','label','plek'];
const cmpT=(a,b)=>a.localeCompare(b,LANG,{numeric:true,sensitivity:'base'});
const cmpEmpty=(a,b)=>!a!=!b?(a?-1:1):cmpT(a||'',b||'');
function needBy(p){
  const e=timeline(p).find(e=>e.k!='kiem'&&TODAY<=(e.end||e.dt));
  return e?(e.dt<=TODAY?0:+e.dt):Infinity;
}
function sortPlantings(){
  const k=S.sort||'aandacht',need=new Map(S.plantings.map(p=>[p.id,needBy(p)]));
  const byNeed=(a,b)=>need.get(a.id)-need.get(b.id)||0,byAlf=(a,b)=>cmpT(CROP[a.crop].n,CROP[b.crop].n)||cmpEmpty(a.label,b.label);
  const f={aandacht:(a,b)=>byNeed(a,b)||byAlf(a,b),alfabet:byAlf,label:(a,b)=>cmpEmpty(a.label,b.label)||byAlf(a,b),plek:(a,b)=>cmpEmpty(a.bed,b.bed)||byNeed(a,b)||byAlf(a,b)}[k]||byNeed;
  return [...S.plantings].sort(f);
}
/* Sowly als app op het beginscherm: Android en Chrome/Edge via de installatievraag van de browser, iOS met uitleg (daar bestaat geen knop voor) */
let instEv=null;
const isIOS=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform=='MacIntel'&&navigator.maxTouchPoints>1);
const isApp=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const canInstall=()=>hasCloud()&&!isApp()&&(!!instEv||isIOS());
addEventListener('beforeinstallprompt',e=>{e.preventDefault();instEv=e;if(S.view=='tuin')render()});
addEventListener('appinstalled',()=>{instEv=null;render();toast(tx('inst.done'))});
function installApp(){
  if(instEv){const e=instEv;e.prompt();e.userChoice.then(r=>{if(r.outcome=='accepted'){instEv=null;render()}}).catch(()=>{});return}
  const icon=`<svg viewBox="0 0 24 24" width="18" height="18" aria-label="${tx('inst.icon')}" style="vertical-align:-3px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="M12 15V3M8 7l4-4 4 4"/><path d="M7 10H5v11h14V10h-2"/></svg>`;
  openSheet(`<h2 id="sh-title" style="padding-right:48px">${tx('inst.title')}</h2><p>${tx('inst.intro')}</p><ol><li>${tx('inst.s1',{icon})}</li><li>${tx('inst.s2')}</li><li>${tx('inst.s3')}</li></ol><p class="small muted">${tx('inst.note')}</p>`);
}
function vTuin(){
  const inl=hasCloud()&&S.shared?`<div class="small muted inl">${tx('tuin.inl',{name:esc(myName())})}${C.role!='owner'&&C.gname?' · '+tx('tuin.inlGarden',{g:esc(C.gname)}):''} · <a href="#" data-a="logout">${tx('logout')}</a></div>`:'';
  let h=`<div class="stack"><div class="row"><div class="grow1" style="flex:1 0 auto"><h2 style="white-space:nowrap;margin:0">${tx('tuin.title')}</h2>${inl}</div>${canEdit()&&!(C.wait&&!S.shared)?`<button class="btn" data-a="add">${tx('tuin.add')}</button>`:''}${S.shared&&mine().length?`<button class="btn sm ghost" data-a="year">${tx('tuin.year')}</button>`:''}${canInstall()?`<button class="btn sm ghost" data-a="app">${tx('inst.btn')}</button>`:''}${hasCloud()&&S.shared?samenBtn():''}</div>`;
  /* Bovenaan: inloggen of het e-mailadres bevestigen, zolang er nog niets online staat */
  if(C.wait&&!S.shared)return h+`<div class="card empty"><b>${tx('tuin.loading')}</b></div></div>`;
  const top=hasCloud()&&!S.shared&&(!C.sb||!C.user);
  if(top)h+=samenCard();
  if(!S.plantings.length)return h+`<div class="card empty"><b>${tx('tuin.emptyT')}</b><p class="muted">${tx('tuin.emptyP')}</p></div>${samenCard()}</div>`;
  h+=upcoming()+neighbourCard()+(top?'':samenCard());
  if(S.plantings.length>1)h+=`<div class="field sortf"><label for="t-sort">${tx('sort.by')}</label><select id="t-sort">${SORTS.map(k=>`<option value="${k}"${k==(S.sort||'aandacht')?' selected':''}>${tx('sort.'+k)}</option>`).join('')}</select></div>`;
  sortPlantings().forEach(p=>h+=plantCard(p));
  return h+`${adSlot()}</div>`;
}
function render(){
  $('#main').innerHTML=S.view=='maand'?vMaand():S.view=='gewassen'?vGewassen():vTuin();
  $$('.tab').forEach(b=>b.setAttribute('aria-current',b.dataset.view==S.view?'page':'false'));
  const sb=$('#samen-b');if(sb){if(S.shared)sb.innerHTML=accountCard();else closeSheet()}
  const st=$('#set-b');if(st){if(loggedIn())st.innerHTML=settingsBody();else closeSheet()}
  $('#topbtns').innerHTML=topBtns();
}

/* ---- Bladen (sheets) ---- */
let playT=null;
function openSheet(html){$('#sh-body').innerHTML=html;$('#ov').hidden=false;$('#sh-close').focus();$('.sheet').scrollTop=0}
function closeSheet(){$('#ov').hidden=true;clearInterval(playT);playT=null}
function yearChart(c,mini){
  const st=stepsOf(c),types=Object.keys(ACT).filter(t=>st.some(x=>x.t==t)).sort((a,b)=>ACT[a].o-ACT[b].o);
  const dim=[31,28,31,30,31,30,31,31,30,31,30,31],np=((doy(TODAY)-.5)/365*100).toFixed(1);
  return `<div class="yc${mini?' mini':''}"><div class="yc-h"><span></span><div class="months">${dim.map((d,i)=>`<span style="--d:${d}">${CAL.ini[i]}</span>`).join('')}</div></div>`+types.map(t=>{const lb=c.poten&&t=='buiten'?tx('tl.plant'):ACT[t].s;return `<div class="yr" title="${lb}"><span>${lb}</span><div class="yt">${st.filter(x=>x.t==t).map(x=>`<i class="bar" style="left:${((x.a-1)/52*100).toFixed(1)}%;width:${((x.b-x.a+1)/52*100).toFixed(1)}%;--bc:var(${ACT[t].c})"></i>`).join('')}<i class="now" style="left:${np}%"></i></div></div>`}).join('')+`</div>`;
}
function openCrop(id){
  const c=CROP[id];
  openSheet(`<h2 id="sh-title" style="padding-right:48px">${c.n}</h2><div class="bigplant"><div class="pp" id="bigp">${plantSVG(c,4)}</div></div><div class="stages" role="group" aria-label="${tx('cs.stages')}">${STAGE_NAMES.map((n,i)=>`<button data-a="stage" data-s="${i}" data-id="${id}" aria-pressed="${i==4}">${n}</button>`).join('')}<button data-a="play" data-id="${id}">${tx('cs.play')}</button></div><p>${c.tip}</p>${careHTML(id)}<h3 style="margin-top:14px">${tx('cs.year')}</h3>${yearChart(c)}<p class="small muted">${tx('cs.today')}</p><div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn" data-a="add" data-id="${id}">${tx('cs.add')}</button>${COMMERCE?`<button class="btn ghost" data-a="seed" data-id="${id}">${tx('seed.find')}</button>`:''}</div>`);
}
function setStage(id,s){
  $('#bigp').innerHTML=plantSVG(CROP[id],s);
  $$('.stages [data-s]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.s==s)));
}
function openAdd(id,m){
  const c=CROP[id||'tomaat'];
  openSheet(`<h2 id="sh-title" style="padding-right:48px;margin-bottom:14px">${tx('add.title')}</h2><form id="addf"><div class="field"><label for="f-crop">${tx('f.crop')}</label><select id="f-crop">${[...CROPS].sort(byName).map(x=>`<option value="${x.id}"${x.id==c.id?' selected':''}>${x.n}</option>`).join('')}</select></div><div class="field"><label for="f-method">${tx('f.method')}</label><select id="f-method"></select></div><div class="field"><label for="f-date">${tx('f.date')}</label><input type="date" id="f-date" required value="${iso(TODAY)}"></div><div class="field"><label for="f-label">${tx('f.label')}</label><input id="f-label" maxlength="30" placeholder="${tx('f.labelPh')}"><span class="small muted" id="f-hint"></span></div><div class="field"><label for="f-bed">${tx('f.bed')}</label><input id="f-bed" maxlength="30" placeholder="${tx('f.bedPh')}"></div><div class="row"><button class="btn" type="submit">${tx('add')}</button><button class="btn ghost" type="button" data-a="close">${tx('cancel')}</button></div></form>`);
  const fill=pref=>{const cc=CROP[$('#f-crop').value];$('#f-method').innerHTML=methodsOf(cc).map(t=>`<option value="${t}"${t==pref?' selected':''}>${METHODS[t]}</option>`).join('')};
  const hint=()=>{const cc=CROP[$('#f-crop').value],n=S.plantings.filter(x=>x.crop==cc.id).length;$('#f-hint').textContent=n?tx('f.hint',{n,crop:lc(cc.n),next:n+1}):''};
  fill(m);hint();$('#f-crop').onchange=()=>{fill();hint()};
  $('#addf').onsubmit=e=>{
    e.preventDefault();
    const cid=$('#f-crop').value,n=S.plantings.filter(x=>x.crop==cid).length;
    S.plantings.push({id:'p'+Date.now()+Math.random().toString(36).slice(2,6),crop:cid,method:$('#f-method').value,date:$('#f-date').value,label:$('#f-label').value.trim()||(n?'#'+(n+1):''),bed:$('#f-bed').value.trim(),by:S.me||''});
    dbSet(S.plantings[S.plantings.length-1]);closeSheet();S.view='tuin';S.newId=S.plantings[S.plantings.length-1].id;render();scrollTo(0,0);plantFx(CROP[cid]);setTimeout(()=>{S.newId=null;$$('.plant-card.pop').forEach(x=>x.classList.remove('pop'))},9000);
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
  openSheet(`<h2 id="sh-title" style="padding-right:48px;margin-bottom:14px">${tx('edit.title',{crop:CROP[p.crop].n})}</h2><form id="editf"><div class="field"><label for="e-date">${tx('f.date')}</label><input type="date" id="e-date" required value="${esc(p.date)}"></div><div class="field"><label for="e-label">${tx('f.label2')}</label><input id="e-label" maxlength="30" value="${esc(p.label||'')}" placeholder="${tx('f.labelPh')}"></div><div class="field"><label for="e-bed">${tx('f.bed2')}</label><input id="e-bed" maxlength="30" value="${esc(p.bed||'')}"></div><div class="row"><button class="btn" type="submit">${tx('save')}</button><button class="btn ghost" type="button" data-a="close">${tx('cancel')}</button></div></form>`);
  $('#editf').onsubmit=e=>{e.preventDefault();if($('#e-date').value)p.date=$('#e-date').value;p.label=$('#e-label').value.trim();p.bed=$('#e-bed').value.trim();dbSet(p);closeSheet();render()};
}

/* ---- Events ---- */
document.addEventListener('click',e=>{
  if(e.target.id=='ov'){closeSheet();return}
  const tab=e.target.closest('.tab');
  if(tab){S.view=tab.dataset.view;S.picked=true;S.confirm=null;render();scrollTo(0,0);return}
  const t=e.target.closest('[data-a]');if(!t)return;
  const a=t.dataset.a,id=t.dataset.id;
  if(t.tagName=='A')e.preventDefault();
  if(!canEdit()&&['add','edit','del','fminus','fplus'].includes(a)){toast(tx('viewOnly'));return}
  if(hasCloud()&&!S.shared&&['add','edit','del'].includes(a)){needLogin(a=='add'?{id,m:t.dataset.m}:null);return}
  if(a=='close')closeSheet();
  else if(a=='mprev'){S.m--;if(S.m<0){S.m=11;S.y--}render()}
  else if(a=='mnext'){S.m++;if(S.m>11){S.m=0;S.y++}render()}
  else if(a=='fminus'||a=='fplus'){S.frost=Math.max(14,Math.min(26,S.frost+(a=='fplus'?1:-1)));dbFrost();render()}
  else if(a=='crop')openCrop(id);
  else if(a=='seed'&&COMMERCE)openSeed(id);
  else if(a=='add')openAdd(id,t.dataset.m);
  else if(a=='edit')openEdit(id);
  else if(a=='stage'){clearInterval(playT);setStage(id,+t.dataset.s)}
  else if(a=='play'){
    clearInterval(playT);let s=0;setStage(id,0);
    playT=setInterval(()=>{s++;if(s>4){clearInterval(playT);return}setStage(id,s)},1100);
  }
  else if(a=='year')openYear();
  else if(a=='print')printYear(+t.dataset.y);
  else if(a=='login')openLogin(t.dataset.m||'in');
  else if(a=='verified')checkVerified().catch(()=>toast(tx('checkFail')));
  else if(a=='resend')sendVerify().then(()=>toast(tx('resent')),x=>toast(authErr(x)));
  else if(a=='logout')C.sb.auth.signOut({scope:'local'});
  else if(a=='samen')openSamen();
  else if(a=='langs')openLangs();
  else if(a=='settings')openSettings();
  else if(a=='lang')setLang(t.dataset.l);
  else if(a=='app')installApp();
  else if(a=='invite')openInvite();
  else if(a=='mkinv')makeInvite(t.dataset.m).catch(()=>toast(tx('inv.fail')));
  else if(a=='copyinv'){const u=$('#inv-url');u.select();(navigator.clipboard?navigator.clipboard.writeText(u.value):Promise.reject()).then(()=>toast(tx('copied')),()=>{try{document.execCommand('copy');toast(tx('copied'))}catch(x){}})}
  else if(a=='shareinv')navigator.share({title:'Sowly',text:tx('share.text'),url:$('#inv-url').value}).catch(()=>{});
  else if(a=='kick'){
    if(S.confirm=='kick:'+id){S.confirm=null;kick(id).catch(()=>toast(tx('fail')))}else S.confirm='kick:'+id;
    render();
  }
  else if(a=='leave'){
    if(S.confirm=='leave'){S.confirm=null;leaveGarden().catch(()=>toast(tx('fail')))}else S.confirm='leave';
    render();
  }
  else if(a=='del'){
    if(S.confirm==id){S.plantings=S.plantings.filter(p=>p.id!=id);S.confirm=null;dbDel(id)}else S.confirm=id;
    render();
  }
});
document.addEventListener('change',e=>{if(e.target.id=='t-sort'){S.sort=e.target.value;render();$('#t-sort').focus();return}if(e.target.id=='g-sel')switchGarden(e.target.value).catch(()=>toast(tx('switchFail')))});
document.addEventListener('input',e=>{if(e.target.id=='q'){S.q=e.target.value;$('#grid').innerHTML=gridHTML()}});
$('#sh-close').onclick=closeSheet;
document.addEventListener('keydown',e=>{if(e.key=='Escape'&&!$('#ov').hidden)closeSheet()});

/* ---- Start ---- */
const MASCOT=`<svg class="pl" viewBox="0 0 120 124" role="img" aria-label="${tx('mascot')}"><ellipse class="mshadow" cx="60" cy="114" rx="30" ry="6" style="fill:#000;stroke:none;opacity:.28"/><g class="mbody mz"><path class="marmL" d="M38 84 C26 86 20 78 22 70 C30 70 36 74 40 80Z" style="fill:var(--leaf)"/><path class="marmR" d="M82 84 C94 86 100 78 98 70 C90 70 84 74 80 80Z" style="fill:var(--leaf)"/><path d="M26 112 C22 92 34 60 60 60 C86 60 98 92 94 112 C80 118 40 118 26 112Z" style="fill:var(--leaf3)"/><path d="M30 106 C40 112 80 112 90 106" style="fill:none;stroke:var(--soil);stroke-width:7"/><path d="M24 114 C34 106 86 106 96 114 C86 120 34 120 24 114Z" style="fill:var(--soil)"/><g class="mhead"><path d="M60 62 C60 52 59 46 60 38" style="fill:none;stroke-width:4"/><path class="mleafL" d="M60 42 C46 44 32 36 30 22 C46 20 58 28 60 42Z" style="fill:var(--leaf)"/><path class="mleafR" d="M60 42 C74 40 90 32 92 18 C76 16 62 26 60 42Z" style="fill:var(--leaf2)"/><path class="vein" d="M58 40 C50 34 42 28 36 24"/><path class="vein" d="M62 40 C70 32 80 26 88 20"/></g><circle cx="48" cy="80" r="9" style="fill:#fff"/><circle cx="72" cy="80" r="9" style="fill:#fff"/><g class="mpupil"><circle cx="50" cy="81" r="4.6" style="fill:var(--line);stroke:none"/><circle cx="51.6" cy="79.2" r="1.5" style="fill:#fff;stroke:none"/><g class="mwink"><circle cx="74" cy="81" r="4.6" style="fill:var(--line);stroke:none"/><circle cx="75.6" cy="79.2" r="1.5" style="fill:#fff;stroke:none"/></g></g><ellipse cx="38" cy="93" rx="5" ry="3.2" style="fill:#F4958C;stroke:none;opacity:.8"/><ellipse cx="82" cy="93" rx="5" ry="3.2" style="fill:#F4958C;stroke:none;opacity:.8"/><path d="M52 93 Q60 102 68 93Z" style="fill:#B3392F;stroke-width:2.2"/></g><path class="mheart" d="M92 42 C86 36 80 42 92 52 C104 42 98 36 92 42Z" style="fill:var(--radish);stroke-width:2"/></svg>`;
$('#mascot').innerHTML=MASCOT;
applyStatic();
$('#mascot').addEventListener('click',function(){this.classList.remove('jump');void this.offsetWidth;this.classList.add('jump');setTimeout(()=>this.classList.remove('jump'),950)});
if(hasCloud()&&wasIn()){C.wait=true;S.view='tuin'}
render();startShared();startCloud();
})();
