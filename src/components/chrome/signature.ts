/*
 * The signature, written by hand. On the opening curtain the wordmark is not
 * wiped in: it is drawn the way a pen writes it. The entry flourish sweeps in,
 * then the d, the r and its full stop, the j, the o and the y, and the long
 * closing flourish, with the two dots dabbed in and the capitals rising under
 * the last stroke.
 *
 * How: the pen's path (signature-data.ts: the centreline of every stroke in
 * handwriting order, with the stroke's half-width and a time at each point) is
 * cut into about 260 short pieces. Each piece is a small box showing the
 * wordmark artwork (a background image held in chrome.css), clipped to the
 * stroke around that stretch of the path, and each fades in at its moment.
 * Opacity is all that animates, so the writing runs on the compositor: a busy
 * main thread (hydration on a slow phone) cannot make the line stutter. When
 * the last stroke lands the whole artwork is laid over the pieces, so the
 * finished signature is the wordmark exactly.
 *
 * The pieces time themselves from the curtain's own variables (chrome.css):
 * --intro-w0, when the writing begins, and --intro-wd, how long it takes.
 *
 * Without this script, or where clip-path is not supported, .intro-mark
 * simply fades in whole.
 */

import { SIGNATURE_DATA } from "./signature-data";

/**
 * Inline script placed right after the curtain's markup, before the curtain's
 * own script, so the pieces exist at the first paint and start with it. It
 * measures the signature's box once and builds the pieces in whole pixels
 * (so they meet without seams); a resize while it is still writing scales
 * them with the box.
 */
export const SIGNATURE_SCRIPT = `(function(){
var d=document.documentElement;if(!d.classList.contains('intro'))return;
var pen=document.querySelector('.intro-pen'),ink=pen&&pen.querySelector('.intro-ink');
if(!ink||!window.CSS||!CSS.supports('clip-path','polygon(0 0,1px 0,0 1px)'))return;
var S=${SIGNATURE_DATA},W=parseFloat(getComputedStyle(pen).width);if(!(W>0))return;
var k=W/S.w,h=[],n=3,g=1.1/k;
function add(q,f,c){
  var a=1e9,b=1e9,x=-1e9,y=-1e9,i,p,s='';
  for(i=0;i<q.length;i++){p=q[i];if(p[0]<a)a=p[0];if(p[0]>x)x=p[0];if(p[1]<b)b=p[1];if(p[1]>y)y=p[1]}
  a=Math.floor(a*k);b=Math.floor(b*k);x=Math.ceil(x*k);y=Math.ceil(y*k);
  for(i=0;i<q.length;i++)s+=(i?',':'')+(q[i][0]*k-a).toFixed(1)+'px '+(q[i][1]*k-b).toFixed(1)+'px';
  h.push('<i'+(c?' class="'+c+'"':'')+' style="left:'+a+'px;top:'+b+'px;width:'+(x-a)+'px;height:'+(y-b)+'px;background-position:'+(-a)+'px '+(-b)+'px;clip-path:polygon('+s+');--f:'+f+'"></i>');
}
function line(L){
  var x=L[0],y=L[1],t=L[2],s=L[3],P=[],N=[],i,j,e,q,o,m,u,v,z;
  function c(i){var v=s.charCodeAt(i);return v-35-(v>60)-(v>92)}
  for(i=0;i<s.length;i+=4){x+=c(i)-44;y+=c(i+1)-44;t+=c(i+3);P.push([x/2,y/2,c(i+2)/4+g,t/1e4])}
  m=P.length;if(m<2)return;
  for(i=0;i<m;i++){u=P[Math.max(0,i-1)];v=P[Math.min(m-1,i+1)];x=v[0]-u[0];y=v[1]-u[1];z=Math.sqrt(x*x+y*y)||1;N.push([-y/z,x/z])}
  for(i=0;i<m-1;i+=n){
    e=Math.min(m-1,i+n);q=[];o=i?0.9+1.6/k:0;
    for(j=i;j<=e;j++)q.push([P[j][0]+N[j][0]*P[j][2]-(j==i?N[j][1]*o:0),P[j][1]+N[j][1]*P[j][2]+(j==i?N[j][0]*o:0)]);
    for(j=e;j>=i;j--)q.push([P[j][0]-N[j][0]*P[j][2]-(j==i?N[j][1]*o:0),P[j][1]-N[j][1]*P[j][2]+(j==i?N[j][0]*o:0)]);
    add(q,P[i][3]);
  }
}
S.lines.forEach(line);
S.dots.forEach(function(o){var q=[],a;for(a=0;a<16;a++)q.push([o[0]+(o[2]+g)*Math.cos(a*Math.PI/8),o[1]+(o[2]+g)*Math.sin(a*Math.PI/8)]);add(q,o[3],'dot')});
S.caps.forEach(function(c){add([[c[0],c[1]],[c[0]+c[2],c[1]],[c[0]+c[2],c[1]+c[3]],[c[0],c[1]+c[3]]],c[4],'cap')});
h.push('<i class="all" style="left:0;top:0;width:'+Math.ceil(W)+'px;height:'+Math.ceil(S.h*k)+'px;background-position:0 0"></i>');
ink.style.cssText='width:'+W+'px;height:'+S.h*k+'px;--sw:'+W+'px;--sh:'+S.h*k+'px';
ink.innerHTML=h.join('');ink.setAttribute('data-inked','');
window.addEventListener('resize',function(){var w=parseFloat(getComputedStyle(pen).width);if(w>0)ink.style.transform='scale('+w/W+')'});
})();`;
