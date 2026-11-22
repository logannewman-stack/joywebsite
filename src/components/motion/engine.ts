/*
 * The scroll engine: small inline scripts that turn scroll position into CSS
 * variables. Components never animate in JavaScript; they read these
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
 * Pinning happens twice. The head script pins each scene the moment the parser
 * reaches it, so the page already has its full length when the browser
 * restores a scroll position (pinning later made a reload mid-scene land a
 * scene further down). The body script then keeps it right on resize and for
 * content added later. Both use PIN_RULE below.
 *
 * Fit. A pinned stage is one screen, so its words must fit one screen. When
 * they cannot (the visitor's own text spacing or font size, a very small
 * window), the engine un-pins that scene and it is its plain layout, with --p
 * held at 1 so nothing waits on the scroll. Measured from layout boxes, never
 * from transforms: every paragraph, heading and list item of the stage must
 * lie inside it, top to bottom and left to right. Checked once fonts have
 * loaded, when any of those blocks changes size, and on resize; a scene that
 * did not fit is tried again when the window's width changes. Scenes with a
 * sideways track are left alone.
 *
 * Print. Paper gets the plain layout: for the print, html.motion and every
 * data-pinned are taken away, and put back afterwards with the scroll position
 * (beforeprint / afterprint, or the print media query where only that fires).
 * Nothing is written in between, so every scene comes back on the step it was
 * on. html.printing is set from just before the print until a few seconds
 * after (motion.css: the screen behind the dialog keeps its length, and
 * entrances that play on load do not play again).
 *
 * Keyboard focus is handled by the always-on script at the foot of this file.
 */

/**
 * Which scenes pin: data-scene "md" from 768px wide, "lg" from 1024px, anything
 * else at every width. One piece of source for the head script and for pin()
 * in the body script, so the two can never disagree.
 */
const PIN_RULE = `var MQ={md:'(min-width: 768px)',lg:'(min-width: 1024px)'};function wants(el){var q=MQ[el.getAttribute('data-scene')];return !q||matchMedia(q).matches}`;

/**
 * Inline script for <head>: marks the document as JS-capable, and as animated
 * unless reduced motion is on (or the browser lacks what the engine needs).
 * When animated, it also pins each scene as it is parsed, before first layout:
 * it runs before <body> exists, so it watches the document until the body
 * script takes over (or the document has loaded).
 */
export const MOTION_HEAD_SCRIPT = `(function(d){d.classList.add('js');try{if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;d.classList.add('motion')}catch(e){return}
if(!window.MutationObserver)return;
${PIN_RULE}
var mo=d.__pin=new MutationObserver(function(){var s=document.querySelectorAll('[data-scene]:not([data-pinned])');for(var i=0;i<s.length;i++)if(wants(s[i]))s[i].setAttribute('data-pinned','')});
mo.observe(d,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',function(){mo.disconnect()});
})(document.documentElement)`;

