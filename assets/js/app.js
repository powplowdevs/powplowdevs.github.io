function startApp(){
const S=SITE,app=document.getElementById('app'),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const touch=matchMedia('(hover:none)').matches;
const ext='target="_blank" rel="noreferrer"';
const BR={github:'#b3bcc5',medium:'#d6d6d6',linkedin:'#2d8cff',mail:'#ea6a5a',doc:'#7fd1e6',school:'#7fd1e6',work:'#7fd1e6',badge:'#f5c451',pen:'#7fd1e6',linux:'#f5c451',cpp:'#4a8fd8',csharp:'#a55fd1'};
const lumi=h=>{const n=parseInt(h.slice(1),16),r=(n>>16&255)/255,g=(n>>8&255)/255,b=(n&255)/255;return .2126*r+.7152*g+.0722*b};
const B=k=>{if(window.COLORS&&COLORS[k])return COLORS[k];if(BR[k])return BR[k];const c=ICONS[k]&&ICONS[k].c;if(!c)return '#e8eef1';return lumi(c)<.22?'#aab4bd':c};
const ic=(k,x='')=>{const g=ICONS[k];if(!g)return '';return `<svg class="ic ${x}" viewBox="${g.vb}" style="--b:${B(k)}" aria-hidden="true">${g.p}</svg>`};
const STAR='<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z"/></svg>';
const CHEV='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',CHEVR='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
const gh=r=>'https://github.com/'+r;
/* every project card comes from site.json; set "building": true on one to give it the Currently building tag */
const ALLP=S.projects;
const usedIn=k=>ALLP.filter(p=>p.s.includes(k)).map(p=>p.n);
const coursesFor=k=>(S.courses||[]).filter(c=>c.s.includes(k));
const plural=(n,w)=>n+' '+w+(n>1?'s':'');
const NAV=[['now',TEXT.navNow,null,'doc'],['projects',TEXT.navProjects,ALLP.length,'github'],['stack',TEXT.navStack,Object.values(S.stack).flat().length,'cpp'],['history',TEXT.navHistory,S.history.length,'work'],['certs',TEXT.navCerts,S.certs.length,'badge'],['writing',TEXT.navWriting,S.writing.length,'pen']];

const links=()=>`<ul class="lk">${S.links.map(l=>`<li><a href="${l.u}" ${ext}>${ic(l.k)}<strong>${l.l}</strong><small>${l.h}</small></a>${l.copy?`<button class="cp" data-copy="${l.copy}" aria-label="Copy email address">Copy</button>`:''}</li>`).join('')}</ul>`;
const tl=(x='')=>`<ul class="tl ${x}">${S.history.map(h=>`<li><span class="n">${ic(h.t==='edu'?'school':'work')}</span><b>${h.a}</b><span>${h.b}</span><em>${h.d}</em></li>`).join('')}</ul>`;
const nowBox=()=>{const n=S.now;return `<article class="now sink" id="now" aria-label="${TEXT.buildingTag}">
<div class="vis">${n.image?`<img src="${n.image}" alt="${n.title} screenshot">`:`<div class="grid"></div><div class="glow"></div><div class="ghost" aria-hidden="true">${n.title.split(' ')[0]}</div>`}
<span class="lastc x-commit" id="lastc"><span class="dot g"></span><span>Last commit</span> <b>2 hours ago</b></span><div class="ov"><div class="tag"><span class="dot"></span>${TEXT.buildingTag}</div><h3>${n.title}</h3><div class="kind">${n.kind}</div></div></div>
<div class="body"><p>${n.blurb}</p><div class="side"><div class="chipsi">${n.stack.map(k=>`<span style="--b:${B(k)}">${ic(k)}${LABEL[k]||k}</span>`).join('')}</div><a class="btn solid" href="${n.repo}" ${ext}>${ic('github')}${TEXT.buildingButton}</a></div></div></article>`};
const projects=()=>`<section class="sec" id="projects"><div class="sh rv"><h2>${TEXT.projectsTitle}</h2><span class="cnt">${ALLP.length}</span><p>${TEXT.projectsHint}</p></div><div class="pgrid">
${ALLP.map((p,i)=>`<article class="pc rv" style="--d:${i}"><a class="pl" href="${gh(p.repo)}" ${ext} aria-label="${p.n} on GitHub: ${p.k}"></a>
<div class="cv pat${i%4}"><b aria-hidden="true">${p.cover||p.n.split(' ')[0]}</b>${p.live?`<span class="live"><span class="dot g"></span>${TEXT.liveTag}</span>`:''}${p.building?`<span class="live bld"><span class="dot"></span>${TEXT.buildingTag}</span>`:''}</div>
<div class="bd"><h4>${p.n}<small data-stars="${p.repo}">${STARS[p.repo]?STAR+' '+STARS[p.repo]:''}</small></h4><div class="k">${p.k}</div><div class="d">${p.d}</div>
<div class="ft"><div class="si">${p.s.map(k=>ic(k)).join('')}</div>${(p.links||[]).length?`<div class="xl">${p.links.map(l=>`<a href="${l[1]}" ${ext}>${l[0]}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg></a>`).join('')}</div>`:''}</div></div></article>`).join('')}</div></section>`;
const stack=()=>`<section class="sec" id="stack"><div class="sh rv"><h2>${TEXT.stackTitle}</h2><span class="cnt">${Object.values(S.stack).flat().length}</span></div>
${Object.entries(S.stack).map(([g,ks])=>`<div class="sgrp"><h5 class="rv">${g}</h5><div class="swall">${ks.map((k,i)=>{const u=usedIn(k);const cs=coursesFor(k);const nt=(S.notes||{})[k];const sub=nt?nt[0]:([u.length?plural(u.length,'project'):'',cs.length?plural(cs.length,'course'):''].filter(Boolean).join(', ')||'&nbsp;');const det=[nt?`<div>${nt[1]}${nt[2]?` <a class="nl" href="${nt[2]}" ${ext}>${nt[3]||'Link'} ↗</a>`:''}</div>`:'',u.length?`<div><em>Projects</em>${u.join(', ')}</div>`:'',cs.length?`<div><em>Coursework</em>${cs.map(c=>c.c===c.n?c.n:(/^[A-Z]{2,4} \d/.test(c.c)?c.c+' '+c.n:c.n)+(c.now?' (in progress)':'')).join(', ')}</div>`:''].join('');return `<div class="st rv${GLOW.includes(k)?' gl':''}" style="--d:${i};--b:${B(k)}" tabindex="0">${ic(k)}<strong>${LABEL[k]}</strong><span>${sub}</span>${det?`<div class="used">${det}</div>`:''}</div>`}).join('')}</div></div>`).join('')}</section>`;
const certs=()=>`<section class="sec" id="certs"><div class="sh rv"><h2>${TEXT.certsTitle}</h2><span class="cnt">${S.certs.length}</span></div><div class="cgrid">${S.certs.map((c,i)=>`<div class="cc rv" style="--d:${i};--b:${B(c.i)}">${ic(c.i)}<div><b>${c.a}</b><span>${c.b}</span><em>${c.y}</em>${c.u?`<a class="v" href="${c.u}" ${ext}>View credential</a>`:''}</div>${ic(c.i,'bg')}</div>`).join('')}</div></section>`;
const writing=()=>`<section class="sec" id="writing"><div class="sh rv"><h2>${TEXT.writingTitle}</h2><span class="cnt">${S.writing.length}</span></div>${S.writing.map(w=>`<a class="wc rv" href="${w.u}" ${ext}>${ic('medium')}<div><b>${w.a}</b><span>${w.b}</span></div></a>`).join('')}${TEXT.writingMore?`<div class="wc soon rv">${ic('pen')}${TEXT.writingMore}</div>`:''}</section>`;
const GLOW=window.GLOW_LIST||[];
const kbtn=(t='Search')=>`<button class="kbtn" data-pal>${t}<kbd>Ctrl K</kbd></button>`;

function page(){return `<div class="A" id="A">
<aside aria-label="Profile"><div class="in">
<div class="top sink"><span>${S.handle}</span></div>
<h1 class="nm" id="nm" aria-label="${S.name.join(' ')}">${S.name.map(n=>`<span class="ln" data-t="${n}"><b class="sink">${n}</b></span>`).join('')}</h1>
<p class="intro sink">${S.intro}</p><p class="sub sink">${S.sub}<span class="status">${S.status}.</span></p>
<div class="sink">${links()}</div>
<div class="sink" id="history"><h6 style="margin:0 0 12px;font-weight:400;font-size:12.5px;color:var(--dm)">${TEXT.historyTitle}</h6>${tl()}</div>
<div class="sink" style="margin-top:auto">${kbtn(TEXT.searchButton)}</div>
</div></aside>
<main>
<div class="navw"><nav class="navb" id="navb" aria-label="Sections"><div class="tabs">${NAV.map(n=>`<a href="#${n[0]}" data-t="${n[0]}">${n[1]}${n[2]?`<span class="cnt">${n[2]}</span>`:''}</a>`).join('')}</div>${kbtn()}</nav><span class="navhint" aria-hidden="true"></span></div>
<div class="mini" aria-hidden="true"><div><div class="row"><div class="sink"><h2 class="nmm">${S.name[0]} <span>${S.name[1]}</span></h2><p>${S.intro} ${S.status}.</p></div>
<div class="acts sink">${S.links.map(l=>`<a class="ib" href="${l.u}" ${ext} aria-label="${l.l}" tabindex="-1">${ic(l.k)}</a>`).join('')}</div></div></div></div>
<div style="padding-top:26px">${nowBox()}</div>${projects()}${stack()}
<section class="sec hist-main" id="history-main"><div class="sh rv"><h2>${TEXT.historyTitle}</h2></div>${tl('rv')}</section>
${certs()}${writing()}<footer class="foot rv"><span>${TEXT.footerLeft}</span><span>${TEXT.footerRight}</span></footer></main></div>
<button class="edge" id="edge" aria-label="Hide profile panel" aria-expanded="true"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 7l-5 5 5 5"/></svg><span class="tip">Hide profile</span></button>
<div class="depth x-depth" aria-hidden="true"><i id="dmark"></i><span id="dlab">0 m</span></div>
<div class="xcap x-xray" aria-hidden="true"><b>What you're looking at</b>The water is a 2D wave equation on a <span id="xdim"></span> grid. Every frame, each cell becomes the average of its four neighbours times two, minus its own last height, times a 0.986 damping factor. Blue cells are crests, pink are troughs. A shader turns the slopes into the light you normally see.</div>`}

/* ---------- palette ---------- */
const pal=document.getElementById('pal'),pin=document.getElementById('pin'),pls=document.getElementById('pls'),toast=document.getElementById('toast');
const say=t=>{toast.textContent=t;toast.classList.add('on');clearTimeout(say.t);say.t=setTimeout(()=>toast.classList.remove('on'),1600)};
const jump=id=>{const A=document.getElementById('A');if(id==='history'&&A.classList.contains('closed'))id='history-main';const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'})};
const open=u=>window.open(u,'_blank','noopener');
function copy(t){(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>{Sound.fx('pop');say('Email copied')},()=>say(t))}
const CMDS=()=>[...NAV.map(n=>({l:n[1],i:n[3],h:'Section',f:()=>jump(n[0])})),...ALLP.map(p=>({l:p.n,i:p.s[0],h:p.k,f:()=>open(gh(p.repo))})),
 ...ALLP.flatMap(p=>(p.links||[]).map(l=>({l:p.n+': '+l[0],i:p.s[0],h:l[1].replace(/^https?:\/\//,'').replace(/\/$/,''),f:()=>open(l[1])}))),
 ...Object.values(S.stack).flat().map(k=>({l:LABEL[k],i:k,h:(S.notes&&S.notes[k])?S.notes[k][1]:[usedIn(k).length?'Used in '+usedIn(k).join(', '):'',coursesFor(k).length?plural(coursesFor(k).length,'course'):''].filter(Boolean).join(' · ')||'Skill',f:()=>jump('stack')})),
 ...(S.courses||[]).map(c=>({l:(/^[A-Z]{2,4} \d/.test(c.c)?c.c+' ':'')+c.n,i:'school',h:c.at+(c.now?', in progress':''),f:()=>jump('stack')})),
 ...S.links.map(l=>({l:'Open '+l.l,i:l.k,h:l.h,f:()=>open(l.u)})),{l:'Copy email address',i:'mail',h:'Clipboard',f:()=>copy('ayoubsmohamed07@gmail.com')},
 {l:'Toggle profile panel',i:'doc',h:'Layout',f:()=>toggleSide()}];
const SUDO={l:'sudo hire ayoub',i:'badge',h:'Permission granted',f:()=>{Ocean.flood();say('Permission granted. Opening resume.');setTimeout(()=>open(S.links[0].u),1200)}};
let sel=0,list=[];
function draw(){const q=pin.value.toLowerCase().trim();list=(document.body.classList.contains('x-eggs')&&'sudo hire ayoub'.startsWith(pin.value.toLowerCase().trim())&&pin.value.trim().length>=2?[SUDO]:[]).concat(CMDS()).filter(c=>(c.l+' '+c.h).toLowerCase().includes(q)).slice(0,40);sel=Math.min(sel,Math.max(list.length-1,0));
 pls.innerHTML=list.length?list.map((c,k)=>`<li class="${k===sel?'sel':''}" data-k="${k}" role="option">${ic(c.i)}${c.l}<small>${c.h}</small></li>`).join(''):'<li>No matches. Try "Go" or "resume".</li>';const s=pls.querySelector('.sel');s&&s.scrollIntoView({block:'nearest'})}
function palOpen(){Sound.fx('palOpen');pal.classList.add('on');pin.value='';sel=0;draw();setTimeout(()=>pin.focus(),30)}
function palClose(){if(pal.classList.contains('on'))Sound.fx('palClose');pal.classList.remove('on')}
function run(k){const c=list[k];if(!c)return;palClose();c.f()}
addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();pal.classList.contains('on')?palClose():palOpen()}else if(e.key==='Escape')palClose();else if(e.key==='['&&!e.target.closest('input'))toggleSide()});
pin.addEventListener('input',()=>{sel=0;draw()});
pin.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){sel=Math.min(sel+1,list.length-1);draw();e.preventDefault()}else if(e.key==='ArrowUp'){sel=Math.max(sel-1,0);draw();e.preventDefault()}else if(e.key==='Enter')run(sel)});
pls.addEventListener('click',e=>{const x=e.target.closest('li[data-k]');if(x)run(+x.dataset.k)});pal.addEventListener('click',e=>{if(e.target===pal)palClose()});

/* ---------- name fit + styles ---------- */
function fitName(){const el=document.getElementById('nm');if(!el)return;const pe=el.parentElement,cs=getComputedStyle(pe);const col=pe.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);if(col<=0)return;el.style.setProperty('--nfs','100px');
 /* offsetWidth ignores the rise animation's transform, so the measurement is the real text width */
 const w=Math.max(...[...el.querySelectorAll('.ln b')].map(b=>b.offsetWidth));if(!w)return;el.style.setProperty('--nfs',Math.min(128,Math.max(40,100*col/w*.98))+'px')}
