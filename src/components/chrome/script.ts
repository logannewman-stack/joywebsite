/*
 * The chrome's own small inline scripts. Like the scroll engine, they only
 * set classes, attributes and CSS variables; the styles that read them are
 * in src/app/styles/chrome.css.
 *
 *   <html class="intro intro-hold">   a full page load with motion on (first
 *                                     arrival or reload, not Back/Forward):
 *                                     the signature curtain is showing (see
 *                                     Curtain.tsx). Its clock is CSS: the
 *                                     writing, the beat and the lift are
 *                                     animations that start with the first
 *                                     paint. intro-hold keeps the page's
 *                                     on-load entrances on their first frame
 *                                     until the lift begins.
 *   <html class="intro-late">         the page took long to arrive: the
 *                                     same signing, shorter pauses.
 *   <html class="intro-lift">         from the moment the lift begins until
 *                                     the header has settled.
 *   html { --intro-wait }             while intro-hold is set: the time left
 *                                     until the lift, added to the delay of
 *                                     the entrances that start under it.
 *   <html data-tone="dark">           set before first paint when the page
 *                                     opens on black (the curtain, or a page
 *                                     listed in DARK_PATHS), for the page
 *                                     canvas and scrollbar (globals.css). The
 *                                     Header keeps it in step afterwards.
 *   html { --foot-h }                 the footer's height, for its sticky
 *                                     offset and the header's stand-in.
 *   .site-footer[data-near]           within three screens of the end of the
 *                                     page: the footer is held under the page
 *                                     (sticky). Before that it is an ordinary
 *                                     block below the fold.
 *   .site-footer { --foot-p }         0 to 1 while the page's last section
 *                                     scrolls away and uncovers the footer.
 *   .foot-sign[data-foot-in]          set once the footer's wordmark is in
 *                                     the open, so it can write itself in.
 *
 *   <html class="has-cursor">         a fine pointer with hover, motion on:
 *                                     the cursor label is available.
 *   .site-cursor[data-on]             the pointer is over a [data-cursor]
 *                                     element; the label follows it
 *                                     (html.cursor-live hides the native
 *                                     cursor on that element meanwhile).
 *
 * It also keeps a footer link from holding keyboard focus out of sight
 * (covered by the page, or below the screen while a tall footer is held in
 * place: the browser's own scroll-into-view cannot move a sticky element),
 * makes "Back to top" move focus with the view, and sets the browser
 * chrome colour (theme-color) for a page that opens on black.
 */

import { site } from "@/content/site";

/**
 * The curtain's one off-switch, for tooling and tests: with this key set to "1"
 * in sessionStorage the curtain is skipped. The site itself never writes it.
 */
const OFF = "dj-intro-off";

/**
 * Pages whose first section is black. Keep in step with opensDark() in
 * components/layout/Header.tsx: the server HTML already has the dark header
 * there, and the head script marks <html> to match before first paint.
 */
const DARK_PATHS = ["/directions/b", ...(site.homeHero !== "a" && site.homeHero !== "c" ? ["/"] : [])];

/**
 * Inline script for <head>, after the motion head script. It decides, before
 * first paint, whether this load gets the curtain: every full page load with
 * motion on, first arrival and reload alike, but not a Back/Forward load (the
 * visitor is returning to a page already seen) and not when the off-switch is
 * set. Client-side page changes never run it. It also marks <html> as dark
 * when the page opens on black (the curtain, or a page in DARK_PATHS), and
 * creates the theme-color meta tag (the phone browser's own chrome). The tag
 * is made here rather than in the page's metadata because scripts change it
 * (black under the curtain, then following the header), and React must not
 * manage a tag that changes underneath it. A page may still declare its own
 * themeColor (Home does): every theme-color tag on the page is kept in step.
 */
export const CHROME_HEAD_SCRIPT = `(function(d){var i=false,k=false,o=false,b=false;try{o=sessionStorage.getItem('${OFF}')==='1'}catch(e){}try{b=performance.getEntriesByType('navigation')[0].type==='back_forward'}catch(e){}if(d.classList.contains('motion')&&!o&&!b){d.classList.add('intro','intro-hold');i=true}try{k=${JSON.stringify(DARK_PATHS)}.indexOf(location.pathname.replace(/\\/+$/,'')||'/')>-1}catch(e){}if(i||k)d.setAttribute('data-tone','dark');var m=document.createElement('meta');m.name='theme-color';m.content=i||k?'#0b0b0b':'#ffffff';document.head.appendChild(m)})(document.documentElement)`;

