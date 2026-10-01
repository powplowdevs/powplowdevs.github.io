/* Ocean backgrounds: abyss (WebGL + ripple sim), tide (2D ripple sim), still (CSS). */
const Ocean=(()=>{
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let splashCb=null;const emit=(x,y,s,k)=>{if(splashCb)splashCb(x,y,s,k)};const STR={amp:1.2,lum:1.16,v:50};let BO={x:0,hold:4,fade:2.5,t0:-1e9};const boostK=()=>{const e=(performance.now()-BO.t0)/1000;if(e<0)return 0;if(e<BO.hold)return BO.x;const f=1-(e-BO.hold)/BO.fade;return f>0?BO.x*f*f*(3-2*f):0};let xray=false,plank=false,plankton=[];let mode=null,raf=0,stopFns=[],sim=null;
const fx=document.getElementById('fx'),fctx=fx.getContext('2d');
let bubbles=[];let fxW=0,fxH=0;
function sizeFx(){const d=Math.min(devicePixelRatio||1,2);fxW=innerWidth;fxH=innerHeight;fx.width=fxW*d;fx.height=fxH*d;fctx.setTransform(d,0,0,d,0,0)}
sizeFx();addEventListener('resize',sizeFx);

/* ---- ripple heightfield ---- */
function Sim(){const cell=innerWidth<700?5:6;let w,h,a,b;
 const init=()=>{w=Math.ceil(innerWidth/cell)+2;h=Math.ceil(innerHeight/cell)+2;a=new Float32Array(w*h);b=new Float32Array(w*h)};init();
 return{get w(){return w},get h(){return h},get cur(){return a},cell,resize:init,
  poke(px,py,r,s){const cx=px/cell,cy=py/cell;const R=Math.ceil(r);for(let y=-R;y<=R;y++)for(let x=-R;x<=R;x++){const d=x*x+y*y;if(d>r*r)continue;const X=Math.round(cx+x),Y=Math.round(cy+y);if(X<1||Y<1||X>=w-1||Y>=h-1)continue;a[Y*w+X]+=s*(1-d/(r*r+.01))}},
  step(damp){for(let y=1;y<h-1;y++){const o=y*w;for(let x=1;x<w-1;x++){const i=o+x;b[i]=((a[i-1]+a[i+1]+a[i-w]+a[i+w])*.5-b[i])*damp}}const t=a;a=b;b=t}}}

/* pointer -> ripples */
let last=null;
function onMove(e){if(!sim)return;const x=e.clientX,y=e.clientY;if(plank&&plankton.length<160)for(let i=0;i<2;i++)plankton.push({x:x+(Math.random()-.5)*14,y:y+(Math.random()-.5)*14,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.3,r:.6+Math.random()*1.1,l:1});
 if(last){const dx=x-last.x,dy=y-last.y,sp=Math.min(Math.hypot(dx,dy),60);if(sp>2){const n=Math.ceil(sp/14);for(let k=1;k<=n;k++)sim.poke(last.x+dx*k/n,last.y+dy*k/n,2,sp*.03*STR.amp)}
  if(sp>34)emit(x,y,Math.min(1,(sp-34)/40),'move');if(mode==='abyss'&&sp>3&&Math.random()<Math.min(.85,.25+sp/40))bubble(x-dx*.3,y-dy*.3,style==='fizz'?3:1,10,.6)}
 last={x,y}}
function onDown(e){if(sim)sim.poke(e.clientX,e.clientY,4,3.2);if(!e.target.closest||!e.target.closest('a,button,input,label,.sw,.pal'))emit(e.clientX,e.clientY,.7,'drop')}

/* bubbles: four styles */
let style='pearl';let MAXB=260;
const lensLayer=document.createElement('div');lensLayer.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:41;overflow:hidden';document.body.appendChild(lensLayer);
const sprites={};function sprite(r){const k=Math.round(r*2);if(sprites[k])return sprites[k];const d=Math.ceil(k*2+6),c=document.createElement('canvas');c.width=c.height=d*2;const g=c.getContext('2d');g.scale(2,2);const R=k/2,cx=d/2;
 const rg=g.createRadialGradient(cx-R*.25,cx-R*.3,R*.1,cx,cx,R);rg.addColorStop(0,'rgba(200,230,245,.05)');rg.addColorStop(.72,'rgba(170,210,230,.10)');rg.addColorStop(.93,'rgba(215,238,250,.55)');rg.addColorStop(1,'rgba(215,238,250,0)');
 g.fillStyle=rg;g.beginPath();g.arc(cx,cx,R,0,7);g.fill();g.fillStyle='rgba(255,255,255,.9)';g.beginPath();g.ellipse(cx-R*.38,cx-R*.42,R*.22,R*.14,-.6,0,7);g.fill();
 g.strokeStyle='rgba(255,255,255,.25)';g.lineWidth=.6;g.beginPath();g.arc(cx,cx,R*.72,.4,1.3);g.stroke();return sprites[k]={c,d}}
function bubble(x,y,n,spread=0,scale=1){if(bubbles.length>MAXB)return;for(let i=0;i<n;i++){
 const b={x:x+(Math.random()-.5)*spread,y:y+Math.random()*6,ph:Math.random()*6,life:1,st:style};
 if(style==='fizz'){b.r=.5+Math.random()*1.1;b.vy=1.1+Math.random()*1.6;b.dec=.012+Math.random()*.01}
 else if(style==='lens'){b.r=(5+Math.random()*9)*scale;b.vy=.35+Math.random()*.5;b.dec=.004+Math.random()*.004;
  if(lensLayer.childElementCount>26)continue;const e=document.createElement('i');e.className='lensb';e.style.width=e.style.height=b.r*2+'px';lensLayer.appendChild(e);b.el=e}
 else if(style==='pearl'){b.r=(1.4+Math.random()*4.2)*scale;b.vy=.3+Math.random()*.8;b.dec=.005+Math.random()*.006}
 else{b.r=(1+Math.random()*2.6)*scale;b.vy=.35+Math.random()*.9;b.dec=.006+Math.random()*.008}
 bubbles.push(b)}}
let pops=[];
function drawFx(){fctx.clearRect(0,0,fxW,fxH);
 bubbles=bubbles.filter(b=>{b.y-=b.vy;b.vy*=b.st==='fizz'?1.01:1.004;b.ph+=b.st==='fizz'?.25:.07;b.life-=b.dec;
  const wob=b.st==='fizz'?.8:Math.min(2.4,b.r*.35),x=b.x+Math.sin(b.ph)*wob,a=Math.max(b.life,0);
  if(b.st==='fizz'){fctx.globalAlpha=a*.8;fctx.fillStyle='#d9ecf5';fctx.fillRect(x,b.y,b.r,b.r);fctx.globalAlpha=a*.18;fctx.fillRect(x+b.r*.3,b.y+b.r,.6,b.vy*5)}
  else if(b.st==='pearl'){const s=sprite(b.r),sq=1+Math.sin(b.ph*1.7)*.06;fctx.globalAlpha=Math.min(1,a*1.4);fctx.drawImage(s.c,x-s.d/2*sq,b.y-s.d/2/sq,s.d*sq,s.d/sq)}
  else if(b.st==='lens'){if(b.el){b.el.style.transform=`translate(${x-b.r}px,${b.y-b.r}px) scale(${1+Math.sin(b.ph*1.5)*.05},${1-Math.sin(b.ph*1.5)*.05})`;b.el.style.opacity=Math.min(1,a*1.6)}}
  else{fctx.globalAlpha=a*.75;fctx.strokeStyle='#b9d4e2';fctx.lineWidth=.8;fctx.beginPath();fctx.arc(x,b.y,b.r,0,7);fctx.stroke();fctx.fillStyle='#e6f2f8';fctx.fillRect(x-b.r*.35,b.y-b.r*.45,.9,.9)}
  if(b.life<=0||b.y<-20){if(b.el)b.el.remove();if(b.st!=='fizz'&&b.r>2&&b.y>0)pops.push({x,y:b.y,r:b.r,t:1});return false}return true});
 pops=pops.filter(p=>{p.t-=.08;fctx.globalAlpha=Math.max(p.t,0)*.5;fctx.strokeStyle='#cfe6f2';fctx.lineWidth=.6;fctx.beginPath();fctx.arc(p.x,p.y,p.r*(1+(1-p.t)*1.6),0,7);fctx.stroke();return p.t>0});
 if(plank){plankton=plankton.filter(p=>{p.x+=p.vx;p.y+=p.vy;p.vy-=.004;p.l-=.012;const a=Math.max(p.l,0);fctx.globalAlpha=a*.9;fctx.fillStyle='#8ff3e0';fctx.beginPath();fctx.arc(p.x,p.y,p.r,0,7);fctx.fill();fctx.globalAlpha=a*.18;fctx.beginPath();fctx.arc(p.x,p.y,p.r*4,0,7);fctx.fill();return p.l>0})}
 if(xray&&sim){const w=sim.w,h=sim.h,a=sim.cur,c=sim.cell;for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const v=a[y*w+x];if(v>.08||v<-.08){fctx.globalAlpha=Math.min(.38,Math.abs(v)*.45);fctx.fillStyle=v>0?'#7fd1e6':'#e0708a';fctx.fillRect(x*c-c+.5,y*c-c+.5,c-1,c-1)}}
  fctx.globalAlpha=.07;fctx.strokeStyle='#9fc6d6';fctx.lineWidth=1;fctx.beginPath();for(let x=0;x<fxW;x+=c*8){fctx.moveTo(x+.5,0);fctx.lineTo(x+.5,fxH)}for(let y=0;y<fxH;y+=c*8){fctx.moveTo(0,y+.5);fctx.lineTo(fxW,y+.5)}fctx.stroke()}
 fctx.globalAlpha=1}
function setStyle(s){style=s;bubbles.forEach(b=>b.el&&b.el.remove());bubbles=[]}
/* ---- ABYSS: WebGL shaded sea ---- */
function startAbyss(){
 const c=document.createElement('canvas');c.id='sea';document.body.prepend(c);
 const gl=c.getContext('webgl',{antialias:false,alpha:false,premultipliedAlpha:false});if(!gl){c.remove();return startTide()}
 const vs=`attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0,1);}`;
 const fs=`precision mediump float;uniform sampler2D R;uniform vec2 res,m,tx;uniform float t,on,amp,lum;varying vec2 v;
 float hs(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float ns(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hs(i),hs(i+vec2(1,0)),f.x),mix(hs(i+vec2(0,1)),hs(i+1.),f.x),f.y);}
 float sw(vec2 p){float h=sin(p.x*1.1+t*.32+sin(p.y*.6+t*.17))*.45;h+=sin(p.y*1.7-t*.24+p.x*.35)*.3;h+=ns(p*2.1+vec2(t*.07,-t*.045))*.55;h+=ns(p*4.8+vec2(-t*.11,t*.09))*.18;return h;}
 void main(){vec2 asp=vec2(res.x/res.y,1.);vec2 p=v*asp*2.6;float e=.012;float h=sw(p);
  vec2 g=vec2(sw(p+vec2(e,0.))-h,sw(p+vec2(0.,e))-h)/e*.045*amp;
  float rl=texture2D(R,v-vec2(tx.x,0.)).r,rr=texture2D(R,v+vec2(tx.x,0.)).r,rd=texture2D(R,v-vec2(0.,tx.y)).r,ru=texture2D(R,v+vec2(0.,tx.y)).r;
  g+=vec2(rl-rr,rd-ru)*2.2*amp;
  vec3 n=normalize(vec3(-g,1.));vec3 L=normalize(vec3(-.35,.55,.75));vec3 H=normalize(L+vec3(0,0,1));
  float dif=max(dot(n,L),0.);float sp=pow(max(dot(n,H),0.),70.);
  vec2 d=(v-m)*asp;float cl=exp(-dot(d,d)*9.)*on;
  vec3 col=vec3(.004,.006,.009)+vec3(.012,.02,.027)*smoothstep(0.,1.,v.y);
  col+=vec3(.018,.028,.036)*pow(dif,3.)*.9*lum;
  col+=vec3(.6,.72,.8)*sp*(.08+cl*.45)*lum;
  col+=vec3(.02,.035,.045)*cl*.6;
  col*=1.-.45*dot((v-.5)*vec2(1.1,1.),(v-.5)*vec2(1.1,1.));
  gl_FragColor=vec4(col,1.);}`;
 const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o};
 const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);
 if(!gl.getProgramParameter(pr,gl.LINK_STATUS)){c.remove();return startTide()}
 gl.useProgram(pr);const bf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,bf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
 const loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
 const U=n=>gl.getUniformLocation(pr,n);const uRes=U('res'),uT=U('t'),uM=U('m'),uTx=U('tx'),uOn=U('on'),uAmp=U('amp'),uLum=U('lum');
 const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);['TEXTURE_WRAP_S','TEXTURE_WRAP_T'].forEach(k=>gl.texParameteri(gl.TEXTURE_2D,gl[k],gl.CLAMP_TO_EDGE));
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.pixelStorei(gl.UNPACK_ALIGNMENT,1);
 sim=Sim();let buf=new Uint8Array(sim.w*sim.h);
 const size=()=>{const d=Math.min(devicePixelRatio||1,1.5);c.width=innerWidth*d;c.height=innerHeight*d;gl.viewport(0,0,c.width,c.height);sim.resize();buf=new Uint8Array(sim.w*sim.h)};size();
 addEventListener('resize',size);stopFns.push(()=>removeEventListener('resize',size),()=>{c.remove()});
 let mx=.5,my=.5,tmx=.5,tmy=.5,on=0,ton=0;const mm=e=>{tmx=e.clientX/innerWidth;tmy=1-e.clientY/innerHeight;ton=1};const ml=()=>ton=0;
 addEventListener('pointermove',mm);document.addEventListener('pointerleave',ml);stopFns.push(()=>{removeEventListener('pointermove',mm);document.removeEventListener('pointerleave',ml)});
 let nextDrop=0;const t0=performance.now();
 const frame=now=>{if(!reduce){const dmp=boostK()>0?.989:.986;sim.step(dmp);sim.step(dmp)}
  if(now>nextDrop){sim.poke(Math.random()*innerWidth,Math.random()*innerHeight,2,.9);if(Math.random()<.3)bubble(Math.random()*innerWidth,innerHeight+6,style==='fizz'?4:1,20);nextDrop=now+1200+Math.random()*1800}
  const a=sim.cur,n=a.length;for(let i=0;i<n;i++){let v=128+a[i]*38;buf[i]=v<0?0:v>255?255:v}
  gl.texImage2D(gl.TEXTURE_2D,0,gl.LUMINANCE,sim.w,sim.h,0,gl.LUMINANCE,gl.UNSIGNED_BYTE,buf);
  mx+=(tmx-mx)*.08;my+=(tmy-my)*.08;on+=(ton-on)*.05;
  gl.uniform2f(uRes,c.width,c.height);gl.uniform1f(uT,reduce?0:(now-t0)/1000);gl.uniform2f(uM,mx,my);gl.uniform2f(uTx,1/sim.w,1/sim.h);gl.uniform1f(uOn,on);const bk=boostK();gl.uniform1f(uAmp,STR.amp*(1+bk));gl.uniform1f(uLum,STR.lum*(1+bk*1.8));
  gl.drawArrays(gl.TRIANGLE_STRIP,0,4);drawFx();raf=requestAnimationFrame(frame)};
 raf=requestAnimationFrame(frame)}