/* refit whenever the web font finishes loading or the column/name changes size */
let nameRO=null;function watchName(){const el=document.getElementById('nm');if(!el||!window.ResizeObserver)return;if(nameRO)nameRO.disconnect();let pend=0;
 nameRO=new ResizeObserver(()=>{if(pend)return;pend=requestAnimationFrame(()=>{pend=0;fitName()})});nameRO.observe(el.parentElement)}
if(document.fonts){document.fonts.addEventListener&&document.fonts.addEventListener('loadingdone',()=>fitName());document.fonts.load('800 100px Archivo').then(()=>fitName()).catch(()=>{})}
addEventListener('resize',fitName);document.fonts&&document.fonts.ready.then(fitName);
addEventListener('pointermove',e=>{const nm=document.getElementById('nm');if(!nm||!document.body.classList.contains('ns-moonlit'))return;const r=nm.getBoundingClientRect();
 nm.querySelectorAll('.ln b').forEach(b=>{const q=b.getBoundingClientRect();b.style.setProperty('--nx',((e.clientX-q.left)/q.width*100)+'%');b.style.setProperty('--ny',((e.clientY-q.top)/q.height*100)+'%')})},{passive:true});

/* ---------- sidebar ---------- */
function toggleSide(force){const A=document.getElementById('A');const c=force!==undefined?force:!A.classList.contains('closed');A.classList.toggle('closed',c);
 const mini=A.querySelector('.mini');mini.setAttribute('aria-hidden',!c);mini.querySelectorAll('a,button').forEach(x=>x.tabIndex=c?0:-1);
 A.querySelector('aside').setAttribute('aria-hidden',c);A.querySelectorAll('aside a,aside button').forEach(x=>x.tabIndex=c?-1:0);
 try{localStorage.setItem('pf5side',c?'1':'0')}catch(e){}document.body.classList.toggle('side-closed',c);Sound.fx('slide',0,c);const ed=document.getElementById('edge');if(ed){ed.setAttribute('aria-expanded',!c);ed.setAttribute('aria-label',c?'Show profile panel':'Hide profile panel');ed.querySelector('.tip').textContent=c?'Show profile':'Hide profile'}setTimeout(revealSoon,800);
 if(!reduce){const r=(c?mini:A.querySelector('aside')).getBoundingClientRect();setTimeout(()=>{for(let i=0;i<10;i++)Ocean.bubble(Math.max(20,r.left)+Math.random()*Math.min(r.width||300,500),Math.min(innerHeight-10,(c?260:innerHeight*.6)),1,0)},300)}}

