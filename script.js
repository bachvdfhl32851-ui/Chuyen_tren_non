(function(){
"use strict";
var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
var KEY="ctn-lang",lang="vi";
try{lang=localStorage.getItem(KEY)==="en"?"en":"vi"}catch(e){}
/* ---- song ngu ---- */
var D={
foods:[[{vi:"Bánh chưng gù",en:"Humped chung cake"},{vi:"Cả nhà quây quần gói bánh. Em được giữ phần lá xanh nhất. (Nội dung mẫu, thay bằng câu chuyện thật)",en:"The whole family gathers to wrap the cakes. I keep the greenest leaves. (Sample text, replace with a real story)"}],
[{vi:"Bữa cơm đầu năm",en:"First meal of the year"},{vi:"Mâm cơm đủ ba thế hệ bên bếp lửa. (Nội dung mẫu)",en:"Three generations around one tray by the fire. (Sample text)"}],
[{vi:"Váy áo mới",en:"New clothes"},{vi:"Mẹ thêu từng hoa văn suốt mùa đông cho em. (Nội dung mẫu)",en:"Mom embroidered every pattern all winter for me. (Sample text)"}]],
toys:[[{vi:"Hòn đá",en:"Stones"},{vi:"Ô ăn quan trên nền đất: vài hòn đá là đủ một buổi chiều. (Nội dung mẫu)",en:"A mancala-style game on the ground: a few stones fill an afternoon. (Sample text)"}],
[{vi:"Lá cây",en:"Leaves"},{vi:"Thổi lá thành tiếng nhạc, gấp lá thành chiếc thuyền nhỏ. (Nội dung mẫu)",en:"Blow a leaf into music, fold it into a tiny boat. (Sample text)"}],
[{vi:"Con quay",en:"Spinning top"},{vi:"Con quay gỗ do ông chẻ cho, quay thắng bạn là nhất. (Nội dung mẫu)",en:"A wooden top carved by grandpa; longest spin wins. (Sample text)"}],
[{vi:"Sợi dây",en:"Rope"},{vi:"Nhảy dây, kéo co: cả bản cùng chơi. (Nội dung mẫu)",en:"Jump rope and tug of war: the whole village joins in. (Sample text)"}],
[{vi:"Con suối",en:"The stream"},{vi:"Tắm suối, bắt cá nhỏ, nghịch nước đến chiều. (Nội dung mẫu)",en:"Splashing, catching tiny fish, playing till evening. (Sample text)"}]],
stops:[{vi:"Nhà",en:"Home"},{vi:"Đường",en:"Road"},{vi:"Cầu",en:"Bridge"},{vi:"Trường",en:"School"},{vi:"Lớp",en:"Class"},{vi:"Sân chơi",en:"Yard"}],
walk:[{vi:"Sáng sớm, em cõng cặp ra khỏi nhà.",en:"Early morning, I carry my bag out of the house."},{vi:"Con đường đất dốc, sương còn ướt chân.",en:"A steep dirt road, dew still on my feet."},{vi:"Qua cây cầu tre là gần đến rồi.",en:"Across the bamboo bridge, almost there."},{vi:"Cổng trường mở. Cô đã đứng đợi.",en:"The school gate is open. Teacher is waiting."},{vi:"Tiếng đọc bài vang cả lớp.",en:"The class fills with reading aloud."},{vi:"Ra chơi! Sân trường là của em.",en:"Recess! The yard is mine."}],
folks:[[{vi:"Bà",en:"Grandma"},{vi:"Bà kể về ngày xưa khi núi còn đầy sương. (Nội dung mẫu)",en:"Grandma tells of the old days when mist filled the mountain. (Sample text)"}],
[{vi:"Mẹ",en:"Mom"},{vi:"Mẹ dệt vải bên bếp, vừa hát vừa dệt. (Nội dung mẫu)",en:"Mom weaves by the fire, singing as she works. (Sample text)"}],
[{vi:"Ông",en:"Grandpa"},{vi:"Ông đan gùi và kể truyện dân gian. (Nội dung mẫu)",en:"Grandpa weaves baskets and tells folk tales. (Sample text)"}],
[{vi:"Em",en:"Me"},{vi:"Em ngồi nghe, và mơ có một cuốn sách của riêng mình. (Nội dung mẫu)",en:"I sit and listen, dreaming of a book of my own. (Sample text)"}]]};
function buildPick(id,list,out,fixed){var box=$(id),o=$(out);box.innerHTML="";list.forEach(function(it,i){var b=document.createElement("button");b.className="toy chip";b.textContent=it[0][lang];b.onclick=function(){$$(".toy",box).forEach(function(x){x.classList.remove("on")});b.classList.add("on");b.dataset.i=i;o.innerHTML="<b class='hand' style='font-size:1.3rem'>"+it[0][lang]+"</b><br>"+it[1][lang];box.dataset.sel=i};box.appendChild(b)});
 if(box.dataset.sel!=null&&box.dataset.sel!==""){var s=$$(".toy",box)[box.dataset.sel];s&&s.click()}else o.textContent=lang==="vi"?"Chạm vào một hình để bắt đầu.":"Tap a picture to begin."}
function walkUpdate(){var v=+$("#walk").value,i=Math.round(v),p=$("#road path"),L=p.getTotalLength(),pt=p.getPointAtLength(L*v/5);
 $("#foot").setAttribute("cx",pt.x);$("#foot").setAttribute("cy",pt.y);
 $$("#stops span").forEach(function(s,k){s.classList.toggle("cur",k===i)});$("#walkOut").textContent=D.walk[i][lang]}
function dyn(){if($("#foods"))buildPick("#foods",D.foods,"#foodOut");if($("#toys"))buildPick("#toys",D.toys,"#toyOut");if($("#folks"))buildPick("#folks",D.folks,"#folkOut");
 if($("#walk")){$("#stops").innerHTML=D.stops.map(function(s){return"<span>"+s[lang]+"</span>"}).join("");walkUpdate()}}
function apply(){document.documentElement.lang=lang;
 $$("[data-en]").forEach(function(e){if(!e.hasAttribute("data-vi"))e.setAttribute("data-vi",e.innerHTML);e.innerHTML=lang==="en"?e.getAttribute("data-en"):e.getAttribute("data-vi")});
 $$("[data-en-aria]:not(.mc-go)").forEach(function(e){if(!e.hasAttribute("data-vi-aria"))e.setAttribute("data-vi-aria",e.getAttribute("aria-label")||"");e.setAttribute("aria-label",lang==="en"?e.getAttribute("data-en-aria"):e.getAttribute("data-vi-aria"))});
 $(".lt").textContent=lang==="en"?"VI":"EN";buildTitle();buildDocTitle();dyn();sndLabel();document.dispatchEvent(new Event("langchange"))}
$("#lang").onclick=function(){lang=lang==="en"?"vi":"en";try{localStorage.setItem(KEY,lang)}catch(e){}apply()};
if($("#walk"))$("#walk").oninput=walkUpdate;
/* ---- theme ---- */
$("#theme").onclick=function(){var r=document.documentElement,d=r.dataset.theme==="dark"||(!r.dataset.theme&&matchMedia("(prefers-color-scheme:dark)").matches);r.dataset.theme=d?"light":"dark";try{sessionStorage.setItem("ctn-theme",r.dataset.theme)}catch(e){}};
try{document.documentElement.dataset.theme=sessionStorage.getItem("ctn-theme")||"light"}catch(e){document.documentElement.dataset.theme="light"}
var pp=location.pathname.split("/").pop()||"index.html";$$("nav a").forEach(function(a){if(a.getAttribute("href")===pp)a.classList.add("cur")});
/* ---- hieu ung nay chu + song ngu bo dau ---- */
var TT={vi:"ĐI QUA BỐN MÙA\nGẶP NHỮNG NGÀY THƠ",en:"THROUGH FOUR SEASONS\nMEETING CHILDHOOD DAYS"};
function buildTitle(){var t=$("#title");if(!t)return;var n=0;t.setAttribute("aria-label",TT[lang].replace("\n"," "));
 t.innerHTML=TT[lang].split("\n").map(function(line){return line.split(" ").filter(Boolean).map(function(w){return'<span class="w" aria-hidden="true">'+w.split("").map(function(c){return c==="Ố"?'<span class="ac" data-a="´" style="--i:'+(n++)+'">Ô</span>':'<span style="--i:'+(n++)+'">'+c+'</span>'}).join("")+"</span>"}).join("")}).join('<i class="br" aria-hidden="true"></i>')}
var T0=document.title;
function buildDocTitle(){var cur=$("nav a.cur"),home=!cur||cur.getAttribute("href")==="index.html",brand=lang==="en"?"Chuyen tren non":"Chuyện trên non";
 document.title=home?brand:(lang==="en"?cur.getAttribute("data-en"):cur.getAttribute("data-vi")||cur.textContent)+" · "+brand}
/* ---- reveal ---- */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("on");io.unobserve(e.target)}})},{threshold:.15});$$(".rv").forEach(function(e,i){e.style.transitionDelay=(i%3)*90+"ms";io.observe(e)});
/* ---- sound effect ---- */
var ac,on=false,node;
function sndLabel(){if(!$("#snd"))return;$("#snd").innerHTML=lang==="vi"?"Tiếng củi cháy: "+(on?"bật":"tắt"):"Fire crackle: "+(on?"on":"off");$("#snd").removeAttribute("data-en")}
if($("#snd"))$("#snd").onclick=function(){on=!on;if(on){ac=ac||new(window.AudioContext||window.webkitAudioContext)();var b=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate),a=b.getChannelData(0);for(var i=0;i<a.length;i++)a[i]=Math.random()<.0009?(Math.random()*2-1):(Math.random()*2-1)*.03;node=ac.createBufferSource();node.buffer=b;node.loop=true;var g=ac.createGain();g.gain.value=.35;node.connect(g).connect(ac.destination);node.start()}else if(node)node.stop();sndLabel()};
apply();
/* ---- hieu ung chuyen trang muot + nut ve dau trang ---- */
if(!("startViewTransition" in document)&&!matchMedia("(prefers-reduced-motion:reduce)").matches)$$("a[href$='.html']").forEach(function(l){l.addEventListener("click",function(e){if(l.target==="_blank"||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();document.body.classList.add("page-leaving");setTimeout(function(){location.href=l.getAttribute("href")},280)})});
var tb=$("#topBtn");if(tb){addEventListener("scroll",function(){tb.classList.toggle("show",scrollY>500)},{passive:true});tb.onclick=function(){scrollTo({top:0,behavior:"smooth"})}}
})();