/* ---- TIDE: 2D canvas ripple sea ---- */
function startTide(){
 const c=document.createElement('canvas');c.id='sea';document.body.prepend(c);const ctx=c.getContext('2d');
 sim=Sim();const off=document.createElement('canvas');const octx=off.getContext('2d');let img;
 const size=()=>{c.width=innerWidth;c.height=innerHeight;sim.resize();off.width=sim.w;off.height=sim.h;img=octx.createImageData(sim.w,sim.h)};size();
 addEventListener('resize',size);stopFns.push(()=>removeEventListener('resize',size),()=>c.remove());
 let nextDrop=0,t0=performance.now();
 const frame=now=>{if(!reduce)sim.step(.982);
  if(now>nextDrop){sim.poke(Math.random()*innerWidth,Math.random()*innerHeight,2,1.2);nextDrop=now+1400+Math.random()*2000}
  const w=sim.w,h=sim.h,a=sim.cur,d=img.data,t=(now-t0)/1000;
  for(let y=1;y<h-1;y++){const base=3+10*(y/h);for(let x=1;x<w-1;x++){const i=y*w+x;
   const sx=a[i-1]-a[i+1],sy=a[i-w]-a[i+w];const amb=Math.sin(x*.05+t*.4+Math.sin(y*.04+t*.25))*.5+Math.sin(y*.07-t*.3)*.5;
   let l=(sx+sy)*26+amb*2.2;const hi=l>0?l:0;const k=i*4;
   d[k]=base*.35+hi*.55;d[k+1]=base*.6+hi*.7;d[k+2]=base*.85+hi*.82+l*.2;d[k+3]=255}}
  octx.putImageData(img,0,0);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(off,1,1,w-2,h-2,0,0,c.width,c.height);
  drawFx();raf=requestAnimationFrame(frame)};
 raf=requestAnimationFrame(frame)}

