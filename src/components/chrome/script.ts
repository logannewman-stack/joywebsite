/*
 * The chrome's own small inline scripts. Like the scroll engine, they only
 * set classes, attributes and CSS variables; the styles that read them are
 * in src/app/styles/chrome.css.
 *
 *   <html class="intro intro-hold">   first page of a visit, motion on: the
 *                                     first-visit curtain is showing (see
 *                                     Curtain.tsx). intro-hold keeps the
 *                                     page's on-load entrances on their first
 *                                     frame until the curtain lifts.
 *   html { --foot-h }                 the footer's height, for its sticky
 *                                     offset and the header's stand-in.
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
 * It also keeps a covered footer link from holding keyboard focus out of
 * sight, makes "Back to top" move focus with the view, and sets the browser
 * chrome colour (theme-color) for a page that opens on black.
 */

/** Key in sessionStorage: the curtain has been shown in this visit. */
const SEEN = "dj-intro";

/**
 * Inline script for <head>, after the motion head script. It decides, before
 * first paint, whether this load gets the curtain, and it creates the
 * theme-color meta tag (the phone browser's own chrome). The tag is made here
 * rather than in the page's metadata because scripts change it (black under
 * the curtain, then following the header), and React must not manage a tag
 * that changes underneath it. A page may still declare its own themeColor
 * (Home does): every theme-color tag on the page is kept in step.
 */
export const CHROME_HEAD_SCRIPT = `(function(d){var i=false;try{if(d.classList.contains('motion')&&!sessionStorage.getItem('${SEEN}')){sessionStorage.setItem('${SEEN}','1');d.classList.add('intro','intro-hold');i=true}}catch(e){}var m=document.createElement('meta');m.name='theme-color';m.content=i?'#0b0b0b':'#ffffff';document.head.appendChild(m)})(document.documentElement)`;

/**
 * Inline script placed right after the curtain's markup. The wordmark writes
 * itself in (0.68s), then the curtain lifts (0.52s): about 1.3s in all. If
 * the wordmark file has not arrived after 0.3s it goes ahead without waiting.
 * While it shows, the browser chrome is black; afterwards it follows the header.
 */
export const CURTAIN_SCRIPT = `(function(){
var d=document.documentElement;if(!d.classList.contains('intro'))return;
var c=document.querySelector('.intro-curtain'),img=c&&c.querySelector('img'),go=false;
function theme(v){document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.setAttribute('content',v)})}
function done(){
  d.classList.remove('intro','intro-hold','intro-write','intro-lift');
  var h=document.querySelector('header[data-tone]');
  theme(h&&h.getAttribute('data-tone')==='dark'?'#0b0b0b':'#ffffff');
}
function lift(){d.classList.remove('intro-hold');d.classList.add('intro-lift');setTimeout(done,540)}
function write(){if(go)return;go=true;d.classList.add('intro-write');setTimeout(lift,760)}
if(!c){done();return}
if(img&&!img.complete){img.addEventListener('load',write,{once:true});img.addEventListener('error',write,{once:true});setTimeout(write,300)}else write();
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
  var dist=max-w.scrollY,p=0;
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
var hd=document.querySelector('header[data-tone]');
if(hd&&!d.classList.contains('intro'))document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.setAttribute('content',hd.getAttribute('data-tone')==='dark'?'#0b0b0b':'#ffffff')});
w.addEventListener('scroll',update,{passive:true});
w.addEventListener('resize',measure);
w.addEventListener('load',measure);
document.addEventListener('focusin',function(e){
  var t=e.target;
  if(!foot||!t||!t.matches||!foot.contains(t)||!d.classList.contains('motion'))return;
  try{if(!t.matches(':focus-visible'))return}catch(_){}
  var main=document.getElementById('main');if(!main)return;
  var over=main.getBoundingClientRect().bottom-t.getBoundingClientRect().top+24;
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
