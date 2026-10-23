/* ---- Tekenfilmplanten: SVG per gewastype en groeistadium (0 zaadje ... 4 oogstklaar) ---- */
const FL=c=>`style="fill:${c}"`;
const lfD=(l,w)=>`M0 0C${l*.3} ${-w} ${l*.8} ${-w} ${l} 0C${l*.8} ${w} ${l*.3} ${w} 0 0Z`;
const lf=(x,y,r,s,fill,l=30,w=11)=>`<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><g class="lf" style="animation-delay:-${((((x*7+y*13+r)%30)+30)%30/10).toFixed(1)}s"><path d="${lfD(l,w)}" ${FL(fill)}/><path class="vein" d="M3 0H${l-6}" style="fill:none"/></g></g>`;
const stemP=(d,w=4.6,col='var(--leaf2)')=>`<path d="${d}" style="fill:none;stroke-width:${w+4.4}"/><path d="${d}" style="fill:none;stroke:${col};stroke-width:${w}"/>`;
const eyes=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><g class="eyes"><circle cx="-5" cy="0" r="3.6" style="fill:#fff"/><circle cx="5" cy="0" r="3.6" style="fill:#fff"/><circle cx="-4.4" cy=".5" r="1.8" style="fill:var(--line);stroke:none"/><circle cx="5.6" cy=".5" r="1.8" style="fill:var(--line);stroke:none"/></g><path d="M-3 6.5Q0 9.5 3 6.5" style="fill:none;stroke-width:1.6"/></g>`;
const SOIL=`<ellipse cx="60" cy="126" rx="50" ry="12" style="fill:var(--soil)"/><ellipse cx="60" cy="123" rx="42" ry="8" style="fill:var(--soil2);stroke:none"/><circle cx="34" cy="127" r="1.8" style="fill:var(--line);stroke:none"/><circle cx="88" cy="128" r="1.8" style="fill:var(--line);stroke:none"/><circle cx="72" cy="131" r="1.5" style="fill:var(--line);stroke:none"/>`;
const flower=(x,y,col='var(--yel)')=>stemP(`M60 ${y+12}Q${(x+60)/2} ${y+8} ${x} ${y}`,2)+`<circle cx="${x}" cy="${y}" r="5" ${FL(col)}/><circle cx="${x}" cy="${y}" r="1.8" style="fill:var(--carrot);stroke:none"/>`;
const hang=(x,y,r)=>stemP(`M60 ${y-4}Q${(x+60)/2} ${y-r-8} ${x} ${y-r}`,2);
const tomato=(x,y,r,face)=>hang(x,y,r)+`<circle cx="${x}" cy="${y}" r="${r}" ${FL('var(--tomato)')}/><path d="M${x-r*.55} ${y-r*.35}q${r*.15}-${r*.35} ${r*.55}-${r*.5}" style="fill:none;stroke:#fff;stroke-width:2;opacity:.6"/><ellipse cx="${x}" cy="${y-r+1}" rx="${r*.4}" ry="3" ${FL('var(--leafd)')}/>${face?eyes(x,y+r*.15,r/11):''}`;
const paprika=(x,y,r,f)=>{const k=r/10;return hang(x,y,r)+`<path d="M${x-9*k} ${y-8*k}C${x-12*k} ${y+6*k} ${x-6*k} ${y+12*k} ${x} ${y+12*k}C${x+6*k} ${y+12*k} ${x+12*k} ${y+6*k} ${x+9*k} ${y-8*k}C${x+4*k} ${y-12*k} ${x-4*k} ${y-12*k} ${x-9*k} ${y-8*k}Z" ${FL('var(--tomato)')}/><path d="M${x-2} ${y-10*k}q2-5 5-5" style="fill:none;stroke:var(--leafd);stroke-width:3"/>`+(f?eyes(x,y+k,k*.9):'')};
const aubergine=(x,y,r,f)=>{const k=r/10;return hang(x,y,r)+`<path d="M${x-6*k} ${y-10*k}C${x-13*k} ${y+6*k} ${x-8*k} ${y+17*k} ${x} ${y+17*k}C${x+9*k} ${y+17*k} ${x+10*k} ${y+4*k} ${x+6*k} ${y-10*k}Z" ${FL('#7B3FA0')}/><ellipse cx="${x}" cy="${y-10*k}" rx="${7*k}" ry="3.4" ${FL('var(--leafd)')}/>`+(f?eyes(x,y+3*k,k*.8):'')};
const peper=(x,y,r,f)=>hang(x,y,r)+`<path d="M${x-3} ${y-r}C${x-7} ${y} ${x-1} ${y+r*1.5} ${x+4} ${y+r*1.7}C${x+9} ${y+r} ${x+6} ${y-r*.3} ${x+3} ${y-r}Z" ${FL('var(--tomato)')}/><ellipse cx="${x}" cy="${y-r}" rx="4" ry="2.4" ${FL('var(--leafd)')}/>`+(f?eyes(x+1,y+r*.2,r/16):'');
const FRUIT={tomaat:tomato,paprika,aubergine,peper};
const lobed=(x,y,r)=>{const P=[0,60,120,180,240,300].map(a=>[x+Math.cos(a*Math.PI/180)*r*.62,y+Math.sin(a*Math.PI/180)*r*.62]);const C=st=>P.map(p=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${(r*.52).toFixed(1)}" style="fill:var(--leaf);${st}"/>`).join('')+`<circle cx="${x}" cy="${y}" r="${(r*.7).toFixed(1)}" style="fill:var(--leaf);${st}"/>`;return `<g class="lb" style="animation-delay:-${((x*3+y)%30/10).toFixed(1)}s">`+stemP(`M60 124Q${(x+60)/2} ${y+22} ${x} ${y}`,2.4)+C('')+C('stroke:none')+`<path class="vein" d="M${x} ${y+r*.35}V${y-r*.8}M${x} ${y}L${x-r*.7} ${y-r*.3}M${x} ${y}L${x+r*.7} ${y-r*.3}" style="fill:none"/></g>`};
const pod=(x,y,r,w=4.6,col='var(--bean)')=>`<g transform="translate(${x} ${y}) rotate(${r})"><g class="lf" style="animation-delay:-${((x+y)%30/10).toFixed(1)}s">${stemP('M0 0C5 10 5 24 1 36',w,col)}</g></g>`;
const blade=(x,a,len,col)=>`<g class="lb" style="animation-delay:-${((x+len)%30/10).toFixed(1)}s"><path d="M${x} 122Q${x+a*.4} ${122-len*.6} ${x+a} ${122-len}Q${x+a*.4+6} ${122-len*.5} ${x+6} 122Z" ${FL(col)}/></g>`;
const feather=(a,len,col)=>{const r=a*Math.PI/180;let o=stemP(`M60 121L${(60+Math.cos(r)*len).toFixed(1)} ${(121+Math.sin(r)*len).toFixed(1)}`,2);for(let j=1;j<=4;j++){const t=j/4.4,px=60+Math.cos(r)*len*t,py=121+Math.sin(r)*len*t;[-1,1].forEach(d=>{o+=`<ellipse cx="${(px+d*4).toFixed(1)}" cy="${py.toFixed(1)}" rx="4.6" ry="2.4" transform="rotate(${(a+d*65).toFixed(0)} ${(px+d*4).toFixed(1)} ${py.toFixed(1)})" ${FL(col)}/>`})}return `<g class="lb" style="animation-delay:-${(((a+len)%30+30)%30/10).toFixed(1)}s">${o}</g>`};
const seed=()=>`<ellipse cx="60" cy="120" rx="7" ry="4.6" transform="rotate(-18 60 120)" style="fill:#C99A5B"/><path d="M56 119q3-2 6-1" style="fill:none;stroke-width:1.4;opacity:.6"/>`;
const cot=(col,w=11)=>stemP('M60 124C59 118 61 112 60 107')+lf(60,107,-150,.6,col,30,w+3)+lf(60,107,-30,.6,col,30,w+3);
const scl=(k,o)=>`<g transform="translate(60 124) scale(${k}) translate(-60 -124)">${o}</g>`;
/* Kroezige vorm: cirkels met rand, daarna dezelfde zonder rand erover, zodat alleen de buitenrand overblijft */
const cloud=(P,col)=>{const C=st=>P.map(([x,y,r])=>`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" style="fill:${col};${st}"/>`).join('');return C('')+C('stroke:none')};
const kaleLeaf=(x0,y0,x1,y1,col)=>{const dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy),nx=-dy/L,ny=dx/L,P=[];
  [[.4,6.5],[.55,7],[.7,6.5],[.84,5.6],[.96,4.4]].forEach(([t,r])=>{const x=x0+dx*t,y=y0+dy*t;P.push([x,y,r],[x+nx*r*.8,y+ny*r*.8,r*.6],[x-nx*r*.8,y-ny*r*.8,r*.6])});
  return `<g class="lb" style="animation-delay:-${((x1+y1)%30/10).toFixed(1)}s">`+stemP(`M${x0} ${y0}L${(x0+dx*.45).toFixed(1)} ${(y0+dy*.45).toFixed(1)}`,2.6,'#6E9F80')+cloud(P,col)+`<path class="vein" d="M${(x0+dx*.4).toFixed(1)} ${(y0+dy*.4).toFixed(1)}L${(x0+dx*.92).toFixed(1)} ${(y0+dy*.92).toFixed(1)}"/></g>`};