/* ---------- nav show/hide ---------- */
let navState={shown:false,hover:false,ready:false,t:0};
function navShow(bub=true){const n=document.getElementById('navb');if(!n||navState.shown)return;navState.shown=true;n.classList.add('show');Sound.fx('navIn');
 if(bub&&!reduce){const r=n.getBoundingClientRect();setTimeout(()=>{for(let i=0;i<14;i++)Ocean.bubble(r.left+Math.random()*r.width,r.bottom+4+Math.random()*10,1,0,.7)},180)}}
function navHide(){const n=document.getElementById('navb');if(!n||!navState.shown||navState.hover||n.contains(document.activeElement)||reduce)return;navState.shown=false;n.classList.remove('show');Sound.fx('navOut')}
function navLater(ms=900){clearTimeout(navState.t);navState.t=setTimeout(navHide,ms)}
addEventListener('pointermove',e=>{if(!navState.ready||touch)return;const n=document.getElementById('navb');if(!n)return;const main=n.closest('main').getBoundingClientRect();
 const near=e.clientY<86&&e.clientX>main.left;const over=n.contains(e.target);navState.hover=over;
 if(near||over){clearTimeout(navState.t);navShow()}else if(navState.shown&&e.clientY>150)navLater()},{passive:true});
let lastY=scrollY;addEventListener('scroll',()=>{if(!navState.ready)return;const y=scrollY;if(touch){if(y<lastY-6)navShow(false);else if(y>lastY+6){navState.shown&&(navState.shown=true,navHide())}}lastY=y},{passive:true});
document.addEventListener('focusin',e=>{const n=document.getElementById('navb');if(n&&n.contains(e.target))navShow(false)});
document.addEventListener('focusout',()=>navLater(1200));