/* ---- STILL: CSS sea ---- */
function startStill(){
 const s=document.createElement('div');s.className='stillsea';s.id='sea';s.innerHTML='<div class="l1"></div><div class="l2"></div><div class="glint"></div>';document.body.prepend(s);
 const g=s.querySelector('.glint');let gx=innerWidth/2,gy=innerHeight/2,tx=gx,ty=gy,lastRing=0;
 const mm=e=>{tx=e.clientX;ty=e.clientY;const now=performance.now();if(now-lastRing>260&&!reduce){lastRing=now;const r=document.createElement('span');r.className='ring';r.style.left=tx+'px';r.style.top=ty+'px';s.appendChild(r);setTimeout(()=>r.remove(),1900)}};
 addEventListener('pointermove',mm);stopFns.push(()=>removeEventListener('pointermove',mm),()=>s.remove());
 const frame=()=>{gx+=(tx-gx)*.06;gy+=(ty-gy)*.06;g.style.transform=`translate(${gx}px,${gy}px)`;drawFx();raf=requestAnimationFrame(frame)};raf=requestAnimationFrame(frame)}

addEventListener('pointermove',onMove,{passive:true});addEventListener('pointerdown',onDown,{passive:true});

function set(m){cancelAnimationFrame(raf);stopFns.forEach(f=>f());stopFns=[];sim=null;last=null;bubbles=[];fctx.clearRect(0,0,fxW,fxH);
 lensLayer.innerHTML='';mode=m;document.body.classList.remove('m-abyss','m-tide','m-still');document.body.classList.add('m-'+m);
 ({abyss:startAbyss,tide:startTide,still:startStill})[m]()}
