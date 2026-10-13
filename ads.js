/* Configure aqui sua conta de anúncios (ex.: Google AdSense). Enquanto estiver com X, aparecem só espaços reservados. */
const ADS={client:'ca-pub-XXXXXXXXXXXXXXXX',slots:{top:'0000000000',bottom:'0000000000'}};
(function(){
 var real=!/XXXX/.test(ADS.client);
 function get(){try{return localStorage.getItem('cons')}catch(e){return null}}
 function set(v){try{localStorage.setItem('cons',v)}catch(e){}}
 window.resetCons=function(){try{localStorage.removeItem('cons')}catch(e){}location.reload();return false};
 function load(){
  if(!real)return;
  var s=document.createElement('script');s.async=true;s.crossOrigin='anonymous';
  s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+ADS.client;document.head.appendChild(s);
  document.querySelectorAll('.ad').forEach(function(d){
   d.innerHTML='<ins class="adsbygoogle" style="display:block;width:100%" data-ad-client="'+ADS.client+'" data-ad-slot="'+(ADS.slots[d.dataset.slot]||'')+'" data-ad-format="auto" data-full-width-responsive="true"></ins>';
   (window.adsbygoogle=window.adsbygoogle||[]).push({});
  });
 }
 function banner(){
  var b=document.createElement('div');b.id='cb';
  b.innerHTML='<span>Usamos cookies para exibir anúncios e melhorar o site. Veja a <a href="privacidade.html">Política de Privacidade</a>.</span><button id="ca">Aceitar</button><button id="cr">Recusar</button>';
  document.body.appendChild(b);
  document.getElementById('ca').onclick=function(){set('sim');b.remove();load()};
  document.getElementById('cr').onclick=function(){set('nao');b.remove()};
 }
 var c=get();if(c==='sim')load();else if(c===null)banner();
})();
