/* So lieu chay */
(function(){
  var nums=document.querySelectorAll(".stat-num[data-to]");
  if(!nums.length)return;
  var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches;
  var DURATION=2000;
  function ease(t){return 1-Math.pow(1-t,3)}          /* nhanh luc dau, cham dan ve cuoi */
  function show(el,v){el.textContent=Math.round(v)+el.getAttribute("data-suffix")}
  function run(el){
    var to=parseFloat(el.getAttribute("data-to")),t0=null;
    if(reduce){show(el,to);return}
    function step(ts){
      if(t0===null)t0=ts;
      var p=Math.min((ts-t0)/DURATION,1);
      show(el,to*ease(p));
      if(p<1)requestAnimationFrame(step);else show(el,to);
    }
    requestAnimationFrame(step);
  }
  nums.forEach(function(el){el.setAttribute("aria-label",el.getAttribute("data-to")+el.getAttribute("data-suffix"));show(el,0)});
  if(!("IntersectionObserver" in window)){nums.forEach(run);return}
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);run(e.target)}});
  },{threshold:.5});
  nums.forEach(function(el){io.observe(el)});
})();