/* called when an element breaks the surface during the intro */
function surface(el,strength=1){const r=el.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;emit(r.left+r.width/2,r.top+r.height/2,Math.min(1,strength*(.35+r.width/1400)),'surface');
 const cx=r.left+r.width/2,cy=r.top+r.height*.6;
 const bk=boostK();if(sim){sim.poke(cx,cy,Math.min(10,3+r.width/140)*(1+bk*.8),1.6*strength*(1+bk*1.5));if(r.width>300){sim.poke(r.left+r.width*.2,cy,3,1*strength);sim.poke(r.right-r.width*.2,cy,3,1*strength)}}
 if(mode!=='still'){const n=mode==='abyss'?Math.min(14,3+Math.round(r.width/90)):Math.min(8,2+Math.round(r.width/140));
  const k=style==='fizz'?n*2:style==='lens'?Math.ceil(n/3):n;for(let i=0;i<k;i++)bubble(r.left+Math.random()*r.width,r.bottom-Math.random()*Math.min(r.height,60),1,0,style==='lens'?.8:1)}}
function strength(v){STR.v=v;const m=.6+v*.012;STR.amp=m;STR.lum=Math.pow(m,.8)}
function flood(){MAXB=900;setTimeout(()=>MAXB=260,6000);const n=240;for(let i=0;i<n;i++)setTimeout(()=>{const x=Math.random()*innerWidth;bubble(x,innerHeight+10,3,30);if(sim)sim.poke(x,innerHeight-40-Math.random()*200,3,1.2)},i*8)}
function splash(r,st=1){emit(r.left+r.width/2,r.top+r.height/2,1,'splash');if(!sim)return;const cy=r.top+r.height/2;const n=Math.max(4,Math.round(r.width/70));for(let i=0;i<=n;i++){sim.poke(r.left+r.width*i/n,cy,4,st*(0.8+Math.random()*.5))}sim.poke(r.left+r.width/2,cy+10,9,st*1.4)}
function boost(x,hold,fade){BO={x,hold,fade:fade||2.5,t0:performance.now()}}
/* big artificial swells at the start of the intro, sized to the screen */
let iwT=[];function introWaves(){iwT.forEach(clearTimeout);iwT=[];
 /* 3 to 5 drops at random spots, kept apart from each other, like someone tapping the water */
 const n=3+Math.floor(Math.random()*3),pts=[];let tries=0;
 while(pts.length<n&&tries++<200){const p=[.12+Math.random()*.76,.15+Math.random()*.7];if(pts.every(q=>Math.hypot((p[0]-q[0])*innerWidth,(p[1]-q[1])*innerHeight)>Math.min(innerWidth,innerHeight)*.32))pts.push(p)}
 pts.forEach((p,k)=>iwT.push(setTimeout(()=>{if(!sim)return;const r=Math.min(10,Math.max(5,Math.min(innerWidth,innerHeight)*.035/sim.cell));sim.poke(innerWidth*p[0],innerHeight*p[1],r,3);emit(innerWidth*p[0],innerHeight*p[1],.6,'surface')},350+k*(500+Math.random()*250))))}
return{boost,introWaves,onSplash:f=>{splashCb=f},set,surface,splash,bubble,setStyle,strength,flood,xray:v=>{xray=v},plankton:v=>{plank=v;plankton=[]},get sim(){return sim},get mode(){return mode},get style(){return style}};
})();