/* ---------- render + intro ---------- */
let introTimers=[],cleanup=[];const on=(t,e,f,o)=>{t.addEventListener(e,f,o);cleanup.push(()=>t.removeEventListener(e,f,o))};
function render(){cleanup.forEach(f=>f());cleanup=[];app.innerHTML=page();
 let closed=false;try{closed=localStorage.getItem('pf5side')==='1'}catch(e){}if(closed&&innerWidth>980)toggleSide(true);
 fitName();watchName();if(!window.__holdIntro)intro();
 app.querySelectorAll('[data-pal]').forEach(b=>on(b,'click',palOpen));
 app.querySelectorAll('[data-copy]').forEach(b=>on(b,'click',()=>{copy(b.dataset.copy);b.textContent='Copied';setTimeout(()=>b.textContent='Copy',1400)}));
 
 const vis=app.querySelector('.now .vis');if(vis)on(vis,'mousemove',e=>{const r=vis.getBoundingClientRect();vis.style.setProperty('--mx',e.clientX-r.left+'px');vis.style.setProperty('--my',e.clientY-r.top+'px')});
 on(window,'scroll',revealSoon,{passive:true});on(window,'resize',revealSoon);
 on(document.getElementById('edge'),'click',()=>toggleSide());
 const navs=[...app.querySelectorAll('.navb [data-t]')];
 const mark=()=>{let cur=navs[0].dataset.t;navs.forEach(a=>{let id=a.dataset.t;if(id==='history'&&document.getElementById('A').classList.contains('closed'))id='history-main';const s=document.getElementById(id);if(s&&s.getBoundingClientRect().top<=160&&s.offsetParent!==null)cur=a.dataset.t});navs.forEach(a=>a.classList.toggle('on',a.dataset.t===cur))};
 on(window,'scroll',mark,{passive:true});mark();navs.forEach(a=>on(a,'click',e=>{e.preventDefault();jump(a.dataset.t)}));
}
let introDone=false,rq=0;
let lastSmall=0;
function splash(el,st){const r=el.getBoundingClientRect();const big=r.width*r.height>=40000||el.id==='now';
 if(big){Ocean.surface(el,st);return}
 const now=performance.now();if(now-lastSmall<900)return;lastSmall=now;
 const grp=el.closest('.swall,.cgrid,.lk,.sgrp,.tl,section,aside .in')||el;Ocean.surface(grp===el?el:grp,st*.6)}
