/*
 * The scroll engine: one small inline script that turns scroll position into
 * CSS variables. Components never animate in JavaScript; they read these
 * variables in CSS (see src/app/styles/motion.css).
 *
 *   <html class="motion">      set before first paint when JavaScript runs and
 *                              the visitor has not asked for reduced motion.
 *                              Every scroll effect is scoped to it, so without
 *                              it the page is its plain, fully visible layout.
 *   .page-progress { --page-p } 0 to 1 through the whole page, written on the progress
 *                              line itself (also .progress-page and [data-page-progress]):
 *                              a variable on <html> would restyle the whole document
 *                              on every scroll frame.
 *   [data-scene-vars]          inside a scene: --p is written there instead of on the
 *                              scene element, so a large scene restyles only what
 *                              reads the variable.
 *   [data-scene]  { --p }      0 to 1 while a tall section scrolls past its
 *                              pinned stage. data-scene is "all", "md" or
 *                              "lg": the width from which it pins; the engine
 *                              sets data-pinned while that holds. With
 *                              data-steps="n" the scene also gets data-step,
 *                              and its [data-scene-step] children get
 *                              data-active / data-past.
 *   [data-view]   { --v }      0 to 1 while an element crosses the viewport
 *                              (0: its top meets the bottom edge; 1: its
 *                              bottom leaves the top edge).
 *   [data-inview] [data-in]    set once, the first time the element is seen.
 *   [data-magnetic] { --mx, --my }  a few pixels toward a fine pointer.
 *   <html class="restoring">   for a second after Back or Forward: entrances
 *                              are skipped, and anything above the restored
 *                              scroll position counts as already seen, so a
 *                              returning page is simply there.
 *
 * Keyboard focus inside a scene scrolls the focused step or panel into place.
 */

/** Inline script for <head>: marks the document as JS-capable, and as animated unless reduced motion is on. */
export const MOTION_HEAD_SCRIPT = `(function(d){d.classList.add('js');try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('motion')}catch(e){}})(document.documentElement)`;

