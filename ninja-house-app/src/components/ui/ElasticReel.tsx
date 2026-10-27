// @ts-nocheck
import React from 'react';
import * as THREE from 'three';

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

const PI2 = 2 * Math.PI;

const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));
const smoothstep = (min: number, max: number, val: number) => {
  const n = clamp((val - min) / (max - min), 0, 1);
  return n * n * (3 - 2 * n);
};
const subscribeReducedMotion = (cb: () => void) => {
  const media = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  if (!media) return () => {};
  media.addEventListener('change', cb);
  return () => media.removeEventListener('change', cb);
};
const getReducedMotionSnapshot = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const hexToRgb01 = (hex: string) => {
  const t = hex.trim().replace('#', '');
  if (!/^[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(t)) return null;
  const full = t.length === 3 ? t.replace(/./g, (c) => c + c) : t;
  return [0, 2, 4].map((i) => Number.parseInt(full.slice(i, i + 2), 16) / 255);
};

const springStep = (pos: number, vel: number, target: number, dt: number, period: number, damping: number) => {
  const omega = PI2 / Math.max(period, 0.02);
  const steps = Math.max(1, Math.ceil(dt / (1 / 240)));
  const subDt = dt / steps;
  let v = vel;
  let p = pos;
  for (let i = 0; i < steps; i++) {
    v += (omega * omega * (target - p) - 2 * damping * omega * v) * subDt;
    p += v * subDt;
  }
  return [p, v];
};

const cosCurve = (val: number) => 0.5 + 0.5 * Math.cos(Math.PI * clamp(Math.abs(val), 0, 1));

const srOnlyStyle: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

const canvasWrapStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  touchAction: 'pan-y',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  WebkitTouchCallout: 'none',
};

const captionBoxStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
  textAlign: 'center',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  opacity: 0,
  willChange: 'transform, opacity',
};

const titleStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  lineHeight: 1.25,
  letterSpacing: '-0.012em',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 13,
  lineHeight: 1.4,
  opacity: 0.55,
};

const labelStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  fontSize: 13,
  fontWeight: 500,
  lineHeight: 1.3,
  letterSpacing: '-0.005em',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  opacity: 0,
  willChange: 'transform, opacity',
};

export interface ElasticReelItem {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  focus?: number;
}