function reveal(){rq=0;if(!introDone)return;app.querySelectorAll('.rv:not(.on),.tl:not(.on)').forEach(el=>{if(el.offsetParent===null)return;const r=el.getBoundingClientRect();if(r.top<innerHeight*.92&&r.bottom>0){el.classList.add('on');if(el.classList.contains('sh'))Sound.fx('rise',r.left+r.width/2);if(el.classList.contains('rv')){const d=(+el.style.getPropertyValue('--d')||0)*70;setTimeout(()=>splash(el,.5),d+800)}}})}
function revealSoon(){if(!rq)rq=requestAnimationFrame(reveal)}
function sheen(){const b=document.querySelector('.nm .ln+.ln b');if(!b)return;Sound.fx('shimmer');b.classList.remove('sweep');void b.offsetWidth;b.classList.add('sweep')}
function intro(){introDone=false;introTimers.forEach(clearTimeout);introTimers=[];navState.ready=false;navState.shown=false;const n=document.getElementById('navb');n&&n.classList.remove('show');
 document.body.classList.remove('go');app.querySelectorAll('.risen').forEach(e=>e.classList.remove('risen'));app.querySelectorAll('.rv').forEach(r=>r.classList.remove('on'));
 window.__introBoost&&window.__introBoost();document.body.classList.add('sea-reset');document.body.classList.remove('sea-on','chrome-on');void document.body.offsetWidth;document.body.classList.remove('sea-reset');introTimers.push(setTimeout(()=>document.body.classList.add('sea-on'),120));
 const closedNow=document.getElementById('A').classList.contains('closed');const els=[...app.querySelectorAll('.sink')].filter(e=>(e.offsetParent!==null||e.id==='now')&&!(closedNow&&e.closest('aside'))&&!(!closedNow&&e.closest('.mini')));const gap=110,start=1150,dur=2000;
 const order=[...els.filter(e=>e.closest('.nm')),...els.filter(e=>e.id==='now'),...els.filter(e=>!e.closest('.nm')&&e.id!=='now')];
 order.forEach((el,k)=>{const t=start+k*gap;el.style.setProperty('--t',t+'ms');introTimers.push(setTimeout(()=>splash(el,el.id==='now'?1.2:.9),t+dur*.62))});
 void app.offsetWidth;requestAnimationFrame(()=>document.body.classList.add('go'));
 const end=start+order.length*gap+dur*.7;
 Sound.begin(end/1000);
 introTimers.push(setTimeout(()=>{introDone=true;reveal()},start+Math.min(order.length,6)*gap+600));
 const nb=document.querySelector('.nm .ln+.ln b');if(nb)nb.classList.remove('sweep');
 introTimers.push(setTimeout(()=>window.__soundHello&&window.__soundHello(),end+1600));
 introTimers.push(setTimeout(()=>{navState.ready=true;navShow();document.body.classList.add('chrome-on');navLater(2600)},end));
 if(reduce){navState.ready=true;navShow(false);introDone=true;reveal();document.body.classList.add('sea-on','chrome-on')}}
