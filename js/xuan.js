/* MÙA XUÂN – MÙA EM LỚN */
(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var A="tin_bai/mua_xuan/tin_bai_";
function art(n){return A+n+"_mua_xuan.html"}
/* petals + CTA */
var pe=$("#petals");for(var i=0;i<22;i++){var p=document.createElement("span");p.className="petal";p.style.left=Math.random()*100+"%";p.style.animationDuration=(7+Math.random()*8)+"s";p.style.animationDelay=(-Math.random()*12)+"s";p.style.transform="scale("+(.6+Math.random())+")";pe.appendChild(p)}
$("#startBtn").onclick=function(){$("#nha").scrollIntoView({behavior:"smooth"})};

/* BƯỚC 1: ghé nhà em */
var HS=[
 {x:22,y:38,i:"🌸",t:"Cây đào trước cửa",p:"Chẳng ai nói với em Tết sắp đến. Một sáng thức dậy, cây đào đã lấm tấm hoa. Thế là xuân về.",a:1},
 {x:39,y:50,i:"🧧",t:"Chữ Phúc và câu đối",p:"Bố dán câu đối đỏ lên cửa gỗ. Em đứng xem và hỏi mãi chữ Phúc nghĩa là gì.",a:1},
 {x:66,y:55,i:"🍲",t:"Mâm cơm đầu năm",p:"Bà bày mâm cơm từ sớm. Mùi bếp, mùi xôi, mùi Tết đều bắt đầu từ căn bếp ấy.",a:4},
 {x:29,y:71,i:"🧹",t:"Quét sân đón xuân",p:"Em cầm chổi to gần bằng người. Quét sân là để năm mới đến sạch sẽ, vui vẻ.",a:8},
 {x:47,y:76,i:"🌼",t:"Nhặt cánh hoa rơi",p:"Em trai nhặt những cánh hoa đào rơi đầy sân, nói để dành cho bà cài lên bàn thờ.",a:1},
 {x:77,y:49,i:"👗",t:"Áo mới treo trong tủ",p:"Mẹ đã may xong áo mới từ mấy đêm trước. Em chỉ được nhìn, đến mùng Một mới được mặc.",a:3},
 {x:21,y:80,i:"🐔",t:"Đàn gà đi dạo",p:"Gà cũng biết Tết. Chúng đi lạch bạch quanh sân như đang kiểm tra em quét có sạch không.",a:2}
];
var sc=$("#scene"),st=$("#story"),seen={};
HS.forEach(function(h,k){var b=document.createElement("button");b.type="button";b.className="hs";b.style.left=h.x+"%";b.style.top=h.y+"%";b.innerHTML=h.i+"<span>"+h.t+"</span>";b.setAttribute("aria-label",h.t);
 b.onclick=function(){$$(".hs").forEach(function(e){e.classList.remove("on")});b.classList.add("on");$("h3",st).textContent=h.i+" "+h.t;$("p",st).textContent=h.p;$("a",st).href=art(h.a);st.classList.add("on");seen[k]=1;$("#counter").textContent="Đã khám phá "+Object.keys(seen).length+" / "+HS.length+" điểm"+(Object.keys(seen).length==HS.length?" 🎉 Kéo xuống để ra bản!":"")};
 sc.appendChild(b)});
$(".x",st).onclick=function(){st.classList.remove("on")};

/* BƯỚC 2: con đường */
var road=$("#road"),rg=$("#rg"),stops=$$(".stop");
function onScroll(){var r=road.getBoundingClientRect(),vh=innerHeight;var pr=Math.max(0,Math.min(1,(vh*.6-r.top)/r.height));rg.style.strokeDashoffset=1-pr;stops.forEach(function(s){if(s.getBoundingClientRect().top<vh*.85)s.classList.add("on")})}
addEventListener("scroll",onScroll,{passive:true});addEventListener("resize",onScroll);onScroll();
/* POV video */
$("#povPlay").onclick=function(){var pv=$("#pov"),v=document.createElement("video");v.src="../resources/video/le-hoi.mp4";v.controls=true;v.autoplay=true;v.playsInline=true;v.onerror=function(){v.remove();$("#povPlay").style.display="none";var m=document.createElement("p");m.style.cssText="position:relative;color:#fff;background:rgba(0,0,0,.6);padding:10px 16px;border-radius:12px;text-align:center";m.textContent="Chưa có video. Hãy thêm file resources/video/le-hoi.mp4";pv.appendChild(m)};pv.appendChild(v);$("#povPlay").style.display="none"};
/* Trang phục */
var Z={pattern:["Hoa văn","Những đường zích zắc và hình sao tám cánh là con đường, là núi, là mặt trời của bản. Em được mẹ dặn: mặc áo là mang theo cả quê hương."],
 seam:["Đường may","Mẹ may áo mới suốt mấy đêm bên bếp lửa. Mỗi mũi chỉ là một lời chúc cho em lớn lên khoẻ mạnh."],
 color:["Màu sắc","Màu chàm lấy từ lá cây nhuộm nhiều lần, đỏ và vàng để dành cho ngày hội. Màu nào cũng có chuyện của nó."]};
function zone(z){$$("#cz .zone").forEach(function(e){e.classList.toggle("on",e.dataset.z==z)});$$(".zl button").forEach(function(b){b.classList.toggle("on",b.dataset.z==z)});$("#zout").innerHTML="<b>"+Z[z][0]+":</b> "+Z[z][1]}
$$("#cz .zone").forEach(function(e){["mouseenter","focus","click"].forEach(function(ev){e.addEventListener(ev,function(){zone(e.dataset.z)})})});
$$(".zl button").forEach(function(b){b.onclick=function(){zone(b.dataset.z)}});

/* Âm thanh (tổng hợp bằng WebAudio, có thể thay bằng file mp3 thật qua SRC) */
var AC,master,SRC={}; /* ví dụ SRC.khen="../resources/audio/khen.mp3" */
var SP=[{k:"khen",x:22,y:34,n:"Tiếng khèn",t:"Tiếng khèn vang lên từ đầu bản, gọi mọi người đi hội."},
 {k:"tre",x:70,y:28,n:"Tiếng trẻ con",t:"Lũ trẻ chạy khắp sân, tiếng cười lẫn tiếng chân trần trên đất."},
 {k:"cho",x:36,y:70,n:"Tiếng chợ",t:"Tiếng mời mọc, tiếng trả giá, tiếng cười ngày chợ phiên."},
 {k:"hoi",x:78,y:68,n:"Tiếng lễ hội",t:"Tiếng trống dồn dập, tiếng chân nhảy quanh vòng xoè."}];
var run={},timers={},mix=false,sm=$("#smap");
function ctx(){if(!AC){AC=new (window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=.8;master.connect(AC.destination)}if(AC.state=="suspended")AC.resume();return AC}
function env(g,t,a,d,v){g.gain.cancelScheduledValues(t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(.0008,t+a+d)}
function noise(c){var b=c.createBuffer(1,c.sampleRate*2,c.sampleRate),d=b.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=Math.random()*2-1;var s=c.createBufferSource();s.buffer=b;s.loop=true;return s}
var NOTES=[329.6,392,440,523.3,587.3,440,392,329.6];
var SYN={
 khen:function(c){var n=0,id=setInterval(function(){var f=NOTES[n++%NOTES.length],t=c.currentTime;[1,1.005,.5].forEach(function(m){var o=c.createOscillator(),g=c.createGain(),lp=c.createBiquadFilter();o.type="sawtooth";o.frequency.value=f*m;lp.type="lowpass";lp.frequency.value=1400;o.connect(lp);lp.connect(g);g.connect(master);env(g,t,.12,1.3,.07);o.start(t);o.stop(t+1.5)})},900);return function(){clearInterval(id)}},
 tre:function(c){var id=setInterval(function(){var t=c.currentTime,o=c.createOscillator(),g=c.createGain(),f=700+Math.random()*700;o.frequency.setValueAtTime(f,t);o.frequency.linearRampToValueAtTime(f*1.5,t+.12);o.connect(g);g.connect(master);env(g,t,.02,.18,.09);o.start(t);o.stop(t+.3)},260);return function(){clearInterval(id)}},
 cho:function(c){var s=noise(c),bp=c.createBiquadFilter(),g=c.createGain();bp.type="bandpass";bp.frequency.value=900;bp.Q.value=.7;g.gain.value=.05;s.connect(bp);bp.connect(g);g.connect(master);s.start();var id=setInterval(function(){bp.frequency.setTargetAtTime(500+Math.random()*1200,c.currentTime,.1);g.gain.setTargetAtTime(.02+Math.random()*.09,c.currentTime,.08)},180);return function(){clearInterval(id);s.stop()}},
 hoi:function(c){var n=0,id=setInterval(function(){var t=c.currentTime,o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(45,t+.2);o.connect(g);g.connect(master);env(g,t,.005,.3,.5);o.start(t);o.stop(t+.4);if(n++%2){var q=c.createOscillator(),h=c.createGain();q.type="triangle";q.frequency.value=1318;q.connect(h);h.connect(master);env(h,t+.25,.005,.25,.08);q.start(t+.25);q.stop(t+.6)}},480);return function(){clearInterval(id)}}};
function startS(k){if(run[k])return;var c=ctx(),stop;if(SRC[k]){var a=new Audio(SRC[k]);a.loop=true;a.play();stop=function(){a.pause()}}else stop=SYN[k](c);run[k]=stop;$('[data-k="'+k+'"]').classList.add("on")}
function stopS(k){if(!run[k])return;run[k]();delete run[k];clearTimeout(timers[k]);$('[data-k="'+k+'"]').classList.remove("on")}
function stopAll(){Object.keys(run).forEach(stopS)}
SP.forEach(function(s){var b=document.createElement("button");b.type="button";b.className="sp";b.dataset.k=s.k;b.style.left=s.x+"%";b.style.top=s.y+"%";b.innerHTML="<b>"+s.n+"</b>";b.setAttribute("aria-label",s.n);
 b.onclick=function(){$("#sout").innerHTML="<b>"+s.n+":</b> "+s.t;if(run[s.k]){stopS(s.k);return}startS(s.k);if(!mix)timers[s.k]=setTimeout(function(){stopS(s.k)},7000)};sm.appendChild(b)});
$("#mixBtn").onclick=function(){mix=!mix;this.textContent="🎚️ Hòa âm: "+(mix?"bật (âm thanh giữ nguyên)":"tắt");this.classList.toggle("on",mix)};
$("#songBtn").onclick=function(){mix=true;$("#mixBtn").textContent="🎚️ Hòa âm: bật (âm thanh giữ nguyên)";$("#mixBtn").classList.add("on");SP.forEach(function(s,i){setTimeout(function(){startS(s.k)},i*1200)});$("#sout").innerHTML="<b>Bản nhạc mùa xuân:</b> khèn, tiếng cười, chợ và trống hội cùng cất lên."};
$("#stopBtn").onclick=stopAll;

/* Chợ phiên */
var M=[["🍙","Xôi ngũ sắc",10000,"Năm màu xôi là năm lời chúc: no ấm, bình an, đủ đầy."],["🌸","Cành đào nhỏ",15000,"Mua về cắm bên cửa sổ, để xuân ở lại lâu hơn."],["🧣","Khăn piêu thêu",20000,"Mỗi họa tiết trên khăn do tay người thêu kể lại một mùa."],["🍬","Kẹo lạc",5000,"Vị ngọt đầu năm, em chia cho cả đám bạn."],["🎯","Quả còn",12000,"Quả còn tung qua tung lại là lời hẹn hò, làm quen ngày hội."],["🎶","Sáo trúc",18000,"Chiếc sáo nhỏ thổi lên là cả bản nghe ra tiếng xuân."],["🌱","Hạt giống",7000,"Em mua để gieo cùng ông bà, hẹn một mùa sau sẽ nảy mầm."],["🥮","Bánh dày",8000,"Dẻo, thơm, gói trong lá. Dành cho người ở nhà chờ em."]];
var cart={},B=50000;
function fm(n){return n.toLocaleString("vi-VN")+"đ"}
M.forEach(function(m,i){var b=document.createElement("button");b.type="button";b.className="it";b.innerHTML="<i>"+m[0]+"</i>"+m[1]+"<small>"+fm(m[2])+"</small>";
 b.onclick=function(){var tot=sum();if(cart[i]){delete cart[i]}else{if(tot+m[2]>B){b.classList.add("shake");setTimeout(function(){b.classList.remove("shake")},400);$("#mout").innerHTML="Hết tiền rồi! Hãy bỏ bớt một món ra.";return}cart[i]=1;$("#mout").innerHTML="<b>"+m[0]+" "+m[1]+":</b> "+m[3]}
 b.classList.toggle("pick",!!cart[i]);var s=sum();$("#mbar").style.width=s/B*100+"%";$("#mleft").textContent="Còn lại "+fm(B-s);if(s>=B-3000&&s<=B)$("#mout").innerHTML+="<br>🎉 Giỏ đã đầy. Bạn vừa mang cả mùa xuân của chợ phiên về nhà.";};$("#mk").appendChild(b)});
function sum(){var t=0;Object.keys(cart).forEach(function(k){t+=M[k][2]});return t}

/* BƯỚC 3: sân chơi */
var Y=[{x:20,y:42,i:"🪀",n:"Con quay",t:"Trò quay",p:"Em quay con quay gỗ xem ai quay được lâu nhất. Thua cũng cười ngặt nghẽo.",a:2},
 {x:42,y:62,i:"🎯",n:"Ném còn",t:"Ném còn",p:"Quả còn bay qua vòng tròn là cả sân reo lên. Ai ném trúng sẽ được chọn người bạn đầu tiên.",a:2},
 {x:66,y:40,i:"🪁",n:"Diều",t:"Thả diều",p:"Gió xuân thổi từ thung lũng lên. Diều của em bay cao hơn mái nhà.",a:1},
 {x:82,y:66,i:"🎠",n:"Đu quay",t:"Đu quay ngày hội",p:"Chiếc đu tre cọt kẹt. Mỗi lần bay lên em thấy cả bản nhỏ xíu phía dưới.",a:5},
 {x:52,y:30,i:"📷",n:"Ảnh kể chuyện",t:"Photo story",p:"Một bức ảnh em chụp cùng bạn đầu xuân. Hãy thay bằng ảnh thật của dự án.",a:1}];
Y.forEach(function(o){var b=document.createElement("button");b.type="button";b.className="obj";b.style.left=o.x+"%";b.style.top=o.y+"%";b.innerHTML=o.i+"<em>"+o.n+"</em>";b.onclick=function(){modal(o.i,o.t,o.p,art(o.a))};$("#yard").appendChild(b)});
var md=$("#modal");function modal(e,t,p,a){$(".e",md).textContent=e;$("h3",md).textContent=t;$("p",md).textContent=p;$("a",md).href=a;md.classList.add("on")}
md.onclick=function(e){if(e.target==md||e.target.className=="x")md.classList.remove("on")};
addEventListener("keydown",function(e){if(e.key=="Escape")md.classList.remove("on")});
/* hộp quà */
var G=[["🧧","Lì xì đầu năm","Chiếc phong bì đỏ em nhận từ bà. Em giữ rất kỹ, không nỡ tiêu.",8],["👟","Đôi dép mới","Bố mua từ phiên chợ cuối năm. Em ôm ngủ cả đêm.",8],["🍬","Gói kẹo của bạn","Bạn cùng bản chia cho em một nửa gói kẹo, vị ngọt nhớ mãi.",4],["📖","Quyển vở mới","Trang đầu em viết ước mơ của mình.",7]];
G.forEach(function(g){var d=document.createElement("div");d.className="gift";d.innerHTML='<div class="in"><div class="f"><i>🎁</i>Hộp quà<button type="button">Mở quà</button></div><div class="b"><div style="font-size:2.4rem">'+g[0]+'</div><h3>'+g[1]+'</h3><p>'+g[2]+'</p><a href="'+art(g[3])+'">Đọc thêm →</a></div></div>';$("button",d).onclick=function(){d.classList.add("open")};$("#gifts").appendChild(d)});
/* điều ước */
var W=[["Bạn nhỏ ở bản Thia","Em ước được học thật giỏi để sau này về dạy các em nhỏ trong bản.","🧒"],["Bạn nhỏ Pà Cò","Em ước mùa xuân nào bà cũng khoẻ để kể chuyện cho em nghe.","👧"],["Bạn nhỏ Sơn La","Em ước có một chiếc khèn thật to để thổi gọi xuân về.","🧒"],["Bạn nhỏ Tây Nguyên","Em ước tiếng chiêng của buôn làng mãi mãi vang xa.","👦"],["Bạn nhỏ vùng cao","Em ước đường đến trường không còn trơn trượt mỗi mùa mưa.","👧"],["Bạn nhỏ Mù Cang Chải","Em ước được nhìn thấy biển như trong sách.","🧒"]];
var sky=$("#sky"),wi=0;
for(var s=0;s<46;s++){var b=document.createElement("button");b.type="button";var wish=s%8==3&&wi<W.length;b.className="st"+(wish?" w":"");var z=wish?26:8+Math.random()*10;b.style.cssText="left:"+(4+Math.random()*90)+"%;top:"+(4+Math.random()*88)+"%;--s:"+z+"px;--d:"+(Math.random()*3)+"s";b.setAttribute("aria-label",wish?"Ngôi sao điều ước":"Ngôi sao");
 (function(b,w){b.onclick=function(){var c=$("#wcard");if(w){c.innerHTML='<div class="av">'+w[2]+'</div><div><h4>Em ước… <small>('+w[0]+')</small></h4><p>'+w[1]+'</p><p><small>Chỗ dành cho video hoặc chân dung của em.</small></p></div>'}else{c.innerHTML='<div class="av">✨</div><div><h4>Sao nhỏ</h4><p>Ngôi sao này đang chờ điều ước của bạn. Thử một sao vàng nhé.</p></div>'}}})(b,wish?W[wi]:null);
 if(wish)wi++;sky.appendChild(b)}
})();
