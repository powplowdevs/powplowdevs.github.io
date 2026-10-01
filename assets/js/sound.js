/* Procedural sound. Deep ambience, volume 50. No audio files. */
const Sound=(()=>{
const LA=.03;let ctx=null,master=null,amb=null,on=false,vol=Math.pow(.5,1.6)*1.4,lastT=0,recent=0;
let wave='bloop',trig='clicks',startMode='swell',tickStyle='tick',swellT=0,lastMove=0,fxOn={};
const BASE={f:240,g:.9},SWELL={f:480,g:1.08};
function noiseBuf(kind,sec=4){const n=ctx.sampleRate*sec,b=ctx.createBuffer(2,n,ctx.sampleRate);
 for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch);let l=0,b0=0,b1=0,b2=0;
  for(let i=0;i<n;i++){const w=Math.random()*2-1;
   if(kind==='brown'){l=(l+.02*w)/1.02;d[i]=l*3.2}
   else if(kind==='pink'){b0=.99765*b0+w*.099;b1=.963*b1+w*.2965;b2=.57*b2+w*1.0526;d[i]=(b0+b1+b2+w*.1848)*.11}
   else d[i]=w*.5}}return b}
let bufs={};
function init(){if(ctx)return;ctx=new (window.AudioContext||window.webkitAudioContext)();
 master=ctx.createGain();master.gain.value=0;const comp=ctx.createDynamicsCompressor();comp.threshold.value=-18;comp.ratio.value=3;master.connect(comp);comp.connect(ctx.destination);
 bufs.brown=noiseBuf('brown');bufs.pink=noiseBuf('pink');bufs.white=noiseBuf('white',2)}
/* safe noise source: offset always inside the buffer */
function noise(kind,t,dur){const s=ctx.createBufferSource(),b=bufs[kind];s.buffer=b;s.start(t,Math.random()*Math.max(0,b.duration-dur-.05));s.stop(t+dur);return s}
function pan(x){const p=ctx.createStereoPanner?ctx.createStereoPanner():null;if(p)p.pan.value=Math.max(-.8,Math.min(.8,(x/innerWidth*2-1)*.7));return p}
function chain(nodes,x){const p=x==null?null:pan(x);const list=p?[...nodes,p]:nodes;for(let i=0;i<list.length-1;i++)list[i].connect(list[i+1]);list[list.length-1].connect(master);return p}
function env(g,t,peak,a,d){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(.0004,t+a+d)}
function lpf(f,q=.7){const b=ctx.createBiquadFilter();b.type='lowpass';b.frequency.value=f;b.Q.value=q;return b}
function bpf(f,q=1){const b=ctx.createBiquadFilter();b.type='bandpass';b.frequency.value=f;b.Q.value=q;return b}
function osc(type,f){const o=ctx.createOscillator();o.type=type;o.frequency.value=f;return o}
function hold(p,t){p.cancelScheduledValues(t);p.setValueAtTime(p.value,t)}

/* ---------- ambience ---------- */
function startAmb(){if(amb)return;const out=ctx.createGain();out.gain.value=0;out.connect(master);
 const n=ctx.createBufferSource();n.buffer=bufs.brown;n.loop=true;const lp=lpf(BASE.f);const dlp=lpf(20000,.5);n.connect(lp);lp.connect(dlp);dlp.connect(out);n.start();
 const o=osc('sine',49),hg=ctx.createGain();hg.gain.value=.05;o.connect(hg);hg.connect(dlp);o.start();amb={out,lp,dlp,nodes:[n,lp,dlp,o,hg,out]}}