app.addEventListener('animationend',e=>{if(e.animationName.indexOf('rise')===0){e.target.classList.add('risen');if(e.target.matches('.nm .ln+.ln b'))setTimeout(sheen,60)}});

/* ---------- name hover replays the sheen ---------- */

/* ---------- depth gauge ---------- */
let lastK=0;function depth(){const m=document.getElementById('dmark'),l=document.getElementById('dlab');if(!m)return;const f=Math.min(1,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight));Sound.depth(f);const k=Math.floor(f*3688/1000);if(k!==lastK){if(k>lastK)Sound.fx('sonar');lastK=k}m.style.top=(f*100)+'%';l.style.top=(f*100)+'%';l.textContent=Math.round(f*3688).toLocaleString()+' m'}
addEventListener('scroll',depth,{passive:true});
/* ---------- easter eggs ---------- */
const KON=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let kp=0;
addEventListener('keydown',e=>{if(!document.body.classList.contains('x-eggs'))return;kp=(e.key===KON[kp])?kp+1:(e.key===KON[0]?1:0);if(kp===KON.length){kp=0;Ocean.flood();say('Flood unlocked')}});
/* ---------- last commit (live on GitHub Pages, sample here) ---------- */
function lastCommit(){const el=document.getElementById('lastc');if(!el)return;const repo=S.now.repo.replace('https://github.com/','');
 fetch('https://api.github.com/repos/'+repo+'/commits?per_page=1').then(r=>r.ok?r.json():Promise.reject()).then(j=>{const t=(Date.now()-new Date(j[0].commit.author.date))/1000;const f=t<3600?Math.round(t/60)+' minutes':t<86400?Math.round(t/3600)+' hours':Math.round(t/86400)+' days';el.querySelector('b').textContent=f+' ago'}).catch(()=>{})}