/** A page that needed longer than this to arrive (ms since navigation) gets shorter pauses around the signing. */
const LATE = 2500;

/**
 * Inline script placed right after the curtain's markup, so it runs before
 * the first paint. The curtain keeps its own time in CSS (chrome.css): the
 * signature is written, a gold hairline draws under it, the curtain
 * lifts and the header settles, all as animations that start with the first
 * paint and move only transform and opacity, so they run on the compositor
 * and a busy main thread (hydration on a slow phone) cannot stretch them.
 * This script only
 *   - shortens the pauses around the signing when the page arrived late
 *     (intro-late),
 *   - lets the visitor skip, from the first frame: a click, tap, key, wheel
 *     or touch-move moves the running animations to the start of the lift and
 *     plays it at twice the speed (the entrances waiting under the curtain
 *     move up with it),
 *   - releases the page's held entrances when the lift begins,
 *   - clears up when the animations end: the curtain goes, and the browser
 *     chrome and page canvas take the header's tone.
 * A timer started with the first frame (9s: the opening ends near 6s) is the
 * safety net if an animation event never comes; nothing waits on it otherwise.
 */
export const CURTAIN_SCRIPT = `(function(){
var d=document.documentElement,L=d.classList;if(!L.contains('intro'))return;
var c=document.querySelector('.intro-curtain'),t=0,H=0,o={capture:true,passive:true};
var E=['animationstart','animationend','animationcancel'],K=['pointerdown','keydown','wheel','touchmove'];
function rise(){L.remove('intro-hold');L.add('intro-lift')}
function done(){
  if(!L.contains('intro'))return;
  rise();L.remove('intro');
  var h=document.querySelector('header[data-tone]'),k=h&&h.getAttribute('data-tone')==='dark';
  d.setAttribute('data-tone',k?'dark':'light');
  document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.setAttribute('content',k?'#0b0b0b':'#ffffff')});
}
function rest(){
  done();clearTimeout(t);L.remove('intro-lift','intro-late');d.style.removeProperty('--intro-wait');
  E.forEach(function(k){document.removeEventListener(k,on)});K.forEach(function(k){window.removeEventListener(k,skip,o)});
}
function on(e){
  var n=e.animationName,s=e.type==='animationstart';
  if(n==='intro-lift'){if(s)rise();else{done();if(H)rest()}}
  else if(n==='intro-header'&&!s){H=1;if(!L.contains('intro'))rest()}
}
function skip(){
  var all,a,i,n,left,m=document.getElementById('main');
  try{
    all=document.getAnimations();
    for(i=0;i<all.length;i++)if(all[i].animationName==='intro-lift')a=all[i];
    left=a.effect.getComputedTiming().delay-(a.currentTime||0);
    if(!(left>0))return;
    for(i=0;i<all.length;i++){
      a=all[i];n=a.animationName;
      if(n==='intro-lift'||n==='intro-drift'||n==='intro-fade'){a.currentTime=(a.currentTime||0)+left;a.playbackRate=2}
      else if(n==='intro-header'||(a.transitionProperty&&m&&a.effect&&m.contains(a.effect.target)))a.currentTime=(a.currentTime||0)+left;
    }
    rise();
  }catch(x){rest()}
}
if(!c){rest();return}
if(performance.now()>${LATE})L.add('intro-late');
E.forEach(function(k){document.addEventListener(k,on)});
K.forEach(function(k){window.addEventListener(k,skip,o)});
requestAnimationFrame(function(){t=setTimeout(rest,11000)});
})();`;

