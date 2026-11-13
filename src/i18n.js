/* ---- Talen: kiezen, toepassen en teksten ophalen ----
   Eén bestand per taal (lang-xx.js) met crops, care, act, methods, stages, cal (kalender) en ui (interface).
   Ontbreekt een tekst in een taal, dan valt hij terug op Nederlands. */
/* België: dezelfde teksten als Nederlands en Frans, met de Belgische vlag */
LANGS['nl-BE']=Object.assign({},LANGS.nl,{name:'Nederlands (België)',flag:'be'});
LANGS['fr-BE']=Object.assign({},LANGS.fr,{name:'Français (Belgique)',flag:'be'});
const LANG_ORDER=['nl','nl-BE','fr','fr-BE','en','de','es','it'];
const LANG_KEY='sowly.taal';
/* ---- Land: los van de taal. Waarde = welke zaaigegevens gelden: nlbe = Nederlandse en Belgische bronnen, de = REGIONS.de, null = nog geen lokale bronnen ---- */
/* Frankrijk in klimaatzones (FR-N noord en west, FR-C midden en oost, FR-S zuid); '-' = zone zonder lokale bron */
const COUNTRIES={NL:'nlbe',BE:'nlbe',DE:'de',AT:null,CH:null,LU:null,'FR-N':'frn','FR-C':'frc','FR-S':'-',GB:null,IE:null,ES:null,IT:null,DK:null,SE:null,PL:null,CZ:null,SK:null};
const LAND_KEY='sowly.land';
const LAND_OF_LANG={nl:'NL','nl-BE':'BE','fr-BE':'BE',fr:'FR-N',de:'DE',en:'GB',es:'ES',it:'IT'};
/* Eerder gekozen land, anders het land uit de browsertaal (de-AT -> AT), anders het land dat bij de taal hoort */
/* Oude of grove waarden naar een land uit de lijst: FR (van vóór de zones) wordt Frankrijk noord en west */
const normLand=c=>c=='FR'?'FR-N':c;
function pickLand(){
  try{const s=normLand(localStorage.getItem(LAND_KEY));if(s&&s in COUNTRIES)return s}catch(e){}
  const nav=typeof navigator=='undefined'?[]:(navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||'']);
  for(const l of nav){const r=normLand((String(l).split('-')[1]||'').toUpperCase());if(r in COUNTRIES)return r}
  return LAND_OF_LANG[LANG]||'NL';
}
/* Landnaam in de gekozen taal, uit de browser zelf */
function landName(c){
  let n;try{n=new Intl.DisplayNames([LANG],{type:'region'}).of(c.slice(0,2))||c}catch(e){n=c}
  return c.length>2?n+' – '+tx('zone.'+c):n;
}
const CAL={m:[],m3:[],d:[],ini:'',lower:true};
let LANG='nl',UI={};

/* Tekst uit de interface, met {plekhouders}. Waarden worden niet ontsnapt: doe dat zelf met esc() waar nodig. */
function tx(k,v){
  let s=UI[k];if(s==null)s=LANGS.nl.ui[k];if(s==null)return k;
  return v?s.replace(/\{(\w+)\}/g,(m,x)=>v[x]!=null?v[x]:m):s;
}
/* Kleine letter midden in een zin; niet in het Duits (zelfstandige naamwoorden met hoofdletter) */
const lc=s=>CAL.lower?s.toLowerCase():s;

/* Eerder gekozen taal, anders de taal van de browser, anders Engels */
function pickLang(){
  try{const s=localStorage.getItem(LANG_KEY);if(s&&LANGS[s])return s}catch(e){}
  const nav=typeof navigator=='undefined'?[]:(navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||'']);
  for(const l of nav){
    const f=String(l).toLowerCase(),full=Object.keys(LANGS).find(k=>k.toLowerCase()==f);if(full)return full;
    const c=f.slice(0,2);if(LANGS[c])return c;
  }
  return 'en';
}

function applyLang(code){
  LANG=LANGS[code]?code:'nl';
  const L=LANGS[LANG],F=LANGS.nl;
  const g=(a,b,k)=>(a&&a[k]!==undefined&&a[k]!==''?a[k]:b[k]);
  CROPS.forEach(c=>{const x=(L.crops||{})[c.id]||{},y=F.crops[c.id]||{};c.n=g(x,y,'n');c.tip=g(x,y,'tip')});
  for(const id in CARE){const x=(L.care||{})[id]||{},y=F.care[id]||{};['l','w','v'].forEach(k=>{CARE[id][k][1]=g(x,y,k)})}
  for(const k in ACT){const x=(L.act||{})[k]||{},y=F.act[k]||{};ACT[k].n=g(x,y,'n');ACT[k].s=g(x,y,'s')}
  for(const k in METHODS)METHODS[k]=((L.methods||{})[k])||F.methods[k];
  STAGE_NAMES.forEach((_,i)=>{STAGE_NAMES[i]=((L.stages||[])[i])||F.stages[i]});
  Object.assign(CAL,F.cal,L.cal);
  UI=L.ui||{};
}

/* Vlaggen als kleine SVG (emoji-vlaggen tonen op Windows alleen letters) */
let flagN=0;
function flagSVG(code){
  code=(LANGS[code]&&LANGS[code].flag)||code;
  const r=(c,y,h)=>`<rect x="0" y="${y}" width="60" height="${h}" fill="${c}"/>`,v=(c,x)=>`<rect x="${x}" y="0" width="20" height="40" fill="${c}"/>`;
  let b;
  if(code=='nl')b=r('#AE1C28',0,14)+r('#fff',13,14)+r('#21468B',26,14);
  else if(code=='de')b=r('#000',0,14)+r('#DD0000',13,14)+r('#FFCE00',26,14);
  else if(code=='fr')b=v('#002654',0)+v('#fff',20)+v('#CE1126',40);
  else if(code=='be')b=v('#000',0)+v('#FDDA24',20)+v('#EF3340',40);
  else if(code=='it')b=v('#009246',0)+v('#fff',20)+v('#CE2B37',40);
  else if(code=='es')b=r('#AA151B',0,40)+r('#F1BF00',10,20);
  else{const id='uj'+(++flagN);b=`<rect width="60" height="40" fill="#012169"/><clipPath id="${id}"><path d="M30,20h30v20zv20h-30zh-30v-20zv-20h30z"/></clipPath><path d="M0,0L60,40M60,0L0,40" stroke="#fff" stroke-width="8"/><path d="M0,0L60,40M60,0L0,40" clip-path="url(#${id})" stroke="#C8102E" stroke-width="4"/><path d="M30,0v40M0,20h60" stroke="#fff" stroke-width="12"/><path d="M30,0v40M0,20h60" stroke="#C8102E" stroke-width="7"/>`}
  return `<svg class="flag" viewBox="0 0 60 40" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${b}</svg>`;
}