const curl=(x,y,r,col)=>{const ring=(n,d,rr,off)=>[...Array(n)].map((_,i)=>{const a=(i*360/n+off)*Math.PI/180;return [x+Math.cos(a)*r*d,y+Math.sin(a)*r*d,r*rr]});return cloud([[x,y,r*.9],...ring(8,.8,.45,0),...ring(10,1.12,.28,18)],col)};
/* Samengesteld blad (aardappel): blaadjes in paren langs een nerf, met een topblaadje */
const potLeaf=(x0,y0,x1,y1,i)=>{const a=Math.atan2(y1-y0,x1-x0)*180/Math.PI,C=['var(--leafd)','var(--leaf)'];let o=stemP(`M${x0} ${y0}Q${(x0+x1)/2+(x1>60?-4:4)} ${(y0+y1)/2} ${x1} ${y1}`,2.2);
  [[.45,.42],[.72,.48]].forEach(([t,k],j)=>{const x=x0+(x1-x0)*t,y=y0+(y1-y0)*t;o+=lf(+x.toFixed(1),+y.toFixed(1),Math.round(a-58),k,C[(i+j)%2],30,14)+lf(+x.toFixed(1),+y.toFixed(1),Math.round(a+58),k,C[(i+j+1)%2],30,14)});
  return o+lf(x1,y1,Math.round(a),.55,C[i%2],30,15)};
