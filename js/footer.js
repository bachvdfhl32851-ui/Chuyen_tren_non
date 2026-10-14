/* ==== Cuoi trang ==== */
var SOCIAL={
  facebook:"https://www.facebook.com/search/pages?q=Chuy%E1%BB%87n%20Tr%C3%AAn%20Non",
  zalo:"https://zalo.me/0372549701",
  tiktok:"https://www.tiktok.com/@chuyentrennon",
  email:"https://mail.google.com/mail/?view=cm&fs=1&to=chuyentrennon@gmail.com"
};
document.querySelectorAll("footer [data-social]").forEach(function(a){
  var u=SOCIAL[a.getAttribute("data-social")];
  if(u){a.href=u;a.target="_blank";a.rel="noopener"}
});
(function(){
  function setPh(){
    var en=document.documentElement.lang==="en";
    document.querySelectorAll("footer [data-ph-en]").forEach(function(i){
      if(!i.hasAttribute("data-ph-vi"))i.setAttribute("data-ph-vi",i.getAttribute("placeholder")||"");
      i.setAttribute("placeholder",en?i.getAttribute("data-ph-en"):i.getAttribute("data-ph-vi"));
    });
  }
  setPh();
  document.addEventListener("langchange",setPh);
})();

/* Form "Theo doi ngay": chua co may chu nen mo email gui toi hop thu lien he */
(function(){
  var f=document.querySelector("footer .ft-form");
  if(!f)return;
  var T={vi:{ok:"Đang mở ứng dụng email để gửi đăng ký của bạn…",no:"Chưa có email nhận thư (CONTACT_EMAIL trong config.js)."},
         en:{ok:"Opening your email app to send your sign-up…",no:"No contact email set (CONTACT_EMAIL in config.js)."}};
  var msg=document.createElement("p");msg.className="ft-msg";msg.setAttribute("role","status");msg.hidden=true;f.appendChild(msg);
  f.addEventListener("submit",function(e){
    e.preventDefault();
    var en=document.documentElement.lang==="en",t=en?T.en:T.vi;
    var to=((window.CTN_CONFIG||{}).CONTACT_EMAIL||"").trim();
    if(!to){msg.textContent=t.no;msg.hidden=false;return}
    var nm=f.elements.name.value.trim(),em=f.elements.email.value.trim();
    var sub=en?"[Chuyen tren non] Sign up for updates":"[Chuyện trên non] Đăng ký nhận thông tin";
    var body=(en?"Name: ":"Họ tên: ")+nm+"\nEmail: "+em+"\n";
    msg.textContent=t.ok;msg.hidden=false;
    location.href="mailto:"+encodeURIComponent(to).replace(/%40/g,"@")+"?subject="+encodeURIComponent(sub)+"&body="+encodeURIComponent(body);
  });
})();