function stopAmb(){if(!amb)return;const a=amb;amb=null;clearTimeout(swellT);const t=ctx.currentTime;hold(a.out.gain,t);a.out.gain.setTargetAtTime(0,t,.4);setTimeout(()=>a.nodes.forEach(x=>{try{x.stop&&x.stop()}catch(e){}x.disconnect()}),2500)}
function swell(t,fromZero){[[amb.lp.frequency,SWELL.f,BASE.f,fromZero?BASE.f:null],[amb.out.gain,SWELL.g,BASE.g,fromZero?.0001:null]].forEach(([p,a,b,z])=>{hold(p,t);if(z!=null)p.setValueAtTime(z,t);p.linearRampToValueAtTime(a,t+9);p.setValueAtTime(a,t+13);p.linearRampToValueAtTime(b,t+26)})}
function scheduleSwell(ms){clearTimeout(swellT);swellT=setTimeout(()=>{if(!amb||!on)return;swell(ctx.currentTime,false);scheduleSwell((26+60+Math.random()*30)*1000)},ms)}
/* how the ambience begins on load, replay, or when sound is switched on */
let introLen=4;
function shortSwell(t,d){[[amb.lp.frequency,SWELL.f,BASE.f,BASE.f],[amb.out.gain,SWELL.g,BASE.g,.0001]].forEach(([p,a,b,z])=>{hold(p,t);p.setValueAtTime(z,t);p.linearRampToValueAtTime(a,t+d*.35);p.setValueAtTime(a,t+d*.5);p.linearRampToValueAtTime(b,t+d)})}
function begin(){if(!amb)return;const t=ctx.currentTime;
 if(startMode==='swell'){shortSwell(t,introLen);scheduleSwell((introLen+60+Math.random()*25)*1000)}
 else{hold(amb.out.gain,t);amb.out.gain.setValueAtTime(.0001,t);amb.out.gain.linearRampToValueAtTime(BASE.g,t+4);hold(amb.lp.frequency,t);amb.lp.frequency.setValueAtTime(BASE.f,t);scheduleSwell((60+Math.random()*25)*1000)}}

/* ---------- wave / splash sounds ---------- */
function bubbleLow(t,x,s){const o=osc('sine',180+Math.random()*240),g=ctx.createGain(),l=lpf(900);const f=o.frequency.value;o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*1.5,t+.05+Math.random()*.04);env(g,t,.09*s,.003,.09);chain([o,l,g],x);o.start(t);o.stop(t+.16)}
const WAVES={
 bloop(x,s){const t=ctx.currentTime+LA,o=osc('sine',0),l=lpf(520),g=ctx.createGain();const f=140+Math.random()*80;o.frequency.setValueAtTime(f*1.6,t);o.frequency.exponentialRampToValueAtTime(f*.55,t+.35);env(g,t,.32*s,.015,.6);chain([o,l,g],x);o.start(t);o.stop(t+.65);
  const n=noise('pink',t,.85),l2=lpf(380),ng=ctx.createGain();env(ng,t,.18*s,.005,.8);chain([n,l2,ng],x)},
 gurgle(x,s){const t=ctx.currentTime+LA,n=noise('pink',t,.4),l=lpf(700),g=ctx.createGain();env(g,t,.2*s,.01,.3);chain([n,l,g],x);
  const k=4+Math.round(5*s);for(let i=0;i<k;i++)bubbleLow(t+.02+Math.random()*.35,x+(Math.random()-.5)*60,s)},
 roll(x,s){const t=ctx.currentTime+LA,n=noise('pink',t,2.1),l=lpf(200,1.1),g=ctx.createGain();l.frequency.setValueAtTime(200,t);l.frequency.linearRampToValueAtTime(900,t+.7);l.frequency.exponentialRampToValueAtTime(180,t+1.9);
  env(g,t,.42*s,.55,1.35);const p=chain([n,l,g],x);if(p){const c=p.pan.value;p.pan.setValueAtTime(Math.max(-.8,c-.35),t);p.pan.linearRampToValueAtTime(Math.min(.8,c+.35),t+1.9)}},
 slosh(x,s){const t=ctx.currentTime+LA,n=noise('brown',t,1),g=ctx.createGain(),mix=ctx.createGain();mix.gain.value=1;
  const b1=bpf(320,3),b2=bpf(680,3);n.connect(b1);n.connect(b2);b1.connect(mix);b2.connect(mix);mix.connect(g);const p=pan(x);(p?g.connect(p)||p:g).connect(master);
  const lf=osc('sine',6.5),lg=ctx.createGain();lg.gain.value=.25*s;lf.connect(lg);lg.connect(g.gain);env(g,t,.5*s,.05,.85);lf.start(t);lf.stop(t+1)},
 deep(x,s){const t=ctx.currentTime+LA,o=osc('sine',0),g=ctx.createGain();o.frequency.setValueAtTime(62,t);o.frequency.exponentialRampToValueAtTime(34,t+.5);env(g,t,.42*s,.02,.7);chain([o,g],x);o.start(t);o.stop(t+.8);
  const n=noise('brown',t,1),l=lpf(420),ng=ctx.createGain();env(ng,t,.3*s,.04,.9);chain([n,l,ng],x);for(let i=0;i<3;i++)bubbleLow(t+.12+Math.random()*.3,x,s*.8)}
};
function play(x,y,s,kind){if(!on||!ctx)return;const now=performance.now();
 if(kind==='move'){if(trig==='clicks')return;if(trig==='big'){if(s<.75||now-lastMove<1600)return;lastMove=now}}
 recent=Math.max(0,recent-(now-lastT)/140);if(recent>6)return;recent+=1;lastT=now;
 const big=kind==='splash'||kind==='drop';WAVES[wave](x,Math.max(.25,s));if(big&&wave==='bloop')setTimeout(()=>WAVES.bloop(x+40,.5*s),90)}

