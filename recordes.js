const NM={facil:'Fácil',medio:'Médio',dificil:'Difícil',especialista:'Especialista'};
const fmt=s=>String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
function rd(k){try{return localStorage.getItem(k)}catch(e){return null}}
function draw(){
 let h='';
 for(const nv in PUZZLES){
  const L=PUZZLES[nv];let rows='',ok=0,best=null;
  L.forEach((p,i)=>{
   const r=+rd('sc_'+nv+'_'+i)||0,pr=rd('sp_'+nv+'_'+i);let st='—';
   if(r){ok++;if(best===null||r<best)best=r;st=fmt(r)}else if(pr)st='em andamento';
   rows+='<tr><td>Jogo '+(i+1)+'</td><td>'+st+'</td><td><a href="jogo.html?nivel='+nv+'&n='+(i+1)+'">'+(r?'Jogar de novo':pr?'Continuar':'Jogar')+'</a></td></tr>';
  });
  h+='<details'+(ok?' open':'')+'><summary><b>'+NM[nv]+'</b> <small>· '+ok+'/'+L.length+' concluídos'+(best!==null?' · melhor tempo '+fmt(best):'')+'</small></summary><table><tr><th>Jogo</th><th>Recorde</th><th></th></tr>'+rows+'</table></details>';
 }
 document.getElementById('lista').innerHTML=h;
}
document.getElementById('apagar').onclick=function(){
 if(!confirm('Apagar todos os recordes e progressos salvos neste navegador?'))return;
 try{Object.keys(localStorage).filter(function(k){return /^s[cp]_/.test(k)}).forEach(function(k){localStorage.removeItem(k)})}catch(e){}
 draw();
};
draw();
