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
async function startShared(){
  try{
    const db=await claude.use('db');if(!db)return;
    const u=await claude.use('user');S.me=u&&u.id?await u.id():null;
    S.db=db;S.shared=true;S.local=S.plantings.filter(p=>!p.ex);
    db.collection('plantings').onSnapshot(snap=>{
      S.plantings=snap.docs.map(d=>Object.assign({id:d.id},d.data())).filter(p=>CROP[p.crop]);
      render();loadNames();
    },()=>{});
    db.doc('garden/settings').onSnapshot(sn=>{const d=sn.data();if(d&&d.frost){S.frost=d.frost;render()}},()=>{});
  }catch(e){}
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
  if(COMMERCE&&S.y==Y0&&S.m==TODAY.getMonth())h+=zaadCard();
  let n=0;
  order.forEach(k=>{
    const L=g[k];if(!L)return;n+=L.length;
    h+=`<section class="card"><div class="sec-h"><span class="pill" style="--pc:var(${ACT[k].c})">${ACT[k].n}</span><span class="muted small">${L.length} ${L.length==1?'gewas':'gewassen'}</span></div>`;
    L.forEach(({c,st,wA})=>{
      const sd=dateOfDoy(S.y,(st.a-1)*7+1),ed=dateOfDoy(S.y,st.b*7);
      const note=(st.l?st.l+' · ':'')+(st.a>=wA?`vanaf ${fmt(sd)}`:`t/m ${fmt(ed)}`);
      const sow=k=='binnen'||k=='glas'||k=='buiten';
      h+=`<div class="task"><button class="task-main" data-a="crop" data-id="${c.id}">${taskPlant(c,ACT[k].st)}<span><b>${c.n}</b><span class="muted small">${note}</span></span></button>${sow?`<button class="btn sm ghost" data-a="add" data-id="${c.id}" data-m="${k}">Planten</button>`:''}</div>`;
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
  if(!S.shared)return `<section class="card"><div class="sec-h"><h3>Samen tuinieren</h3></div><p class="muted small" style="margin:0">Samen tuinieren werkt hier nog niet. Je tuin staat alleen op dit apparaat.</p></section>`;
  const ids=[...new Set(S.plantings.map(p=>p.by).filter(Boolean))];
  const who=ids.length?ids.map(i=>`<span class="pill" style="--pc:var(--muted)">${esc(S.names[i]||'iemand')}${i==S.me?' (jij)':''}</span>`).join(' '):'';
  const mig=S.local&&S.local.length&&!S.plantings.length?`<button class="btn sm" data-a="migrate">Mijn ${S.local.length} lokale planten meenemen</button>`:'';
  return `<section class="card"><div class="sec-h"><h3>Samen tuinieren</h3></div><p class="small" style="margin:0 0 8px">Deze tuin wordt gedeeld: wie je uitnodigt ziet en bewerkt dezelfde planten, direct.</p><p class="muted small" style="margin:0 0 8px"><b>Uitnodigen:</b> kies bovenaan in Claude <b>Delen</b>, voeg de ander toe en geef bewerkrechten. Met alleen kijkrechten kan iemand meekijken maar niets wijzigen.</p>${who?`<div class="row" style="gap:6px;flex-wrap:wrap">${who}</div>`:''}${mig}</section>`;
}
function vTuin(){
  let h=`<div class="stack"><div class="row"><h2 class="grow1">Mijn tuin</h2><button class="btn" data-a="add">+ Gewas planten</button></div>`;
  if(!S.plantings.length)return h+`<div class="card empty"><b>Je tuin is nog leeg.</b><p class="muted">Voeg een gewas toe en zie direct wanneer je moet verpotten, uitplanten en oogsten.</p></div>${samenCard()}</div>`;
  h+=upcoming()+neighbourCard()+samenCard();
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
function yearChart(c){
  const st=stepsOf(c),types=Object.keys(ACT).filter(t=>st.some(x=>x.t==t)).sort((a,b)=>ACT[a].o-ACT[b].o);
  const dim=[31,28,31,30,31,30,31,31,30,31,30,31],np=((doy(TODAY)-.5)/365*100).toFixed(1);
  return `<div class="yc"><div class="yc-h"><span></span><div class="months">${dim.map((d,i)=>`<span style="--d:${d}">${'JFMAMJJASOND'[i]}</span>`).join('')}</div></div>`+types.map(t=>`<div class="yr"><span>${ACT[t].s}</span><div class="yt">${st.filter(x=>x.t==t).map(x=>`<i class="bar" style="left:${((x.a-1)/52*100).toFixed(1)}%;width:${((x.b-x.a+1)/52*100).toFixed(1)}%;--bc:var(${ACT[t].c})"></i>`).join('')}<i class="now" style="left:${np}%"></i></div></div>`).join('')+`</div>`;
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
  else if(a=='del'){
    if(S.confirm==id){S.plantings=S.plantings.filter(p=>p.id!=id);S.confirm=null;save();dbDel(id)}else S.confirm=id;
    render();
  }
});
document.addEventListener('input',e=>{if(e.target.id=='q'){S.q=e.target.value;$('#grid').innerHTML=gridHTML()}});
$('#sh-close').onclick=closeSheet;
document.addEventListener('keydown',e=>{if(e.key=='Escape'&&!$('#ov').hidden)closeSheet()});

/* ---- Start ---- */
$('#today').textContent=`${cap(DAGN[TODAY.getDay()])} ${TODAY.getDate()} ${MND[TODAY.getMonth()]} · week ${weekOf(TODAY)}`;
const MASCOT=`<svg class="pl" viewBox="0 0 120 124" role="img" aria-label="Kiempje, de mascotte van Sowly"><ellipse class="mshadow" cx="60" cy="114" rx="30" ry="6" style="fill:#000;stroke:none;opacity:.28"/><g class="mbody mz"><path class="marmL" d="M38 84 C26 86 20 78 22 70 C30 70 36 74 40 80Z" style="fill:var(--leaf)"/><path class="marmR" d="M82 84 C94 86 100 78 98 70 C90 70 84 74 80 80Z" style="fill:var(--leaf)"/><path d="M26 112 C22 92 34 60 60 60 C86 60 98 92 94 112 C80 118 40 118 26 112Z" style="fill:var(--leaf3)"/><path d="M30 106 C40 112 80 112 90 106" style="fill:none;stroke:var(--soil);stroke-width:7"/><path d="M24 114 C34 106 86 106 96 114 C86 120 34 120 24 114Z" style="fill:var(--soil)"/><g class="mhead"><path d="M60 62 C60 52 59 46 60 38" style="fill:none;stroke-width:4"/><path class="mleafL" d="M60 42 C46 44 32 36 30 22 C46 20 58 28 60 42Z" style="fill:var(--leaf)"/><path class="mleafR" d="M60 42 C74 40 90 32 92 18 C76 16 62 26 60 42Z" style="fill:var(--leaf2)"/><path class="vein" d="M58 40 C50 34 42 28 36 24"/><path class="vein" d="M62 40 C70 32 80 26 88 20"/></g><circle cx="48" cy="80" r="9" style="fill:#fff"/><circle cx="72" cy="80" r="9" style="fill:#fff"/><g class="mpupil"><circle cx="50" cy="81" r="4.6" style="fill:var(--line);stroke:none"/><circle cx="51.6" cy="79.2" r="1.5" style="fill:#fff;stroke:none"/><g class="mwink"><circle cx="74" cy="81" r="4.6" style="fill:var(--line);stroke:none"/><circle cx="75.6" cy="79.2" r="1.5" style="fill:#fff;stroke:none"/></g></g><ellipse cx="38" cy="93" rx="5" ry="3.2" style="fill:#F4958C;stroke:none;opacity:.8"/><ellipse cx="82" cy="93" rx="5" ry="3.2" style="fill:#F4958C;stroke:none;opacity:.8"/><path d="M52 93 Q60 102 68 93Z" style="fill:#B3392F;stroke-width:2.2"/></g><path class="mheart" d="M92 42 C86 36 80 42 92 52 C104 42 98 36 92 42Z" style="fill:var(--radish);stroke-width:2"/></svg>`;
$('#mascot').innerHTML=MASCOT;
$('#mascot').addEventListener('click',function(){this.classList.remove('jump');void this.offsetWidth;this.classList.add('jump');setTimeout(()=>this.classList.remove('jump'),950)});
render();startShared();
})();