/* ---------- hover ticks ---------- */
let lastTick=0;
const TICKS={
 soft(s){const t=ctx.currentTime+LA,n=noise('white',t,.03),l=lpf(1600),g=ctx.createGain();env(g,t,.35*s,.001,.022);chain([n,l,g])},
 tick(s){const t=ctx.currentTime+LA,n=noise('white',t,.02),b=bpf(3200,3),g=ctx.createGain();env(g,t,.55*s,.0005,.012);chain([n,b,g])},
 wood(s){const t=ctx.currentTime+LA,n=noise('white',t,.05),b=bpf(1150,9),g=ctx.createGain();env(g,t,1.1*s,.0005,.035);chain([n,b,g])},
 tap(s){const t=ctx.currentTime+LA,o=osc('sine',0),g=ctx.createGain(),l=lpf(600);o.frequency.setValueAtTime(260,t);o.frequency.exponentialRampToValueAtTime(140,t+.04);env(g,t,.22*s,.002,.05);chain([o,l,g]);o.start(t);o.stop(t+.08)},
 pebble(s){const t=ctx.currentTime+LA;[0,.018].forEach((d,i)=>{const n=noise('white',t+d,.02),b=bpf(2300-i*500,6),g=ctx.createGain();env(g,t+d,(i?.35:.6)*s,.0005,.012);chain([n,b,g])})}
};
function tick(strong){if(!on||!ctx)return;if(ctx.state!=='running')ctx.resume();const now=performance.now();if(now-lastTick<45)return;lastTick=now;TICKS[tickStyle](strong?1.5:1)}

