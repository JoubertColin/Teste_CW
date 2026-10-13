
const Q=new URLSearchParams(location.search),NIV=PUZZLES[Q.get('nivel')]?Q.get('nivel'):'facil',LIST=PUZZLES[NIV],IDX=Math.max(0,Math.min(LIST.length-1,(+Q.get('n')||1)-1)),P=LIST[IDX];
const SOL=P.sol.map(s=>[...s].map(Number));
const KEY={'1': 'A', '2': 'E', '3': 'I', '4': 'L', '5': 'N', '6': 'O', '7': 'R', '8': 'S', '9': 'T'};
const GIV=P.giv;
const WORDS=[{n:1,d:'h',r:0,c:0,w:P.w[0]},{n:4,d:'h',r:2,c:0,w:P.w[1]},{n:5,d:'h',r:4,c:0,w:P.w[2]},{n:1,d:'v',r:0,c:0,w:P.w[3]},{n:2,d:'v',r:0,c:2,w:P.w[4]},{n:3,d:'v',r:0,c:4,w:P.w[5]}];
const LK=P.lk;
const NUM={'0,0':1,'0,2':2,'0,4':3,'2,0':4,'4,0':5};
const GV=new Set(GIV.map(a=>a+''));
let su,cwv,sel=null,showErr=false;
const CW={},rev={};
WORDS.forEach(w=>[...w.w].forEach((L,i)=>{const r=w.r+(w.d=='v'?i:0),c=w.c+(w.d=='h'?i:0);CW[r+','+c]={r,c,L}}));
Object.entries(LK).forEach(([k,v])=>{CW[k].sr=v[0];CW[k].sc=v[1];rev[v+'']=CW[k]});
const $=s=>document.querySelector(s);
function reset(){su=SOL.map(r=>r.map(()=>0));GIV.forEach(([r,c])=>su[r][c]=SOL[r][c]);cwv={};sel=null;showErr=false;render()}
function sv(r,c){if(GV.has(r+','+c))return{v:SOL[r][c],t:'g'};const o=rev[r+','+c];if(o&&cwv[o.r+','+o.c]===o.L)return{v:SOL[r][c],t:'a'};return{v:su[r][c],t:''}}
function cv(o){if(su[o.sr][o.sc]===SOL[o.sr][o.sc])return{v:o.L,t:'a'};return{v:cwv[o.r+','+o.c]||'',t:''}}
// build
$('#key').innerHTML=Object.entries(KEY).map(([d,l])=>`<span>${d} = ${l}</span>`).join('');
const gs=$('#su'),gc=$('#cw');
gs.style.gridTemplateColumns='repeat(9,var(--s))';gc.style.gridTemplateColumns='repeat(5,var(--s))';
const sCells={},cCells={};
for(let r=0;r<9;r++)for(let c=0;c<9;c++){const d=document.createElement('div');d.className='c'+(c%3==0&&c?' tl':'')+(r%3==0&&r?' tt':'')+(rev[r+','+c]?' lnk':'');d.onclick=()=>pick('s',r,c);gs.appendChild(d);sCells[r+','+c]=d}
for(let r=0;r<5;r++)for(let c=0;c<5;c++){const k=r+','+c,d=document.createElement('div');if(CW[k]){d.className='c';d.onclick=()=>pick('c',r,c)}else d.className='c blk';gc.appendChild(d);cCells[k]=d}
function pick(g,r,c){sel={g,r,c};render();const i=$('#in');i.value='';i.focus({preventScroll:true})}
function render(){
 let sOk=0,cOk=0;
 for(let r=0;r<9;r++)for(let c=0;c<9;c++){
  const k=r+','+c,x=sv(r,c),d=sCells[k];
  if(x.v===SOL[r][c])sOk++;
  const bad=showErr&&x.t===''&&x.v&&x.v!==SOL[r][c];
  d.className=d.className.replace(/ ?(g|a|bad|sel)\b/g,'')+(x.t?' '+x.t:'')+(bad?' bad':'')+(sel&&sel.g=='s'&&sel.r==r&&sel.c==c?' sel':'');
  d.textContent=x.v||'';
  const o=rev[k];if(o&&!x.v){}
 }
 for(const k in CW){
  const o=CW[k],x=cv(o),d=cCells[k];
  if(x.v===o.L)cOk++;
  const bad=showErr&&x.t===''&&x.v&&x.v!==o.L;
  d.className='c'+(x.t?' '+x.t:'')+(bad?' bad':'')+(sel&&sel.g=='c'&&sel.r==o.r&&sel.c==o.c?' sel':'');
  d.innerHTML=(NUM[k]?`<span class="n">${NUM[k]}</span>`:'')+x.v+`<span class="lk">L${o.sr+1}C${o.sc+1}</span>`;
 }
 $('#st').textContent=`Sudoku ${sOk}/81 · Cruzada ${cOk}/21`;
 $('#win').hidden=!(sOk==81&&cOk==21);
}
function locked(){if(!sel)return true;if(sel.g=='s')return sv(sel.r,sel.c).t!=='';return cv(CW[sel.r+','+sel.c]).t!==''}
function put(ch){
 if(!sel||locked())return;ch=ch.toUpperCase();showErr=false;
 if(sel.g=='s'){if(/^[1-9]$/.test(ch))su[sel.r][sel.c]=+ch}
 else if(/^[A-Z]$/.test(ch))cwv[sel.r+','+sel.c]=ch;
 render();
}
function clear(){if(!sel||locked())return;if(sel.g=='s')su[sel.r][sel.c]=0;else delete cwv[sel.r+','+sel.c];render()}
function move(dr,dc){
 if(!sel)return;const n=sel.g=='s'?9:5;let r=sel.r+dr,c=sel.c+dc;
 while(r>=0&&c>=0&&r<n&&c<n){if(sel.g=='s'||CW[r+','+c]){sel={g:sel.g,r,c};render();return}r+=dr;c+=dc}
}
const inp=$('#in');
inp.addEventListener('input',()=>{const ch=inp.value.slice(-1);inp.value='';if(ch)put(ch)});
inp.addEventListener('keydown',e=>{
 const m={ArrowUp:[-1,0],ArrowDown:[1,0],ArrowLeft:[0,-1],ArrowRight:[0,1]}[e.key];
 if(m){e.preventDefault();move(...m)}else if(e.key=='Backspace'||e.key=='Delete'){e.preventDefault();clear()}
});
$('#chk').onclick=()=>{showErr=!showErr;render()};
$('#rst').onclick=reset;
reset();