const potFlower=(x,y)=>[0,72,144,216,288].map(d=>`<circle cx="${(x+Math.cos(d*Math.PI/180)*3.4).toFixed(1)}" cy="${(y+Math.sin(d*Math.PI/180)*3.4).toFixed(1)}" r="3" style="fill:#F4F1F8"/>`).join('')+`<circle cx="${x}" cy="${y}" r="1.9" style="fill:var(--yel);stroke:none"/>`;
const basilLeaf=(x,y,r,s,col)=>`<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><g class="lf" style="animation-delay:-${((((x*7+y*13+r)%30)+30)%30/10).toFixed(1)}s"><path d="M0 0C3 -13 22 -16 33 -1C24 12 5 11 0 0Z" ${FL(col)}/><path class="vein" d="M3 0Q16 -3 30 -1"/><path d="M12 -7q6 -3 12 -1" style="fill:none;stroke:#fff;stroke-width:1.8;opacity:.55"/></g></g>`;

const TN={sla:['var(--leaf3)','var(--leaf)'],spinazie:['var(--spin)','var(--leafd)'],veldsla:['var(--veld)','var(--leaf)'],rucola:['var(--leaf3)','var(--leaf)'],pluksla:['var(--leaf3)','#B5523B'],postelein:['#7BCB6A','#4FA55A'],andijvie:['#B9E27F','#8FD35C'],snijbiet:['var(--leafd)','var(--leaf)'],};
const TS={postelein:.8,veldsla:.75,rucola:.9,snijbiet:1.1};
const TW={postelein:14,pluksla:13,spinazie:9,rucola:7,andijvie:10,snijbiet:13};
const ROOTS={selderij:['#D9C89E',13],radijs:['var(--radish)',11],biet:['#A1244F',12],koolrabi:['#B8E08A',13],aardappel:['#C9A06B',12]};