export interface ElasticReelProps {
  items?: ElasticReelItem[];
  defaultOpen?: number;
  barWidth?: number;
  barHeight?: number;
  gap?: number;
  radius?: number;
  magnify?: number;
  lift?: number;
  influence?: number;
  align?: 'center' | 'bottom';
  openSize?: number;
  openAspect?: number;
  elasticity?: number;
  blur?: number;
  dim?: number;
  shadow?: number;
  rim?: number;
  autoplay?: 'sweep' | 'cycle' | 'off';
  speed?: number;
  interval?: number;
  pauseOnHover?: boolean;
  draggable?: boolean;
  wheel?: boolean;
  captions?: boolean;
  labels?: boolean;
  backgroundColor?: string;
  paused?: boolean;
  dpr?: number;
  ariaLabel?: string;
  onOpen?: (item: ElasticReelItem, index: number) => void;
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface ElasticReelHandle {
  open: (index: number) => void;
  close: () => void;
  next: () => void;
  previous: () => void;
}

// Map helper names inside component
const c = PI2;
const h = clamp;
const m = smoothstep;
const f = subscribeReducedMotion;
const b = getReducedMotionSnapshot;
const v = hexToRgb01;
const g = springStep;
const y = cosCurve;
const x = srOnlyStyle;
const w = canvasWrapStyle;
const M = captionBoxStyle;
const S = titleStyle;
const C = subtitleStyle;
const j = labelStyle;
const d = [];
const u = {
  gPd: THREE.Texture,
  jf0: THREE.SRGBColorSpace,
  $_I: THREE.LinearMipmapLinearFilter,
  k6q: THREE.LinearFilter,
  ...THREE,
};

let A=`
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,k=`
precision highp float;

uniform sampler2D uImage;
uniform float uImageAspect;
uniform vec2 uSize;
uniform float uMargin;
uniform float uRadius;
uniform float uFocus;
uniform float uBlur;
uniform float uAlpha;
uniform float uLoaded;
uniform float uShadow;
uniform float uRim;
uniform vec3 uRimColor;
uniform vec3 uPlaceholder;
varying vec2 vUv;

float roundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

vec3 sampleImage(vec2 uv, float level, vec2 spread) {
  if (level < 0.05) return texture2D(uImage, uv).rgb;
  vec3 total = texture2D(uImage, uv, level).rgb * 0.36;
  total += texture2D(uImage, uv + vec2(spread.x, spread.y * 0.4), level).rgb * 0.16;
  total += texture2D(uImage, uv - vec2(spread.x, spread.y * 0.4), level).rgb * 0.16;
  total += texture2D(uImage, uv + vec2(-spread.x * 0.4, spread.y), level).rgb * 0.16;
  total += texture2D(uImage, uv - vec2(-spread.x * 0.4, spread.y), level).rgb * 0.16;
  return total;
}

void main() {
  vec2 full = uSize + 2.0 * uMargin;
  vec2 p = (vUv - 0.5) * full;
  float radius = min(uRadius, 0.5 * min(uSize.x, uSize.y));
  float d = roundBox(p, 0.5 * uSize, radius);
  float px = max(fwidth(d), 1e-4);
  float card = 1.0 - smoothstep(-0.7 * px, 0.7 * px, d);

  float shadowBlur = max(uSize.y * 0.07, 6.0);
  float sd = roundBox(p - vec2(0.0, -uSize.y * 0.035), 0.5 * uSize * vec2(0.96, 0.97), radius);
  float shade = (1.0 - smoothstep(-shadowBlur * 0.5, shadowBlur, sd)) * uShadow * 0.42;

  float scale = max(uSize.y, uSize.x / uImageAspect);
  vec2 extent = 0.5 * uSize / (scale * vec2(uImageAspect, 1.0));
  float cx = clamp(uFocus, extent.x, 1.0 - extent.x);
  vec2 uv = vec2(cx, 0.5) + vec2(p.x / (scale * uImageAspect), p.y / scale);
  vec2 spread = vec2(1.0 / uImageAspect, 1.0) * (uBlur * 2.4 / scale);
  vec3 image = sampleImage(uv, uBlur, spread);

  float loaded = clamp(uLoaded, 0.0, 1.0);
  vec3 color = mix(uPlaceholder, image, loaded);
  float rimMask = card * (1.0 - smoothstep(0.0, 1.5 * px, -d));
  color = mix(color, uRimColor, rimMask * uRim);

  float alpha = card * uAlpha * mix(0.18, 1.0, loaded);
  float shadowAlpha = (1.0 - card) * shade * uAlpha;
  float total = alpha + shadowAlpha * (1.0 - alpha);
  if (total < 0.002) discard;
  gl_FragColor = vec4(color * alpha, total);
}
`,I=React.forwardRef(function({items:e=d,defaultOpen:t=-1,barWidth:a=44,barHeight:i=.5,gap:r=10,radius:o=12,magnify:c=2.4,lift:I=1.15,influence:H=200,align:E="center",openSize:R=.72,openAspect:F=1,elasticity:L=.35,blur:z=.5,dim:W=.45,shadow:P=.35,rim:B=.12,autoplay:N="sweep",speed:D=1.4,interval:q=4,pauseOnHover:O=!0,draggable:T=!0,wheel:U=!0,captions:$=!0,labels:X=!0,backgroundColor:_="transparent",paused:Y=!1,dpr:G=2,ariaLabel:Q="Elastic reel. Hover, scroll or use the arrow keys to browse, and click a photo to open it.",onOpen:V,onClose:J,className:K,style:Z},ee){let et,ea=React.useRef(null),en=React.useRef(null),el=React.useRef(null),ei=React.useRef(null),er=React.useRef(null),eo=React.useRef(null),es=React.useRef(null),eu=React.useSyncExternalStore(f,b,()=>!1),ep=e.length?e:d,ec=React.useRef(ep),[ed]=React.useState(()=>Math.round(t)),[eh,em]=React.useState(-1),[ef,eb]=React.useState(!1),ev={barWidth:a,barHeight:i,gap:r,radius:o,magnify:c,lift:I,influence:H,align:E,openSize:R,openAspect:F,elasticity:L,blur:z,dim:W,shadow:P,rim:B,autoplay:N,speed:D,interval:q,pauseOnHover:O,draggable:T,wheel:U,captions:$,labels:X,backgroundColor:_,paused:Y,dpr:G,reduced:eu},eg=React.useRef(ev),ey=React.useRef({onOpen:V,onClose:J});React.useEffect(()=>{eg.current=ev,ec.current=ep,ey.current={onOpen:V,onClose:J},es.current?.sync()}),React.useEffect(()=>{let e=ea.current,t=en.current,a=el.current,n=ei.current,l=er.current,i=eo.current;if(!e||!t||!a||!n||!l||!i)return;let r=((e,t,a,n,l,i,r)=>{let o,p=e.ownerDocument,c=p.defaultView??window,d=p.createElement("canvas");d.style.cssText="position:absolute;inset:0;width:100%;height:100%;display:block";try{o=new THREE.WebGLRenderer({canvas:d,alpha:!0,antialias:!1,premultipliedAlpha:!0,powerPreference:"high-performance"})}catch{return null}t.appendChild(d),o.setClearColor(0,0);let f=new THREE.Scene,b=new THREE.OrthographicCamera(-1,1,1,-1,-10,10),x=new THREE.PlaneGeometry(1,1),w=new THREE.DataTexture(new Uint8Array([128,128,128,255]),1,1);w.needsUpdate=!0;let M=new THREE.Color(657930),S=new THREE.Color(1,1,1),C=new THREE.Color(.12,.12,.12),j=Array.from({length:40},()=>{let e=new THREE.ShaderMaterial({uniforms:{uImage:{value:w},uImageAspect:{value:1.5},uSize:{value:new THREE.Vector2(40,200)},uMargin:{value:16},uRadius:{value:12},uFocus:{value:.5},uBlur:{value:0},uAlpha:{value:0},uLoaded:{value:0},uShadow:{value:.35},uRim:{value:.12},uRimColor:{value:S},uPlaceholder:{value:C}},vertexShader:A,fragmentShader:k,transparent:!0,premultipliedAlpha:!0,depthTest:!1,depthWrite:!1}),t=new THREE.Mesh(x,e);return t.frustumCulled=!1,t.visible=!1,f.add(t),{mesh:t,m:0,mv:0,o:0,ov:0,a:0,av:0,q:0,qv:0,x:0,y:0,w:0,h:0}}),I=[],H="",E=0,R=0,F=1,L=!1,z=-1,W=-1,P=0,B=0,N=0,D=0,q=!1,O=0,T=0,U=0,$=0,X=0,_=!1,Y=0,G=0,Q=0,V=0,J=0,K=0,Z=!1,ee=0,et=0,ea=0,en=0,el=0,ei=!1,er=!1,eo=!1,es=-10,eu=-1,ep=-1,ec=NaN,ed=NaN,eh=-1,em=-1,ef=NaN,eb=NaN,ev=null,eg={restW:40,restH:200,pitch:50,gap:10,avail:800,usable:400,labelSpace:0,captionSpace:0,yC:0,open:0},ey=()=>Math.min(l.current.length,40),ex=e=>(e-(ey()-1)/2)*eg.pitch,ew=()=>{let e=l.current.slice(0,40),t=e.map(e=>e.src).join("\0");if(t===H)return;H=t,I.forEach(e=>{e.image.onload=null,e.texture.dispose()});let a=Math.max(e.length,1);I=e.map((e,t)=>{let n=new Image;n.crossOrigin="anonymous",n.decoding="async",n.fetchPriority=3>Math.abs(t-(a-1)/2)?"high":"low";let l=new THREE.Texture(n);l.colorSpace=THREE.SRGBColorSpace,l.minFilter=THREE.LinearMipmapLinearFilter,l.magFilter=THREE.LinearFilter,l.generateMipmaps=!0;let i={image:n,texture:l,aspect:1.5,ready:!1,uploaded:!1,fade:0};return n.onload=()=>{if(er)return;let e=()=>{er||i.ready||(i.aspect=n.naturalWidth/Math.max(n.naturalHeight,1),i.ready=!0,l.needsUpdate=!0,ej())};n.decode().then(e,e)},n.src=e.src,i}),z>=e.length&&(z=-1),eu=-1,eh=-1},eM=()=>{let t=n.current,a=Math.round(e.clientWidth),l=Math.round(e.clientHeight);if(a<2||l<2)return L=!1,!1;let i=Math.min(c.devicePixelRatio||1,Math.max(t.dpr,.5));return(!L||a!==E||l!==R||i!==F)&&(L=!0,E=a,R=l,F=i,o.setPixelRatio(F),o.setSize(E,R,!1),b.left=-E/2,b.right=E/2,b.top=R/2,b.bottom=-R/2,b.updateProjectionMatrix(),!0)},eS=()=>{let t=n.current.backgroundColor;if(v(t))M.setStyle(t,THREE.SRGBColorSpace);else{let t=e,a=!1;for(;t&&!a;){let e=c.getComputedStyle(t).backgroundColor;e&&"transparent"!==e&&!/rgba\([^)]*,\s*0\)$/.test(e)&&(M.setStyle(e,THREE.SRGBColorSpace),a=!0),t=t.parentElement}if(!a){let t=new THREE.Color;t.setStyle(c.getComputedStyle(e).color||"#fff",THREE.SRGBColorSpace),M.setHex(t.r+t.g+t.b>1.5?657930:0xffffff,THREE.SRGBColorSpace)}}let a=.2126*M.r+.7152*M.g+.0722*M.b>.6;S.setRGB(+!a,+!a,+!a),C.copy(M).lerp(new THREE.Color(0xffffff*!a),.08)},eC=e=>{let t=n.current,a=ey(),l=I[e],i=t.openAspect>0?h(t.openAspect,.4,3):h(l?.ready?l.aspect:1.5,.55,2.2),r=eg.open,o=r*i,s=Math.max(eg.avail-(a-1)*(eg.gap+.72*eg.restW*1.15),.42*eg.avail);return o>s&&(r=(o=s)/i),{w:o,h:r}},ej=()=>{er||eo||!ei||ea||(en&&(c.clearTimeout(en),en=0),ea=requestAnimationFrame(eD))},eA=(e=3)=>{let t=performance.now()/1e3;_=!1,Y=Math.max(Y,t+e),G=Math.max(G,t+Math.max(n.current.interval,e))},ek=e=>{let t=ey(),a=e>=0&&e<t?e:-1;a!==z&&(z=a,a>=0?(U=a,r.onOpen(a)):r.onClose(),ej())},eI=e=>{let t=ey();t&&(z>=0?ek((z+e+t)%t):(U=h((performance.now()/1e3<$?U:eH())+e,0,t-1),$=performance.now()/1e3+1.8),eA(),ej())},eH=()=>{let e=ey();return h(Math.round(P/Math.max(eg.pitch,1)+(e-1)/2),0,e-1)},eE=(e,t)=>{let a=ey(),n=e-E/2,l=R/2-t,i=-1,r=1/0;for(let e=0;e<a;e++){let t=j[e],a=Math.abs(n-t.x)-t.w/2;if(Math.abs(l-t.y)-t.h/2>6)continue;let o=Math.max(a,0);o<Math.min(r,eg.gap/2+1)&&(r=o,i=e)}return i},eR=new Float64Array(40),eF=new Float64Array(40),eL=new Float64Array(40),ez=new Float64Array(40),eW=new Float64Array(40),eP=new Float64Array(40),eB=(e,t,a,l)=>{let i=ey(),r=Math.max(n.current.magnify,1),o=0,s=0;for(let n=0;n<i;n++){let l=j[n],i=h(l.o,0,1),u=h(l.o,0,1.2),p=eg.restW*(1+(r-1)*e(n))*(1-.28*t*(1-i)),c=p+(eR[n]-p)*u;a[n]=c,o+=c*i,s+=c*(1-i)}let u=Math.max(i-1,0)*eg.gap;if(o+s+u>eg.avail&&s>1){let e=h((eg.avail-o-u)/s,.05,1);for(let t=0;t<i;t++){let n=h(j[t].o,0,1);a[t]*=n+(1-n)*e}}let p=u;for(let e=0;e<i;e++)p+=a[e];let c=-p/2;for(let e=0;e<i;e++)l[e]=c+a[e]/2,c+=a[e]+eg.gap;return p},eN=(e,t)=>{let a=ey();if(a<2)return 0;let l=Math.max(n.current.influence,20),i=e=>{eB(a=>y((e-ex(a))/l)*(1-.6*t*(1-h(j[a].o,0,1))),t,eL,ez);let n=e/Math.max(eg.pitch,1)+(a-1)/2;if(n<=0)return ez[0]+n*(eL[0]+eg.gap);if(n>=a-1)return ez[a-1]+(n-(a-1))*(eL[a-1]+eg.gap);let i=Math.floor(n);return ez[i]+(ez[i+1]-ez[i])*(n-i)},r=ex(0)-eg.pitch,o=ex(a-1)+eg.pitch;if(e<=i(r))return r;if(e>=i(o))return o;for(let t=0;t<22;t++){let t=(r+o)/2;i(t)<e?r=t:o=t}return(r+o)/2};function eD(e){let t,r,s,u,p,d,v,x,M,S;if(ea=0,er||eo||!L&&(eM(),!L))return;let C=n.current,A=el&&e-el<100?Math.min(Math.max((e-el)/1e3,0),.05):1/60;el=e;let k=performance.now()/1e3,H=C.reduced,F=ey(),Q=!1;for(let e of(k-es>1.2&&(es=k,eS()),eM(),t=n.current,r=Math.max(ey(),1),s=Math.max(16,.04*E),d=((u=Math.max(E-2*s,40))-(r-1)*(p=h(t.gap,0,64)))/r,v=h(Math.min(t.barWidth,d),2,480),x=34*!!t.labels,M=66*!!t.captions,S=Math.max(R-32,160),eg.restW=v,eg.gap=p,eg.pitch=v+p,eg.avail=u,eg.usable=S,eg.labelSpace=x,eg.captionSpace=M,eg.restH=h(t.barHeight,.08,.95)*(S-x),eg.open=h(t.openSize,.15,.95)*(S-M),(()=>{let e=I.length,t=null,a=1/0;for(let n=0;n<e;n++){let l=I[n];if(!l.ready||l.uploaded)continue;let i=Math.abs(n-(e-1)/2);i<a&&(a=i,t=l)}return!!t&&(o.initTexture(t.texture),t.uploaded=!0,!0)})()&&(Q=!0),I))e.uploaded&&e.fade<1&&(e.fade=H||!Z?1:Math.min(1,e.fade+A/.45),Q=!0);if(Z)(et+=A)<1.4&&(Q=!0);else{ee||(ee=k);let e=!0;for(let t=0;t<F;t++)I[t]&&!I[t].uploaded&&(e=!1);e||H||k-ee>1.6?(Z=!0,et=0,i>=0&&i<F&&ek(i),Y=k+1.4,G=k+Math.max(C.interval,1)):Q=!0}let V=h(C.elasticity,0,1),ei=C.paused||H||"off"===C.autoplay,ew=!!ev||C.pauseOnHover&&q,eA=0;for(let e=0;e<F;e++){eA+=h(j[e].o,0,1);let t=eC(e);eR[e]=t.w,eF[e]=t.h}eA=h(eA,0,1);let eI=F?j[0].x-j[0].w/2:0,eH=F?j[F-1].x+j[F-1].w/2:0,eE=Math.max(eI-(N-E/2),N-E/2-eH,0),eL=1-m(0,1.5*eg.pitch,eE),ez=null,eD=0,eq=.06,eO=!1;if(ev&&"scrub"===ev.mode)ez=eN(N-E/2,eA),eD=eL;else{let e,t;if(q&&!(ev&&"pull"===ev.mode)&&(e=R/2-D,t=eg.restH*Math.max(n.current.lift,1)/2+48,Math.abs(e-eg.yC)<=Math.max(t,eg.open/2*h((()=>{let e=0;for(let t=0;t<ey();t++)e+=j[t].o;return h(e,0,1)})(),0,1)))&&eL>0)ez=eN(N-E/2,eA),eD=eL;else if(k<$)ez=ex(U),eD=1,eq=.22;else if("sweep"===C.autoplay&&!ei&&!ew&&z<0&&Z&&k>=Y&&F>1){let e=(F-1)/2*eg.pitch*.86,t=Math.asin(.88);if(!_){let a=h(P/Math.max(e,1),-1,1);X=Math.asin(h(Math.sin(a*t)/.88,-1,1)),B<0&&(X=Math.PI-X)}eO=!0;let a=Math.PI/2*((F-1)/2)*.86;X+=A*h(C.speed,0,6)/Math.max(a,.5)*(Math.PI/2),ez=e*Math.asin(.88*Math.sin(X))/t,eD=1,eq=.2}}_=eO,"cycle"===C.autoplay&&!ei&&!ew&&Z&&F>1&&k>=G&&(G=k+Math.max(C.interval,1),ek(z<0?0:(z+1)%F)),null!==ez&&(O<.02&&(P=ez,B=0),[P,B]=g(P,B,ez,A,H?.04:eq,1),(Math.abs(P-ez)>.05||Math.abs(B)>.5)&&(Q=!0)),[O,T]=g(O,T,eD,A,H?.05:eD>O?.3:.45,1),Math.abs(O-eD)>.001||Math.abs(T)>.001?Q=!0:(O=eD,T=0);let eT=H?.05:.09+.2*V,eU=1-.55*V,e$=H?.06:.5+.12*V,eX=1-.45*V,e_=Math.max(C.influence,20),eY=0;for(let e=0;e<F;e++){let t=j[e],a=O*y((P-ex(e))/e_);[t.m,t.mv]=g(t.m,t.mv,a,A,eT,eU),(Math.abs(t.m-a)>1e-4||Math.abs(t.mv)>.001)&&(Q=!0);let n=+(e===z);[t.o,t.ov]=g(t.o,t.ov,n,A,e$,eX),Math.abs(t.o-n)>1e-4||Math.abs(t.ov)>.001?Q=!0:(t.o=n,t.ov=0);let l=.045*Math.abs(e-(F-1)/2),i=Z&&(H||et>=l)?1:0;H&&Z?(t.a=1,t.av=0):([t.a,t.av]=g(t.a,t.av,i,A,.7,.86),Math.abs(t.a-i)>1e-4||Math.abs(t.av)>.001?Q=!0:(t.a=i,t.av=0));let r=ev&&W===e&&!ev.moved?1:0;[t.q,t.qv]=g(t.q,t.qv,r,A,.22,.7),Math.abs(t.q-r)>1e-4||Math.abs(t.qv)>.001?Q=!0:(t.q=r,t.qv=0),eY+=h(t.o,0,1)}eY=h(eY,0,1),ev&&"pull"===ev.mode||([J,K]=g(J,K,0,A,H?.05:.42,.9),Math.abs(J)>.05||Math.abs(K)>.5?Q=!0:(J=0,K=0));let eG=Math.max(C.lift,.5),eQ=e=>j[e].m*(1-.6*eY*(1-h(j[e].o,0,1)));eB(eQ,eY,eW,eP);for(let e=0;e<F;e++){let t=j[e],a=h(t.o,0,1.2),n=eg.restH*(1+(eG-1)*eQ(e))*(1-.14*eY*(1-h(t.o,0,1)));t.w=eW[e],t.h=n+(eF[e]-n)*a}eg.yC=eg.labelSpace/2+(eg.captionSpace/2-eg.labelSpace/2)*eY;let eV="bottom"===C.align,eJ=eg.yC-eg.restH/2,eK=Math.max(C.radius,0),eZ=h(C.blur,0,1),e0=h(C.dim,0,1),e1=h(C.shadow,0,1),e2=h(C.rim,0,1),e5=-1,e4=0,e6=P/Math.max(eg.pitch,1)+(F-1)/2,e3=F?h(Math.round(e6),0,F-1):-1,e8=1-m(.26,.46,Math.abs(e6-e3));for(let e=0;e<F;e++){let t=j[e];t.x=eP[e]+J;let a=eg.yC,n=eJ+t.h/2;t.y=eV?n+(a-n)*eY:a,t.o>e4&&(e4=t.o,e5=e);let i=t.mesh,r=t.a,o=r>.002&&t.w>.5;if(i.visible=o,!o)continue;let s=1-.035*t.q,u=.94+.06*r,p=t.w*s*u,c=t.h*s*u,d=Math.max(12,.14*c),m=(1-r)*eg.restH*.22;i.position.set(t.x,t.y-m,0),i.scale.set(p+2*d,c+2*d,1),i.renderOrder=e===e5?1e3:e;let f=i.material.uniforms,b=I[e],v=eY*(1-h(t.o,0,1)),g=1-.65*t.m;f.uImage.value=b?.uploaded?b.texture:w,f.uImageAspect.value=b?.ready?b.aspect:1.5,f.uLoaded.value=b?.uploaded?b.fade:0,f.uSize.value.set(p,c),f.uMargin.value=d,f.uRadius.value=Math.min(eK,p/2),f.uFocus.value=h(l.current[e]?.focus??.5,0,1),f.uBlur.value=H?0:v*eZ*2.6*g,f.uAlpha.value=r*(1-v*e0*.8*g),f.uShadow.value=e1,f.uRim.value=e2}for(let e=F;e<40;e++)j[e].mesh.visible=!1;if(function(e,t,i,r,o){let s=n.current,u=l.current;if(s.captions&&e>=0){if(e!==eu){eu=e;let t=u[e];a.title.textContent=t?t.title??t.alt:"",a.subtitle.textContent=t?.subtitle??"",a.subtitle.style.display=t?.subtitle?"":"none"}let n=j[e],l=m(.62,1,t)*n.a,i=E/2+n.x,r=R/2-(n.y-n.h/2)+18;(Number.isNaN(ec)||Math.abs(i-ec)>.05||Math.abs(r-ed)>.05)&&(ec=i,ed=r,a.caption.style.transform=`translate(${i.toFixed(2)}px, ${r.toFixed(2)}px) translateX(-50%)`),Math.abs(l-ep)>.002&&(ep=l,a.caption.style.opacity=l.toFixed(3))}else 0!==ep&&(ep=0,a.caption.style.opacity="0");if(s.labels&&i>=0){if(i!==eh){eh=i;let e=u[i];a.label.textContent=e?e.title??e.alt:""}let e=j[i],t=O*r*m(.45,.8,e.m)*(1-m(.05,.4,o))*e.a,n=E/2+e.x,l=R/2-(e.y-e.h/2)+14;(Number.isNaN(ef)||Math.abs(n-ef)>.05||Math.abs(l-eb)>.05)&&(ef=n,eb=l,a.label.style.transform=`translate(${n.toFixed(2)}px, ${l.toFixed(2)}px) translateX(-50%)`),Math.abs(t-em)>.002&&(em=t,a.label.style.opacity=t.toFixed(3))}else 0!==em&&(em=0,a.label.style.opacity="0")}(e5,e4,e3,e8,eY),o.render(f,b),Q||ev||_||q)ej();else if(!ei&&Z&&F>1&&!en){let e="cycle"===C.autoplay?G:"sweep"===C.autoplay?Y:0;e>k&&(en=c.setTimeout(()=>{en=0,el=0,ej()},(e-k)*1e3+16))}}let eq=t=>{let a=e.getBoundingClientRect();return{x:t.clientX-a.left,y:t.clientY-a.top}},eO=a=>{let l=eq(a);if("touch"!==a.pointerType){q=!0,N=l.x,D=l.y;let t=eE(l.x,l.y)>=0?"pointer":"";e.style.cursor!==t&&(e.style.cursor=t)}if(ev&&ev.id===a.pointerId){let e=a.clientX-ev.x,i=a.clientY-ev.y;if(!ev.moved&&Math.hypot(e,i)>6){ev.moved=!0,n.current.draggable?z>=0?ev.mode="pull":ev.mode="scrub":ev.mode="none";try{t.setPointerCapture(a.pointerId)}catch{}}if(ev.moved){if("scrub"===ev.mode)N=l.x,D=l.y;else if("pull"===ev.mode){let t=Math.max(.18*E,80);J=t*Math.tanh(e/t/1.6)*.9,K=0}let t=performance.now();for(ev.samples.push({t,x:a.clientX});ev.samples.length>2&&t-ev.samples[0].t>110;)ev.samples.shift()}}ej()},eT=e=>{if(!e.isPrimary||e.button>0)return;let t=eq(e);W=eE(t.x,t.y),ev={id:e.pointerId,x:e.clientX,y:e.clientY,t:performance.now(),moved:!1,mode:"none",samples:[{t:performance.now(),x:e.clientX}]},"touch"===e.pointerType&&(N=t.x,D=t.y),eA(),ej()},eU=(e,a)=>{if(!ev||ev.id!==e.pointerId)return;let n=ev;ev=null;try{t.hasPointerCapture(e.pointerId)&&t.releasePointerCapture(e.pointerId)}catch{}let l=ey();if(a||n.moved){if(!a&&"pull"===n.mode&&z>=0&&l>1){let t=performance.now(),a=n.samples.filter(e=>t-e.t<110),i=0;if(a.length>1){let e=Math.max((a[a.length-1].t-a[0].t)/1e3,1/120);i=(a[a.length-1].x-a[0].x)/e}let r=e.clientX-n.x;r<-56||i<-520?ek((z+1)%l):(r>56||i>520)&&ek((z-1+l)%l)}}else{let t=eq(e),a=eE(t.x,t.y);a>=0&&a===W?ek(a===z?-1:a):a<0&&z>=0&&ek(-1)}W=-1,"touch"===e.pointerType&&(q=!1),eA(),ej()},e$=e=>eU(e,!1),eX=e=>eU(e,!0),e_=t=>{ev&&ev.id===t.pointerId||(q=!1,e.style.cursor="",eA(1.6),ej())},eY=e=>{if(!n.current.wheel)return;let t=ey();if(!t)return;e.preventDefault();let a=1===e.deltaMode?16:2===e.deltaMode?R:1,l=h((Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)*a,-240,240),i=performance.now()/1e3;if(z>=0){if(i<V)return;Math.abs(Q+=l)>=90&&(ek((z+(Q>0?1:-1)+t)%t),Q=0,V=i+.32)}else{for(i>=$&&(U=q?eG():eH(),Q=0),Q+=l;Math.abs(Q)>=60;){let e=Q>0?1:-1;U=h(U+e,0,t-1),Q-=60*e}$=i+1.6}eA(),ej()},eG=()=>{let e=ey(),t=N-E/2,a=0,n=1/0;for(let l=0;l<e;l++){let e=Math.abs(t-j[l].x);e<n&&(n=e,a=l)}return a},eQ=t=>{if(t.target!==e)return;let a=ey();if(a)if("ArrowRight"===t.key)t.preventDefault(),eI(1);else if("ArrowLeft"===t.key)t.preventDefault(),eI(-1);else if("Home"===t.key||"End"===t.key){t.preventDefault();let e="Home"===t.key?0:a-1;z>=0?ek(e):(U=e,$=performance.now()/1e3+1.8),eA(),ej()}else"Enter"===t.key||" "===t.key?(t.preventDefault(),z>=0?ek(-1):ek(performance.now()/1e3<$?U:eH()),eA()):"Escape"===t.key&&z>=0&&(t.preventDefault(),ek(-1))};t.addEventListener("pointerdown",eT),t.addEventListener("pointermove",eO),t.addEventListener("pointerup",e$),t.addEventListener("pointercancel",eX),t.addEventListener("pointerleave",e_),t.addEventListener("wheel",eY,{passive:!1}),e.addEventListener("keydown",eQ);let eV=new ResizeObserver(()=>{eM()&&ej()});eV.observe(e);let eJ="undefined"==typeof IntersectionObserver?null:new IntersectionObserver(([e])=>{(ei=e.isIntersecting)?(el=0,ej()):(ea&&cancelAnimationFrame(ea),ea=0)},{rootMargin:"80px"});eJ?eJ.observe(e):ei=!0;let eK=e=>{e.preventDefault(),eo=!0,ea&&cancelAnimationFrame(ea),ea=0},eZ=()=>{eo=!1,H="",ew(),ej()};return d.addEventListener("webglcontextlost",eK),d.addEventListener("webglcontextrestored",eZ),eM(),eS(),j[0].mesh.visible=!0,o.compile(f,b),j[0].mesh.visible=!1,ew(),ej(),{sync:()=>{eM(),eS(),ew(),eu=-1,eh=-1,ej()},open:e=>{ek(e),eA()},close:()=>ek(-1),step:eI,destroy:()=>{er=!0,ea&&cancelAnimationFrame(ea),en&&c.clearTimeout(en),eJ?.disconnect(),eV.disconnect(),t.removeEventListener("pointerdown",eT),t.removeEventListener("pointermove",eO),t.removeEventListener("pointerup",e$),t.removeEventListener("pointercancel",eX),t.removeEventListener("pointerleave",e_),t.removeEventListener("wheel",eY),e.removeEventListener("keydown",eQ),e.style.cursor="",d.removeEventListener("webglcontextlost",eK),d.removeEventListener("webglcontextrestored",eZ),I.forEach(e=>{e.image.onload=null,e.texture.dispose()}),j.forEach(e=>e.mesh.material.dispose()),w.dispose(),x.dispose(),o.dispose(),o.getContext().isContextLost()||o.forceContextLoss(),d.remove()}}})(e,t,{caption:a,title:n,subtitle:l,label:i},eg,ec,ed,{onOpen:e=>{em(e);let t=ec.current[e];t&&ey.current.onOpen?.(t,e)},onClose:()=>{em(-1),ey.current.onClose?.()}});if(!r){let e=requestAnimationFrame(()=>eb(!0));return()=>cancelAnimationFrame(e)}return es.current=r,()=>{r.destroy(),es.current=null}},[ed]),React.useImperativeHandle(ee,()=>({open:e=>es.current?.open(e),close:()=>es.current?.close(),next:()=>es.current?.step(1),previous:()=>es.current?.step(-1)}),[]);let ex=_.trim().toLowerCase(),ew="transparent"===ex||""===ex,eM=!ew&&!!(et=v(ex))&&.2126*et[0]+.7152*et[1]+.0722*et[2]>.6,eS=eh>=0?ep[eh]:null;
    return (
      <div
        ref={ea}
        className={cn(
          "relative h-full min-h-[420px] w-full overflow-hidden outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[color-mix(in_oklch,currentColor_35%,transparent)]",
          K
        )}
        style={{
          backgroundColor: ew ? undefined : _,
          color: ew ? "currentColor" : eM ? "#0a0a0a" : "#fafafa",
          ...Z,
        }}
        role="region"
        aria-roledescription="carousel"
        aria-label={Q}
        tabIndex={0}
      >
        <div ref={en} style={w} />
        {ef ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: r,
            }}
          >
            {ep.slice(0, 12).map((e: any, t: number) => (
              <img
                key={`${e.src}-${t}`}
                src={e.src}
                alt={e.alt}
                style={{ width: a, height: "50%", objectFit: "cover", borderRadius: o }}
              />
            ))}
          </div>
        ) : null}
        <ul style={x}>
          {ep.map((e: any, t: number) => (
            <li key={`${e.src}-${t}`}>
              {e.title ? `${e.title}${e.subtitle ? `, ${e.subtitle}` : ""}` : e.alt}
            </li>
          ))}
        </ul>
        <div aria-live="polite" style={x}>
          {eS ? `Opened ${eS.title ?? eS.alt}` : ""}
        </div>
        <span ref={eo} aria-hidden="true" style={j} />
        <div ref={el} aria-hidden="true" style={M}>
          <span ref={ei} style={S} />
          <span ref={er} style={C} />
        </div>
      </div>
    );
  }
);

I.displayName = "ElasticReel";

export const ElasticReel = I as unknown as React.ForwardRefExoticComponent<ElasticReelProps & React.RefAttributes<ElasticReelHandle>>;
export type { ElasticReelItem, ElasticReelProps, ElasticReelHandle };
export default ElasticReel;