/** Inline script for the end of <body>. */
export const MOTION_BODY_SCRIPT = `(function(){
var d=document.documentElement;
if(!d.classList.contains('motion')||!('IntersectionObserver' in window)){d.classList.remove('motion');return}
var near=new Set(),ticking=false,bars=[],lastPP='';
function clamp(x){return x<0?0:x>1?1:x}
function update(){
  ticking=false;
  var vh=window.innerHeight,max=d.scrollHeight-vh;
  var pp=max>0?clamp(window.scrollY/max).toFixed(4):'0';
  if(pp!==lastPP){lastPP=pp;for(var b=0;b<bars.length;b++)bars[b].style.setProperty('--page-p',pp)}
  near.forEach(function(el){
    var r=el.getBoundingClientRect();
    if(el.hasAttribute('data-scene')){
      var span=r.height-vh,p=span>0?clamp(-r.top/span):0;
      var ps=p.toFixed(4),tg=el.__v&&el.__v.length?el.__v:[el];
      for(var k=0;k<tg.length;k++)tg[k].style.setProperty('--p',ps);
      var n=+el.getAttribute('data-steps')||0;
      if(n){
        var s=Math.min(n-1,Math.floor(p*n));
        if(el.__s!==s){
          el.__s=s;el.setAttribute('data-step',s);
          el.querySelectorAll('[data-scene-step]').forEach(function(st){
            var i=+st.getAttribute('data-scene-step');
            st.toggleAttribute('data-active',i===s);st.toggleAttribute('data-past',i<s);
          });
          el.querySelectorAll('[data-scene-count]').forEach(function(c){c.textContent=String(s+1).padStart(2,'0')});
        }
      }
    }
    if(el.hasAttribute('data-view')){
      el.style.setProperty('--v',clamp((vh-r.top)/(vh+r.height)).toFixed(4));
    }
  });
}
function req(){if(!ticking){ticking=true;requestAnimationFrame(update)}}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)near.add(e.target);else near.delete(e.target)});req()},{rootMargin:'30% 0px 30% 0px'});
var once=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.setAttribute('data-in','');once.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
var fine=window.matchMedia&&matchMedia('(pointer: fine)').matches;
function magnet(el){
  var k=parseFloat(el.getAttribute('data-magnetic'))||0.3;
  el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.style.setProperty('--mx',((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px');el.style.setProperty('--my',((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px')});
  el.addEventListener('pointerleave',function(){el.style.setProperty('--mx','0px');el.style.setProperty('--my','0px')});
}
var MQ={md:'(min-width: 768px)',lg:'(min-width: 1024px)'};
function pin(){document.querySelectorAll('[data-scene]').forEach(function(el){var q=MQ[el.getAttribute('data-scene')];el.toggleAttribute('data-pinned',!q||matchMedia(q).matches)})}
function scan(){
  pin();
  bars=[].slice.call(document.querySelectorAll('.page-progress,.progress-page,[data-page-progress]'));lastPP='';
  document.querySelectorAll('[data-scene]').forEach(function(el){el.__v=[].filter.call(el.querySelectorAll('[data-scene-vars]'),function(n){return n.closest('[data-scene]')===el})});
  document.querySelectorAll('[data-scene],[data-view]').forEach(function(el){if(!el.__m){el.__m=1;io.observe(el)}});
  document.querySelectorAll('[data-inview]:not([data-in])').forEach(function(el){if(!el.__o){el.__o=1;once.observe(el)}});
  if(fine)document.querySelectorAll('[data-magnetic]').forEach(function(el){if(!el.__g){el.__g=1;magnet(el)}});
}
scan();
new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});
window.addEventListener('scroll',req,{passive:true});
window.addEventListener('resize',function(){pin();req()});
window.addEventListener('load',function(){req();if(window.scrollY>0)seenAbove()});
req();
function seenAbove(){document.querySelectorAll('[data-inview]:not([data-in]),[data-reveal=""]:not([data-in]),[data-reveal-image=""]:not([data-in])').forEach(function(el){if(el.getBoundingClientRect().bottom<0)el.setAttribute('data-in','')})}
window.addEventListener('popstate',function(){
  d.classList.add('restoring');
  setTimeout(seenAbove,80);
  setTimeout(function(){seenAbove();d.classList.remove('restoring')},1000);
});
document.addEventListener('focusin',function(e){
  var t=e.target;if(!t||!t.closest||!t.matches(':focus-visible'))return;
  var item=t.closest('[data-scene-step],[data-scene-panel]');if(!item)return;
  var sc=item.closest('[data-scene]');if(!sc)return;
  if(!sc.hasAttribute('data-pinned'))return;
  var r=sc.getBoundingClientRect(),span=r.height-window.innerHeight;if(span<=0)return;
  var target;
  if(item.hasAttribute('data-scene-step')){
    var n=+sc.getAttribute('data-steps')||1;target=(+item.getAttribute('data-scene-step')+0.5)/n;
  }else{
    var track=sc.querySelector('[data-scene-track]');if(!track)return;
    var shift=track.scrollWidth-window.innerWidth;if(shift<=0)return;
    target=clamp((item.offsetLeft-(window.innerWidth-item.offsetWidth)/2)/shift);
  }
  window.scrollTo({top:window.scrollY+r.top+target*span,behavior:'instant'});
});
})();`;

/**
 * Inline script for the end of <body>, always on (with or without motion):
 * links to a section of the current page scroll there every time they are
 * pressed, smoothly unless the visitor asked for reduced motion. The fixed
 * header is cleared by the page's scroll padding, the address keeps its hash,
 * and keyboard focus follows to the section.
 */
export const ANCHOR_BODY_SCRIPT = `(function(){
document.addEventListener('click',function(e){
  if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a||a.target==='_blank'||a.hasAttribute('download'))return;
  var u;try{u=new URL(a.href)}catch(x){return}
  if(u.origin!==location.origin||u.pathname!==location.pathname||u.search!==location.search||u.hash.length<2)return;
  var t;try{t=document.getElementById(decodeURIComponent(u.hash.slice(1)))}catch(x){return}
  if(!t)return;
  e.preventDefault();
  if(location.hash!==u.hash)history.pushState(history.state,'',u.hash);
  var calm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  t.scrollIntoView({behavior:calm?'auto':'smooth',block:'start'});
  if(!t.hasAttribute('tabindex'))t.setAttribute('tabindex','-1');
  t.focus({preventScroll:true});
},true);
})();`;
