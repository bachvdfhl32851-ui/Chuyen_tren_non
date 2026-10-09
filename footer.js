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