/** Inline script for the end of <body>: the footer finale's measurements, focus and "Back to top". */
export const CHROME_BODY_SCRIPT = `(function(){
var d=document.documentElement,w=window,foot=null,sign=null,H=0,max=0,vh=w.innerHeight;
var ro='ResizeObserver' in w?new ResizeObserver(function(){measure()}):null;
function find(){
  var f=document.querySelector('.site-footer');
  if(f===foot)return;
  if(ro&&foot)ro.unobserve(foot);
  foot=f;sign=f&&f.querySelector('.foot-sign');
  if(ro&&f)ro.observe(f);
}
function measure(){
  find();vh=w.innerHeight;
  if(foot){var h=foot.offsetHeight;if(h!==H){H=h;d.style.setProperty('--foot-h',h+'px')}}
  max=d.scrollHeight-vh;
  update();
}
function update(){
  if(!foot||!foot.isConnected){find();if(!foot)return}
  if(!d.classList.contains('motion'))return;
  var dist=max-w.scrollY,p=0,near=dist<H+3*vh;
  if(foot.__n!==near){foot.__n=near;foot.toggleAttribute('data-near',near)}
  if(dist<H+vh){
    var main=document.getElementById('main'),mb=main?main.getBoundingClientRect().bottom:vh;
    p=(vh-mb)/(Math.min(H,vh)||1);p=p<0?0:p>1?1:p;
    if(sign&&!sign.hasAttribute('data-foot-in')){
      var mark=sign.querySelector('.foot-mark'),r=mark&&mark.getBoundingClientRect();
      if(!r||(r.top+r.height*0.5<vh&&mb<r.top+r.height*0.35)||dist<2)sign.setAttribute('data-foot-in','');
    }
  }
  if(foot.__p!==p){foot.__p=p;foot.style.setProperty('--foot-p',p.toFixed(3))}
}
measure();
if(ro)ro.observe(document.body);
if(d.classList.contains('intro-hold'))try{document.querySelector('.intro-curtain').getAnimations().forEach(function(a){if(a.animationName==='intro-lift')d.style.setProperty('--intro-wait',(Math.max(0,a.effect.getComputedTiming().delay-(a.currentTime||0))/1000).toFixed(2)+'s')})}catch(e){}
var hd=document.querySelector('header[data-tone]');
if(hd&&!d.classList.contains('intro'))document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.setAttribute('content',hd.getAttribute('data-tone')==='dark'?'#0b0b0b':'#ffffff')});
w.addEventListener('scroll',update,{passive:true});
w.addEventListener('resize',measure);
w.addEventListener('load',measure);
document.addEventListener('focusin',function(e){
  var t=e.target;
  if(!foot||!t||!t.matches||!foot.contains(t)||!d.classList.contains('motion'))return;
  try{if(!t.matches(':focus-visible'))return}catch(_){}
  if(!foot.__n){foot.__n=true;foot.setAttribute('data-near','')}
  var main=document.getElementById('main');if(!main)return;
  var mb=main.getBoundingClientRect().bottom,r=t.getBoundingClientRect();
  var over=mb-r.top+24,low=r.bottom+24-w.innerHeight;
  if(low>0)over=Math.max(over,mb-foot.getBoundingClientRect().top+low);
  if(over>0)w.scrollBy({top:over,behavior:'instant'});
});
var cur=document.querySelector('.site-cursor');
if(cur&&d.classList.contains('motion')&&w.matchMedia&&matchMedia('(hover: hover) and (pointer: fine)').matches){
  d.classList.add('has-cursor');
  var lab=cur.querySelector('.cursor-label'),tgt=null,cx=0,cy=0,tick=false;
  function mv(e){
    if(!tgt||!tgt.isConnected){off();return}
    cx=e.clientX;cy=e.clientY;cur.style.transform='translate3d('+cx+'px,'+cy+'px,0)';
  }
  function off(){
    if(!tgt)return;tgt=null;
    cur.removeAttribute('data-on');cur.removeAttribute('data-down');d.classList.remove('cursor-live');
    document.removeEventListener('pointermove',mv);
  }
  document.addEventListener('pointerover',function(e){
    if(e.pointerType&&e.pointerType!=='mouse'){off();return}
    var t=e.target&&e.target.closest?e.target.closest('[data-cursor]'):null;
    if(t===tgt)return;
    if(!t){off();return}
    if(!tgt)document.addEventListener('pointermove',mv,{passive:true});
    tgt=t;if(lab)lab.textContent=t.getAttribute('data-cursor')||'';
    mv(e);cur.setAttribute('data-on','');d.classList.add('cursor-live');
  },{passive:true});
  d.addEventListener('pointerleave',off);
  w.addEventListener('blur',off);
  w.addEventListener('scroll',function(){
    if(!tgt||tick)return;tick=true;
    requestAnimationFrame(function(){
      tick=false;if(!tgt)return;
      var el=document.elementFromPoint(cx,cy);
      if(!el||!el.closest||el.closest('[data-cursor]')!==tgt)off();
    });
  },{passive:true});
  document.addEventListener('pointerdown',function(){if(tgt)cur.setAttribute('data-down','')},{passive:true});
  document.addEventListener('pointerup',function(){cur.removeAttribute('data-down')},{passive:true});
}
document.addEventListener('click',function(e){
  var a=e.target&&e.target.closest&&e.target.closest('[data-to-top]');
  if(!a||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  e.preventDefault();
  w.scrollTo({top:0});
  var main=document.getElementById('main');if(main)main.focus({preventScroll:true});
});
})();`;