/* ---------- sfx experiments ---------- */
const FX={
 rise(x){const t=ctx.currentTime+LA,n=noise('pink',t,.7),b=bpf(300,.9),g=ctx.createGain();b.frequency.setValueAtTime(260,t);b.frequency.exponentialRampToValueAtTime(1100,t+.55);env(g,t,.16,.2,.45);chain([n,b,lpf(1400),g],x)},
 navIn(){const t=ctx.currentTime+LA,o=osc('sine',0),g=ctx.createGain();o.frequency.setValueAtTime(95,t);o.frequency.exponentialRampToValueAtTime(48,t+.3);env(g,t,.3,.01,.35);chain([o,g]);o.start(t);o.stop(t+.4);const n=noise('brown',t,.5),ng=ctx.createGain();env(ng,t,.2,.01,.4);chain([n,lpf(500),ng])},
 navOut(){const t=ctx.currentTime+LA,n=noise('pink',t,.45),b=bpf(900,.8),g=ctx.createGain();b.frequency.setValueAtTime(900,t);b.frequency.exponentialRampToValueAtTime(250,t+.4);env(g,t,.09,.12,.3);chain([n,b,g])},
 slide(x,closing){const t=ctx.currentTime+LA,n=noise('brown',t,.8),l=lpf(200,1.2),g=ctx.createGain();l.frequency.setValueAtTime(200,t);l.frequency.linearRampToValueAtTime(650,t+.3);l.frequency.exponentialRampToValueAtTime(200,t+.75);env(g,t,.35,.15,.6);
  const p=chain([n,l,g],0);if(p){p.pan.setValueAtTime(closing?.3:-.7,t);p.pan.linearRampToValueAtTime(closing?-.7:.3,t+.7)}},
 shimmer(){const t=ctx.currentTime+LA;[1800,2410,3120].forEach((f,i)=>{const o=osc('sine',f),g=ctx.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.018,t+.35+i*.1);g.gain.exponentialRampToValueAtTime(.0003,t+1.9);const p=chain([o,g],0);if(p){p.pan.setValueAtTime(-.7,t);p.pan.linearRampToValueAtTime(.4,t+1.9)}o.start(t);o.stop(t+2)})},
 palOpen(){const t=ctx.currentTime+LA;for(let i=0;i<4;i++)bubbleLow(t+i*.05,innerWidth/2,.9)},
 palClose(){const t=ctx.currentTime+LA,n=noise('brown',t,.2),g=ctx.createGain();env(g,t,.15,.005,.14);chain([n,lpf(500),g])},
 pop(){const t=ctx.currentTime+LA,o=osc('sine',0),g=ctx.createGain();o.frequency.setValueAtTime(420,t);o.frequency.exponentialRampToValueAtTime(760,t+.06);env(g,t,.14,.004,.14);chain([o,lpf(1200),g]);o.start(t);o.stop(t+.2)},
 sonar(){const t=ctx.currentTime+LA,o=osc('sine',880),g=ctx.createGain(),l=lpf(1500),dl=ctx.createDelay(1),fb=ctx.createGain();env(g,t,.06,.01,.45);dl.delayTime.value=.26;fb.gain.value=.4;
  o.connect(g);g.connect(l);l.connect(master);l.connect(dl);dl.connect(fb);fb.connect(dl);dl.connect(master);o.start(t);o.stop(t+.5);setTimeout(()=>{fb.gain.value=0;dl.disconnect()},3000)},
 out(x){const t=ctx.currentTime+LA,n=noise('pink',t,.5),b=bpf(200,.8),g=ctx.createGain();b.frequency.setValueAtTime(200,t);b.frequency.exponentialRampToValueAtTime(2200,t+.4);env(g,t,.12,.3,.15);chain([n,b,g],x)}
};
function fx(name,a,b){if(!on||!ctx||!fxOn[name])return;FX[name==='navOut'?'navOut':name](a,b)}
function depth(f){if(!amb)return;const t=ctx.currentTime;amb.dlp.frequency.setTargetAtTime(fxOn.depth?Math.max(260,1400-f*1150):20000,t,.3)}

let ducked=false;
function duck(v){ducked=v;if(!ctx||!on)return;const t=ctx.currentTime;master.gain.cancelScheduledValues(t);master.gain.setTargetAtTime(v?0:vol,t,v?.6:.4)}
function setOn(v){init();on=v;if(ctx.state==='suspended')ctx.resume();const t=ctx.currentTime;master.gain.cancelScheduledValues(t);master.gain.setTargetAtTime(on&&!ducked?vol:0,t,.35);
 if(on&&!amb){startAmb();begin()}if(!on)setTimeout(()=>{if(!on)stopAmb()},1500)}
return{duck,setOn,play,tick,fx,depth,begin:sec=>{if(sec)introLen=Math.max(2.5,sec);if(on&&amb)begin()},
 setWave:w=>{wave=w},setTrig:m=>{trig=m},setStart:m=>{startMode=m},setTick:s=>{tickStyle=s},setFx:o=>{fxOn=o},get on(){return on},get state(){return ctx?ctx.state:'none'},resume:()=>{init();return ctx.resume()}};
})();