const PLANTS={
 bush(s,c){
  if(s==1)return cot('var(--leaf3)',8);
  const h=s==2?46:78,top=124-h;
  let o=stemP(`M60 124C57 ${124-h*.35} 63 ${124-h*.7} 60 ${top}`,s==2?4.6:6);
  [[104,-160],[104,-20],[88,-150],[88,-30],[72,-160],[72,-20],[58,-140]].forEach(([y,a],i)=>{if(top<y-8)o+=lf(60,y,a,.85,i%2?'var(--leaf)':'var(--leaf3)')});
  o+=lf(60,top+4,-95,.75,'var(--leaf)');
  if(s==3)o+=flower(36,82)+flower(88,64)+flower(72,44);
  if(s==4){const f=FRUIT[c.fruit||'tomaat'];o+=f(38,90,10,1)+f(84,80,11,1)+f(42,64,8,0)+f(82,54,8,0)}
  return o;
 },
 vine(s,c){
  if(s==1)return cot('var(--leaf3)',11);
  let o=s==2?lobed(40,98,13)+lobed(80,94,13)+lobed(60,78,12):lobed(34,100,18)+lobed(88,96,18)+lobed(60,70,17);
  if(s==3)o+=`<path d="M96 122q-3-13 6-19q9 6 7 19z" ${FL('var(--yel)')}/>`;
  if(s==4){
   if(['courgette','komkommer','augurk'].includes(c.fruit)){const kk=c.fruit!='courgette',au=c.fruit=='augurk';o+=`<g transform="rotate(-14 60 114)"><ellipse cx="60" cy="114" rx="${au?20:kk?30:27}" ry="${au?7:kk?8:10}" ${FL(kk?'var(--bean)':'var(--zuc)')}/><path d="M${au?46:38} ${kk?111:110}q${au?14:22}-5 ${au?28:44} 0" style="fill:none;stroke:#fff;stroke-width:2;opacity:.45"/><path d="M${au?78:kk?88:85} 109l9-2v6l-9-1z" ${FL('var(--leafd)')}/></g>`+eyes(55,113,.85)}
   else o+=`<circle cx="60" cy="108" r="17" ${FL('var(--pump)')}/><path d="M60 91q-9 17 0 34M60 91q9 17 0 34M60 91q-17 17 0 34" style="fill:none;stroke:#B8520E;stroke-width:1.8;opacity:.6"/>`+stemP('M58 92q0-8 5-9',4,'#8A5A2B')+eyes(60,110,1.1);
  }
  return o;
 },
 rosette(s,c){
  const T=TN[c.tone],sc=TS[c.tone]||1,w=TW[c.tone]||12;
  const A=s==1?[-150,-30]:s==2?[-165,-125,-90,-55,-15]:[-172,-148,-125,-100,-80,-55,-32,-8];
  const k=[0,.5,.75,.95,1.1][s]*sc;
  let o='';A.forEach((a,i)=>{o+=lf(60,121,a,k*(i%2?1:.92),T[i%2],30,w)});
  if(s==4)o+=(c.tone=='sla'?`<ellipse cx="60" cy="106" rx="15" ry="13" ${FL('var(--leaf3)')}/>`:'')+eyes(60,106,1.1);
  return o;
 },
 kool(s,c){
  const G=['#4E9E7A','#3C8A68'],f=c.fruit,KH={rodekool:['#8E4A9E','round'],wittekool:['#C4E6A2','round'],savooiekool:['#76B954','savoy'],chinesekool:['#E6F0B8','tall'],bloemkool:['#F4EBC8','cluster'],broccoli:['#3FA34D','cluster'],spruitkool:['#6FBF4B','sprouts']},[hc,sh]=KH[f];
  if(s==1)return cot('#4E9E7A',11);
  const A=s==2?[-165,-125,-90,-55,-15]:[-172,-148,-125,-100,-80,-55,-32,-8],k=[0,0,.8,1,1.1][s];
  let o=A.map((a,i)=>lf(60,121,a,k*(i%2?1:.92),G[i%2],30,13)).join('');
  if(s>=3){
   const r=s==3?9:15,cy=s==3?112:106;
   if(sh=='round'||sh=='savoy')o+=`<circle cx="60" cy="${cy}" r="${r}" ${FL(hc)}/><path d="M${60-r*.5} ${cy-r*.6}Q60 ${cy} ${60+r*.5} ${cy-r*.6}" style="fill:none;stroke-width:1.6;opacity:.5"/>`+(sh=='savoy'?`<path d="M${60-r*.7} ${cy+r*.1}q${r*.35} -${r*.4} ${r*.7} 0t${r*.7} 0" style="fill:none;stroke-width:1.4;opacity:.5"/>`:'');
   else if(sh=='tall')o+=`<ellipse cx="60" cy="${cy-4}" rx="${(r*.62).toFixed(1)}" ry="${(r*1.45).toFixed(1)}" ${FL(hc)}/><path d="M60 ${(cy-r*1.4).toFixed(1)}V${(cy+r*1.1).toFixed(1)}" style="fill:none;stroke-width:1.4;opacity:.45"/>`;
   else if(sh=='sprouts'){o+=stemP(`M60 124V${s==3?88:70}`,5,'#4E9E7A');[[51,s==3?102:92],[69,s==3?98:86],[52,s==3?90:78],[68,s==3?86:70]].forEach(([x,y])=>{o+=`<circle cx="${x}" cy="${y}" r="${s==3?4:6}" ${FL(hc)}/>`})}
   else{const P=[[0,0],[-.6,.3],[.6,.3],[-.35,-.55],[.35,-.55]],C=st=>P.map(p=>`<circle cx="${(60+p[0]*r).toFixed(1)}" cy="${(cy+p[1]*r).toFixed(1)}" r="${(r*.55).toFixed(1)}" style="fill:${hc};${st}"/>`).join('');o+=C('')+C('stroke:none')}
   if(s==4)o+=eyes(60,sh=='sprouts'?100:cy+2,sh=='sprouts'?.75:1.1);
  }
  return o;
 },
 root(s,c){
  const f=c.fruit;
  if(f=='wortel'||f=='pastinaak'||f=='venkel'){
   const F=s==1?[[-105,14],[-75,14]]:s==2?[[-125,24],[-90,30],[-55,24]]:[[-150,34],[-120,42],[-90,48],[-60,42],[-30,34]];
   let o=F.map(([a,l])=>feather(a,l,'var(--leaf)')).join('');
   if(s==4)o+=f=='venkel'?`<ellipse cx="60" cy="115" rx="13" ry="10" ${FL('#E4F0C6')}/>`+eyes(60,115,.8):`<ellipse cx="60" cy="121" rx="12" ry="6.5" ${FL(f=='wortel'?'var(--carrot)':'#F1E2B0')}/>`+eyes(60,121,.6);
   return o;
  }
  const [col,r]=ROOTS[f];
  if(f=='aardappel'&&s>=2){
   let o=[[24,84],[96,82],[36,60],[86,58],[60,42]].map(([x,y],i)=>potLeaf(60,121,x,y,i)).join('');
   if(s==3)o+=potFlower(46,40)+potFlower(54,34)+potFlower(78,38);
   if(s==4)o+=`<ellipse cx="44" cy="120" rx="11" ry="8" transform="rotate(-10 44 120)" ${FL(col)}/><ellipse cx="78" cy="121" rx="10" ry="7.5" transform="rotate(8 78 121)" ${FL(col)}/><ellipse cx="61" cy="124" rx="8" ry="6" ${FL(col)}/>`+eyes(44,120,.7);
   return scl([0,0,.55,.85,1][s],o);
  }
  const A=s==1?[-135,-45]:s==2?[-140,-90,-40]:[-160,-130,-100,-80,-50,-20];
  const k=[0,.5,.7,.9,.9][s];
  let o=A.map((a,i)=>lf(60,120,a,k,i%2?'var(--leaf)':'var(--leafd)',26,12)).join('');
  if(s==4){
   if(f=='aardappel')o+=`<ellipse cx="53" cy="119" rx="11" ry="8" transform="rotate(-10 53 119)" ${FL(col)}/><ellipse cx="68" cy="121" rx="9" ry="7" ${FL(col)}/>`+eyes(53,119,.7);
   else o+=`<circle cx="60" cy="${f=='koolrabi'?114:117}" r="${r}" ${FL(col)}/><path d="M52 ${f=='koolrabi'?108:112}q3-4 7-5" style="fill:none;stroke:#fff;stroke-width:2;opacity:.6"/>`+eyes(60,f=='koolrabi'?115:118,.8);
  }
  return o;
 },
 bean(s,c){
  const f=c.fruit,stok=f=='stokboon',tall=f=='tuinboon'||stok,pc=f=='doperwt'?'#8FD35C':stok?'var(--bean)':tall?'#5FAF45':'var(--bean)',pw=f=='tuinboon'?6.5:4.6;
  if(s==1)return cot('var(--bean)',11);
  const h=s==2?40:stok?96:tall?74:64,top=124-h;
  let o=(stok&&s>=2?stemP('M74 124V14',3,'#8A5A2B'):'')+stemP(`M60 124C58 ${124-h*.4} 62 ${124-h*.7} 60 ${top}`,5);
  [[106,-155],[106,-25],[90,-150],[90,-30],[74,-155],[74,-25],[58,-150],[58,-30],[44,-155],[44,-25]].forEach(([y,a],i)=>{if(top<y-6)o+=lf(60,y,a,.85,i%2?'var(--leaf)':'var(--bean)',26,13)});
  o+=lf(60,top+4,-95,.7,'var(--bean)',26,13);
  if(f=='doperwt'&&s>=2)o+=`<path d="M60 ${top}q9-7 13-1q-3 7-9 3" style="fill:none;stroke:var(--leaf2);stroke-width:1.8"/>`;
  if(s==3)o+=`<circle cx="40" cy="84" r="4" style="fill:#fff"/><circle cx="82" cy="70" r="4" style="fill:#fff"/>`+(tall?`<circle cx="40" cy="84" r="1.4" style="fill:var(--line);stroke:none"/><circle cx="82" cy="70" r="1.4" style="fill:var(--line);stroke:none"/>`:'');
  if(s==4)o+=pod(46,88,8,pw,pc)+pod(76,84,-8,pw,pc)+pod(50,66,6,pw,pc)+pod(72,62,-6,pw,pc)+eyes(51,102,.6)+eyes(77,98,.6);
  return o;
 },
 bulb(s,c){
  const f=c.fruit||'knoflook',G=f=='prei'?['#4E9E7A','#3C8A68']:['var(--leaf)','var(--leafd)'],g3=f=='prei'?'#5FB08A':'var(--leaf3)';
  if(s==1)return blade(57,-2,18,G[0]);
  if(s==2)return blade(52,-9,34,G[0])+blade(58,0,44,g3)+blade(64,9,34,G[0]);
  if(f=='prei'){
   /* Witte schacht met een waaier van brede, platte bladeren die naar buiten buigen */
   const o=`<path d="M52 90C44 64 30 48 12 50C16 42 30 38 40 46C52 56 60 70 62 86Z" ${FL(G[1])}/><path d="M68 90C76 64 90 48 108 50C104 42 90 38 80 46C68 56 60 70 58 86Z" ${FL(G[1])}/><path d="M54 84C50 58 40 36 26 24C36 22 46 32 52 44C58 56 62 70 63 82Z" ${FL(G[0])}/><path d="M66 84C70 58 80 36 94 24C84 22 74 32 68 44C62 56 58 70 57 82Z" ${FL(G[0])}/><path d="M55 82C54 58 56 36 58 14C61 12 64 13 65 16C66 36 66 58 65 82Z" ${FL(g3)}/><path class="vein" d="M57 84C50 64 38 50 22 46M59 80C54 60 46 42 34 30M61 80C66 60 74 42 86 30M63 84C70 64 82 50 98 46M60 78V22"/><path d="M53 125V87Q53 80 60 79Q67 80 67 87V125Z" ${FL('#F4F1D8')}/><path d="M53 98V87Q53 80 60 79Q67 80 67 87V98Z" ${FL('#CFE5A8')}/>`;
   return scl(s==3?.78:1,o+(s==4?eyes(60,110,.75):''));
  }
  const col=s==4&&f=='knoflook'?'var(--leaf3)':G[0];
  let o=blade(48,-12,46,col)+blade(54,-5,58,G[1])+blade(58,2,62,col)+blade(62,8,56,G[1])+blade(66,14,46,col);
  if(s==3&&f=='knoflook')o+=stemP('M60 124C60 90 68 72 78 66',2.4)+`<circle cx="79" cy="64" r="4" ${FL('var(--garlic)')}/>`;
  if(s==4){
   if(f=='knoflook')o+=`<path d="M60 105C47 106 42 119 49 127H71C78 119 73 106 60 105Z" ${FL('var(--garlic)')}/><path d="M57 106Q60 98 63 106" ${FL('var(--garlic)')}/><path d="M54 112q-3 7 0 13M66 112q3 7 0 13" style="fill:none;stroke:#B79BC2;stroke-width:1.6"/>`+eyes(60,118,.75);
   else if(f=='sjalot')o+=`<ellipse cx="50" cy="119" rx="8" ry="9" ${FL('#C98A4A')}/><ellipse cx="68" cy="120" rx="8" ry="8" ${FL('#D49A58')}/>`+eyes(59,119,.6);
   else if(f=='bosui')o+=`<ellipse cx="60" cy="118" rx="7" ry="9" ${FL('#F4F1D8')}/>`+eyes(60,118,.55);
   else if(f=='ui')o+=`<path d="M60 103Q58 96 62 93" style="fill:none;stroke-width:2"/><circle cx="60" cy="116" r="13" ${FL('#E3B64A')}/>`+eyes(60,117,.8);
   else o+=`<path d="M53 126V106Q60 101 67 106V126Z" ${FL('#F4F1D8')}/>`+eyes(60,116,.7);
  }
  return o;
 },
 kale(s,c){
  /* Boerenkool: hoge stengel met gekrulde bladeren en een kuif */
  const D='#2E7656',M='#3F8F6B',Lt='#56A37E';
  if(s==1)return cot(M,11);
  let o=stemP('M60 124C58 106 62 88 60 64',5.5,'#6E9F80')+kaleLeaf(60,112,20,100,D)+kaleLeaf(60,110,100,98,D)+kaleLeaf(60,96,22,74,M)+kaleLeaf(60,94,98,72,M)+kaleLeaf(60,80,34,50,M)+kaleLeaf(60,78,86,48,M);
  o+=cloud([[60,58,9],[51,62,7],[69,62,7],[53,50,7],[67,50,7],[60,44,6.5]],Lt);
  return scl([0,0,.52,.76,1][s],o+(s==4?eyes(60,58,.9):''));
 },
 herb(s,c){
  if(c.tone=='peterselie'){
   /* Krulpeterselie: dunne steeltjes met kroezige toefjes */
   const G=['#2F8F3A','#3FA046'];
   if(s==1)return cot(G[1],8);
   const T=[[30,72],[90,72],[42,56],[78,56],[56,46],[68,48],[40,90],[80,90],[60,92]];
   let o=T.map(([x,y])=>stemP(`M60 122Q${(x+60)/2} ${y+18} ${x} ${y}`,2,'var(--leaf2)')).join('');
   o+=T.map(([x,y],i)=>curl(x,y,i==8?8:6.5,G[i%2])).join('');
   return scl([0,0,.5,.78,1][s],o+(s==4?eyes(60,93,.8):''));
  }
  /* Basilicum: rechte stengel met paren bolle, glanzende bladeren */
  const G=['#5CC04A','#47A93B'];
  if(s==1)return cot(G[0],14);
  let o=stemP('M60 124C59 104 61 84 60 58',3.6);
  [[112,1],[92,.95],[74,.8]].forEach(([y,k],i)=>{o+=basilLeaf(60,y,-168,k,G[i%2])+basilLeaf(60,y,-12,k,G[(i+1)%2])});
  o+=basilLeaf(60,60,-130,.55,G[0])+basilLeaf(60,60,-50,.55,G[1])+basilLeaf(60,58,-90,.5,G[0]);
  return scl([0,0,.55,.8,1][s],o+(s==4?eyes(60,100,.8):''));
 },
 mais(s,c){
  const G=['var(--leaf)','var(--leafd)'];
  if(s==1)return blade(56,-3,24,G[0])+blade(63,4,22,G[1]);
  if(s==2)return blade(50,-12,44,G[0])+blade(58,-2,56,G[1])+blade(66,10,44,G[0]);
  const top=s==3?36:30;
  let o=stemP(`M60 124V${top}`,6);
  [[100,-160],[100,-20],[84,-155],[84,-25],[68,-160],[68,-20],[52,-155],[52,-25]].forEach(([y,a],i)=>{if(y>top+10)o+=lf(60,y,a,1.05,G[i%2],34,9)});
  o+=lf(60,top+4,-95,.8,G[0],30,8);
  if(s==3)o+=`<path d="M60 ${top}q-6 -10 -3 -16M60 ${top}q6 -10 3 -16M60 ${top}q0 -12 0 -18" style="fill:none;stroke:#C9A24B;stroke-width:2.4"/>`;
  if(s==4)o+=`<g transform="translate(72 74) rotate(14)"><path d="M0 0C-9 4 -10 26 0 34C10 26 9 4 0 0Z" ${FL('var(--leaf3)')}/><ellipse cx="0" cy="22" rx="6.5" ry="11" ${FL('#FFD84D')}/></g>`+eyes(67,95,.55)+`<g transform="translate(48 88) rotate(-14)"><path d="M0 0C-9 4 -10 24 0 30C10 24 9 4 0 0Z" ${FL('var(--leaf3)')}/><ellipse cx="0" cy="20" rx="6" ry="10" ${FL('#FFD84D')}/></g>`+eyes(53,107,.5);
  return o;
 }
};
function fxHTML(c){
  const big=plantSVG(c,4).replace(SOIL,'').replace('<g class="grow">','<g>'),sp=plantSVG(c,1).replace(SOIL,'').replace('<g class="grow">','<g>');
  const dirt=[[-70,-60],[-40,-90],[-10,-70],[25,-95],[55,-65],[80,-50],[-90,-30],[100,-25]].map(([x,y],i)=>`<i class="dirt" style="--dx:${x}px;--dy:${y}px;animation-delay:${(1.4+i*0.03).toFixed(2)}s"></i>`).join('');
  const hearts=[[-62,0],[-28,-14],[10,-4],[48,-16],[78,0]].map(([x,y],i)=>`<b class="heart" aria-hidden="true" style="left:calc(50% + ${x}px);--hy:${y}px;animation-delay:${(3.7+i*0.18).toFixed(2)}s">♥</b>`).join('');
  return `<div class="fx-box"><div class="fx-clip"><div class="fx-plant">${big}</div></div><div class="fx-sprout">${sp}</div><svg class="fx-soil" viewBox="0 0 200 70" aria-hidden="true"><path d="M6 60C14 30 50 16 100 16S186 30 194 60Z" style="fill:var(--soil);stroke:var(--line);stroke-width:3;stroke-linejoin:round"/><path d="M30 40C50 26 150 26 170 40" style="fill:none;stroke:var(--soil2);stroke-width:6;stroke-linecap:round"/></svg>${dirt}${hearts}</div><p class="fx-t">${c.n} is geplant!</p>`;
}
function plantSVG(c,stage){
  const g=stage==0?seed():PLANTS[c.kind](stage,c),sd=-([...c.id].reduce((n,ch)=>n+ch.charCodeAt(0),0)%40)/10;
  return `<svg class="pl" viewBox="0 0 120 140" role="img" aria-label="${c.n}: ${STAGE_NAMES[stage].toLowerCase()}">${SOIL}<g class="sway" style="animation-delay:${sd}s"><g class="grow">${g}</g></g></svg>`;
}