/** Inline script for the end of <body>. */
export const MOTION_BODY_SCRIPT = `(function(){
var d=document.documentElement;
if(d.__pin)d.__pin.disconnect();
if(!d.classList.contains('motion')||!('IntersectionObserver' in window)){d.classList.remove('motion');return}
var near=new Set(),ticking=false,bars=[],lastPP='',W=0,onPaper=false,fonts=!document.fonts,fitting=false,py=0,pt=0;
function clamp(x){return x<0?0:x>1?1:x}
function update(){
  ticking=false;
  if(onPaper)return;
  var vh=window.innerHeight,max=d.scrollHeight-vh;
  var pp=max>0?clamp(window.scrollY/max).toFixed(4):'0';
  if(pp!==lastPP){lastPP=pp;for(var b=0;b<bars.length;b++)bars[b].style.setProperty('--page-p',pp)}
  near.forEach(function(el){
    var r=el.getBoundingClientRect();
    if(el.hasAttribute('data-scene')){
      var span=r.height-vh,p=el.__u?1:span>0?clamp(-r.top/span):0;
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
${PIN_RULE}
function pin(){
  if(onPaper)return;
  var w=window.innerWidth,again=w!==W;W=w;
  document.querySelectorAll('[data-scene]').forEach(function(el){if(again)el.__u=0;el.toggleAttribute('data-pinned',!el.__u&&wants(el))});
}
function fit(){
  fitting=false;
  if(onPaper||!fonts)return;
  document.querySelectorAll('[data-scene][data-pinned]').forEach(function(el){
    var st=el.__b&&el.querySelector('[data-scene-pin]');
    if(!st||getComputedStyle(st).position!=='sticky')return;
    var H=st.clientHeight,Wd=st.clientWidth;
    for(var i=0;i<el.__b.length;i++){
      var b=el.__b[i],x=0,y=0,n=b;
      while(n&&n!==st){x+=n.offsetLeft;y+=n.offsetTop;n=n.offsetParent}
      if(n&&(y<-1||y+b.offsetHeight>H+1||x+b.scrollWidth>Wd+1)){el.__u=1;el.removeAttribute('data-pinned');req();return}
    }
  });
}
function fitSoon(){if(!fitting){fitting=true;requestAnimationFrame(fit)}}
var ro=window.ResizeObserver?new ResizeObserver(fitSoon):null;
function scan(){
  pin();
  bars=[].slice.call(document.querySelectorAll('.page-progress,.progress-page,[data-page-progress]'));lastPP='';
  document.querySelectorAll('[data-scene]').forEach(function(el){
    el.__v=[].filter.call(el.querySelectorAll('[data-scene-vars]'),function(n){return n.closest('[data-scene]')===el});
    var st=el.querySelector('[data-scene-pin]');
    el.__b=st&&st.parentNode===el&&!el.querySelector('[data-scene-track]')?[].slice.call(st.querySelectorAll('p,h1,h2,h3,h4,h5,h6,li')):null;
    if(el.__b&&ro)el.__b.forEach(function(b){if(!b.__f){b.__f=1;ro.observe(b)}});
  });
  document.querySelectorAll('[data-scene],[data-view]').forEach(function(el){if(!el.__m){el.__m=1;io.observe(el)}});
  document.querySelectorAll('[data-inview]:not([data-in])').forEach(function(el){if(!el.__o){el.__o=1;once.observe(el)}});
  if(fine)document.querySelectorAll('[data-magnetic]').forEach(function(el){if(!el.__g){el.__g=1;magnet(el)}});
}
scan();
new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});
if(!fonts)document.fonts.ready.then(function(){fonts=true;fit()});
window.addEventListener('scroll',req,{passive:true});
window.addEventListener('resize',function(){pin();fit();req()});
window.addEventListener('load',function(){req();if(window.scrollY>0)seenAbove()});
req();
function seenAbove(){document.querySelectorAll('[data-inview]:not([data-in]),[data-reveal=""]:not([data-in]),[data-reveal-image=""]:not([data-in])').forEach(function(el){if(el.getBoundingClientRect().bottom<0)el.setAttribute('data-in','')})}
window.addEventListener('popstate',function(){
  d.classList.add('restoring');
  setTimeout(seenAbove,80);
  setTimeout(function(){seenAbove();d.classList.remove('restoring')},1000);
});
function toPaper(on){
  if(on===onPaper)return;onPaper=on;clearTimeout(pt);
  if(on){
    py=window.scrollY;
    d.style.setProperty('--print-hold',d.scrollHeight+'px');
    d.classList.add('printing');d.classList.remove('motion');
    document.querySelectorAll('[data-pinned]').forEach(function(el){el.removeAttribute('data-pinned')});
  }else{
    d.classList.add('motion','restoring');
    pin();fit();
    window.scrollTo({top:py,behavior:'instant'});req();
    setTimeout(function(){d.classList.remove('restoring')},1000);
    pt=setTimeout(function(){d.classList.remove('printing');d.style.removeProperty('--print-hold')},4000);
  }
}
window.addEventListener('beforeprint',function(){toPaper(true)});
window.addEventListener('afterprint',function(){toPaper(false)});
var mp=matchMedia('print'),onmp=function(e){toPaper(e.matches)};
if(mp.addEventListener)mp.addEventListener('change',onmp);else if(mp.addListener)mp.addListener(onmp);
})();`;

