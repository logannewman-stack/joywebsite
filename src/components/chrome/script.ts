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
 * It also keeps a covered footer link from holding keyboard focus out of
 * sight, and makes "Back to top" move focus with the view.
 */

/** Key in sessionStorage: the curtain has been shown in this visit. */
const SEEN = "dj-intro";

/** Inline script for <head>, after the motion head script: decides, before first paint, whether this load gets the curtain. */
export const CHROME_HEAD_SCRIPT = `(function(d){try{if(d.classList.contains('motion')&&!sessionStorage.getItem('${SEEN}')){sessionStorage.setItem('${SEEN}','1');d.classList.add('intro','intro-hold')}}catch(e){}})(document.documentElement)`;

/**
 * Inline script placed right after the curtain's markup. The wordmark writes
 * itself in (0.68s), then the curtain lifts (0.52s): about 1.3s in all. If
 * the wordmark file has not arrived after 0.3s it goes ahead without waiting.
 * While it shows, the browser chrome is black; afterwards it follows the header.
 */
export const CURTAIN_SCRIPT = `(function(){
var d=document.documentElement;if(!d.classList.contains('intro'))return;
var c=document.querySelector('.intro-curtain'),img=c&&c.querySelector('img'),meta=document.querySelector('meta[name="theme-color"]'),go=false;
function done(){
  d.classList.remove('intro','intro-hold','intro-write','intro-lift');
  var h=document.querySelector('header[data-tone]');
  if(meta)meta.setAttribute('content',h&&h.getAttribute('data-tone')==='dark'?'#0b0b0b':'#ffffff');
}
function lift(){d.classList.remove('intro-hold');d.classList.add('intro-lift');setTimeout(done,540)}
function write(){if(go)return;go=true;d.classList.add('intro-write');setTimeout(lift,760)}
if(!c){done();return}
if(meta)meta.setAttribute('content','#0b0b0b');
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
document.addEventListener('click',function(e){
  var a=e.target&&e.target.closest&&e.target.closest('[data-to-top]');
  if(!a||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  e.preventDefault();
  w.scrollTo({top:0});
  var main=document.getElementById('main');if(main)main.focus({preventScroll:true});
});
})();`;