const NM={facil:'Fácil',medio:'Médio',dificil:'Difícil',especialista:'Especialista'};
$('#lv').textContent=NM[NIV]+' · jogo '+(IDX+1)+' de '+LIST.length;
$('#nx').href='jogo.html?nivel='+NIV+'&n='+(IDX<LIST.length-1?IDX+2:1);
$('#cl').innerHTML=[['1 →',0],['4 →',1],['5 →',2],['1 ↓',3],['2 ↓',4],['3 ↓',5]].map(a=>'<li><b>'+a[0]+'</b> '+CLUES[P.w[a[1]]]+' (5)</li>').join('');

/* cronômetro */
let t0=0,acc=0,run=false,started=false,done=false;
const tm=$('#tm'),BK='sc_'+NIV+'_'+IDX;
const fmt=s=>String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
const el=()=>Math.floor((acc+(run?Date.now()-t0:0))/1000);
function go(){if(!started&&!done){started=true;run=true;t0=Date.now()}}
function stop(){if(run){acc+=Date.now()-t0;run=false}}
document.querySelector('.boards').addEventListener('pointerdown',go);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(started&&!done&&!run){run=true;t0=Date.now()}});
$('#rst').addEventListener('click',()=>{acc=0;run=false;started=false;done=false;$('#wt').textContent=''});
setInterval(()=>{
 if(!$('#win').hidden&&!done){
  done=true;stop();const t=el();let prev=null;
  try{prev=+localStorage.getItem(BK)||null;if(!prev||t<prev)localStorage.setItem(BK,t)}catch(e){}
  $('#wt').textContent=' Tempo: '+fmt(t)+(!prev||t<prev?' · novo recorde!':' · recorde: '+fmt(prev));
 }
 tm.textContent='⏱ '+fmt(el());
},250);

/* progresso salvo */
const SK='sp_'+NIV+'_'+IDX;
try{
 const sv=JSON.parse(localStorage.getItem(SK)||'null');
 if(sv){
  GIV.forEach(()=>0);
  for(let r=0;r<9;r++)for(let c=0;c<9;c++)if(!GV.has(r+','+c)&&sv.su&&sv.su[r]&&sv.su[r][c])su[r][c]=sv.su[r][c];
  cwv=sv.cw||{};acc=(sv.t||0)*1000;render();
  $('#lv').textContent+=' · progresso retomado';
 }
}catch(e){}
let last='';
function save(){
 try{
  if(!$('#win').hidden){localStorage.removeItem(SK);return}
  if(!started&&!acc)return;
  const s=JSON.stringify({su:su,cw:cwv,t:el()});
  if(s!==last){last=s;localStorage.setItem(SK,s)}
 }catch(e){}
}
setInterval(save,1000);
document.addEventListener('visibilitychange',()=>{if(document.hidden)save()});
window.addEventListener('pagehide',save);
$('#rst').addEventListener('click',()=>{try{localStorage.removeItem(SK)}catch(e){}last=''});