/* ---------- live star counts from GitHub (cached for an hour) ---------- */
function liveStars(){const apply=m=>{Object.entries(m).forEach(([repo,n])=>{STARS[repo]=n;document.querySelectorAll(`[data-stars="${repo}"]`).forEach(el=>{el.innerHTML=n?STAR+' '+n:''})})};
 let c=null;try{c=JSON.parse(localStorage.getItem('pfstars')||'null')}catch(e){}if(c&&c.m)apply(c.m);if(c&&Date.now()-c.t<3600e3)return;
 fetch('https://api.github.com/users/'+S.handle+'/repos?per_page=100').then(r=>r.ok?r.json():Promise.reject()).then(list=>{const m={};list.forEach(r=>{m[r.full_name]=r.stargazers_count});
  const want={};[...ALLP.map(p=>p.repo)].forEach(k=>{const hit=Object.keys(m).find(f=>f.toLowerCase()===k.toLowerCase());if(hit)want[k]=m[hit]});apply(want);try{localStorage.setItem('pfstars',JSON.stringify({t:Date.now(),m:want}))}catch(e){}}).catch(()=>{})}
/* ---------- controls ---------- */
const sw=document.getElementById('sw');
/* sound choices are locked in: bloop waves on intro + clicks, swell start, these sfx on */
let sc={on:false,seen:false};try{Object.assign(sc,JSON.parse(localStorage.getItem('pf_sound')||'{}'))}catch(e){}sc.on=!!sc.on;

if(sw)sw.remove();
const snd=document.getElementById('snd');
const FXON={depth:true,rise:true,navIn:true,navOut:true,slide:true,pop:true,out:true};

function ssync(){snd.setAttribute('aria-pressed',sc.on);snd.setAttribute('aria-label',sc.on?'Mute sound':'Turn sound on');snd.querySelector('.tip').textContent=sc.on?'Sound on':'Sound off';
 Sound.setFx(FXON);depth();try{localStorage.setItem('pf_sound',JSON.stringify({on:sc.on,seen:sc.seen}))}catch(e){}}
function ensureOn(){if(!sc.on){sc.on=true;Sound.setOn(true)}}
window.__introBoost=()=>{Ocean.boost(.95,5,2.5);Ocean.introWaves()};
snd.addEventListener('click',()=>{snd.classList.remove('hello');
 /* first time someone turns sound on: restart the page so they get the whole intro with sound */
 if(!sc.on&&!sc.seen){sc.on=true;sc.seen=true;ssync();say('Restarting with sound');document.body.classList.add('sea-reset');document.body.classList.remove('sea-on');scrollTo(0,0);setTimeout(()=>{try{history.scrollRestoration='manual'}catch(e){}location.reload()},450);return}
 sc.on=!sc.on;if(sc.on)sc.seen=true;ssync();Sound.setOn(sc.on);if(sc.on){const r=snd.getBoundingClientRect();setTimeout(()=>Sound.play(r.left,r.top,.8,'drop'),120);for(let i=0;i<8;i++)Ocean.bubble(r.left+Math.random()*r.width,r.top,1,0)}});