/**
 * Inline script for the end of <body>, always on (with or without motion).
 *
 * Links to a section of the current page scroll there every time they are
 * pressed, smoothly unless the visitor asked for reduced motion. The fixed
 * header is cleared by the page's scroll padding, the address keeps its hash,
 * and keyboard focus follows to the section.
 *
 * Keyboard focus is always brought into the open:
 *   - on a stage that is held under the next section (.hero-stage while it is
 *     sticky: Home's opening), the page goes back to where that stage shows;
 *   - inside a pinned scene, the page scrolls to the focused step or panel,
 *     unless that step is the current one and whole on screen, or that panel
 *     is whole on screen (focus coming back from a closed dialog moves
 *     nothing). Which step is current and where a panel stands are worked out
 *     from the scroll position: the scene's attributes and the track's
 *     transform are a frame behind when focus has just scrolled the page;
 *   - where the focus ring is drawn on a card around the focused link, the
 *     whole card is brought below the header and inside the screen, not just
 *     the link.
 */
export const ANCHOR_BODY_SCRIPT = `(function(){
var d=document.documentElement;
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
document.addEventListener('focusin',function(e){
  var t=e.target;if(!t||!t.closest||!t.matches(':focus-visible'))return;
  var vw=window.innerWidth,vh=window.innerHeight,r;
  var held=t.closest('.hero-stage');
  if(held&&getComputedStyle(held).position==='sticky'){
    r=held.parentNode.getBoundingClientRect();
    if(r.top<-1)window.scrollTo({top:window.scrollY+r.top,behavior:'instant'});
    return;
  }
  var item=t.closest('[data-scene-step],[data-scene-panel]'),sc=item&&item.closest('[data-scene]');
  if(sc&&sc.hasAttribute('data-pinned')){
    r=sc.getBoundingClientRect();
    var span=r.height-vh,b=item.getBoundingClientRect(),seen=b.top>=-1&&b.bottom<=vh+1,target=-1;
    if(span>0){
      var p=Math.max(0,Math.min(1,-r.top/span));
      if(item.hasAttribute('data-scene-step')){
        var n=+sc.getAttribute('data-steps')||1,i=+item.getAttribute('data-scene-step');
        if(seen&&Math.min(n-1,Math.floor(p*n))===i)return;
        target=(i+0.5)/n;
      }else{
        var track=sc.querySelector('[data-scene-track]'),shift=track?track.scrollWidth-vw:0,x=item.offsetLeft-p*shift;
        if(shift>0){
          if(seen&&x>=0&&x+item.offsetWidth<=vw)return;
          target=Math.max(0,Math.min(1,(item.offsetLeft-(vw-item.offsetWidth)/2)/shift));
        }
      }
    }
    if(target>=0){window.scrollTo({top:window.scrollY+r.top+target*span,behavior:'instant'});return}
  }
  var f=t;
  while(f&&f!==d&&getComputedStyle(f).outlineStyle==='none')f=f.parentElement;
  if(!f||f===d||f===t)return;
  r=f.getBoundingClientRect();
  var pad=parseFloat(getComputedStyle(d).scrollPaddingTop)||0,foot=vh-16;
  if(r.height>foot-pad)return;
  var dy=r.top<pad?r.top-pad:r.bottom>foot?r.bottom-foot:0;
  if(dy)window.scrollBy({top:dy,behavior:'instant'});
});
})();`;