/* hover and click ticks on anything interactive */
const HOV='.pc,.st,.lk a,.cc,.wc:not(.soon),.navb a,.ib,.btn,.kbtn,.edge,.xl a,.chipsi span,.tl li,.snd,.cp';let hovEl=null;
/* smart ticks: a hover only ticks if the pointer itself moved to get there.
   When the page scrolls under a still mouse, the hover events arrive at the same coordinates, so they stay silent. */
let px=-9999,py=-9999,lastScroll=0;
addEventListener('scroll',()=>{lastScroll=performance.now()},{passive:true});
addEventListener('pointermove',e=>{px=e.clientX;py=e.clientY},{passive:true});
document.addEventListener('pointerover',e=>{if(e.pointerType&&e.pointerType!=='mouse')return;
 const moved=Math.hypot(e.clientX-px,e.clientY-py)>=2;px=e.clientX;py=e.clientY;
 const el=e.target.closest&&e.target.closest(HOV);
 if(el&&el!==hovEl&&!el.closest('.sw')){hovEl=el;if(moved&&performance.now()-lastScroll>150)Sound.tick(false)}else if(!el)hovEl=null},{passive:true});
document.addEventListener('pointerdown',e=>{if(e.target.closest&&e.target.closest(HOV)&&!e.target.closest('.snd'))Sound.tick(true)},{passive:true});
window.__soundHello=()=>{if(sc.on)return;snd.classList.remove('hello');void snd.offsetWidth;snd.classList.add('hello');snd.querySelector('.tip').textContent='Turn on sound';const r=snd.getBoundingClientRect();setTimeout(()=>{for(let i=0;i<14;i++)Ocean.bubble(r.left+Math.random()*r.width,r.top+r.height*.4,1,0)},250);setTimeout(()=>{snd.classList.remove('hello');ssync()},4200)};
Ocean.onSplash((x,y,s,k)=>Sound.play(x,y,s,k));
let duckT=0;const away=()=>{clearTimeout(duckT);duckT=setTimeout(()=>Sound.duck(true),2000)},back=()=>{clearTimeout(duckT);Sound.duck(false)};
addEventListener('blur',away);addEventListener('focus',back);document.addEventListener('visibilitychange',()=>document.hidden?away():back());
document.addEventListener('click',e=>{const l=e.target.closest&&e.target.closest('a[target=_blank]');if(l)Sound.fx('out',e.clientX)},true);
ssync();
/* sound is on from a previous visit: try to start audio right away. Chrome allows it; Firefox and Safari
   need one click first, so they get a "click to enter" screen and the intro waits for that click. */
if(sc.on){window.__holdIntro=true;Sound.setOn(true);let decided=false;
 const go=()=>{if(decided)return;decided=true;window.__holdIntro=false;intro()};
 const gate=()=>{if(decided)return;if(Sound.state==='running'){go();return}
  const ov=document.createElement('div');ov.className='enter';ov.innerHTML='<button class="enter-go"><span class="enter-ring"></span>Click to enter</button><button class="enter-mute">Continue without sound</button>';document.body.appendChild(ov);
  requestAnimationFrame(()=>ov.classList.add('on'));const close=()=>{ov.classList.remove('on');setTimeout(()=>ov.remove(),500)};
  ov.querySelector('.enter-go').addEventListener('click',()=>{Sound.setOn(true);close();go()});
  ov.querySelector('.enter-mute').addEventListener('click',()=>{sc.on=false;ssync();Sound.setOn(false);close();go()});
  ov.querySelector('.enter-go').focus()};
 Promise.race([Sound.resume().catch(()=>{}),new Promise(r=>setTimeout(r,350))]).then(gate)}
let dt=0;const dg=()=>document.querySelector('.depth');
addEventListener('scroll',()=>{const d=dg();if(!d)return;d.classList.add('on');clearTimeout(dt);dt=setTimeout(()=>d.classList.remove('on'),4000)},{passive:true});
document.body.classList.add('ns-surface','x-depth','dv-split');Ocean.set('abyss');Ocean.setStyle('fizz');Ocean.strength(50);render();depth();liveStars();
}
