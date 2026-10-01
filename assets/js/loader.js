/* Reads site.json and turns it into what the page renders. Edit site.json, not this file. */
function adaptSite(j){
 const P=j.profile||{},T=j.text||{};
 const repoUrl=r=>/^https?:/.test(r)?r:'https://github.com/'+r,repoKey=r=>String(r||'').replace(/^https?:\/\/github\.com\//,'').replace(/\/$/,'');
 window.LABEL={};window.COLORS={};const notes={};
 Object.entries(j.skills||{}).forEach(([k,v])=>{LABEL[k]=v.label||k;if(v.color)COLORS[k]=v.color;
  if(v.note)notes[k]=[v.note,v.noteDetail||'',v.noteLink||'',v.noteLinkText||''];
  if(v.svg){try{const d=new DOMParser().parseFromString(v.svg,'image/svg+xml').documentElement;const vb=d.getAttribute('viewBox')||'0 0 128 128';
   d.querySelectorAll('[fill],[style],[class],[stroke]').forEach(e=>{['fill','style','class','stroke'].forEach(a=>e.removeAttribute(a))});
   ICONS[k]={vb,p:[...d.childNodes].map(n=>n.outerHTML||'').join(''),c:v.color||'#e8eef1'}}catch(e){}}});
 window.STARS={};
 const B=j.currentlyBuilding||{};
 const projects=(j.projects||[]).map(p=>{const key=repoKey(p.repo);if(p.stars!=null&&STARS[key]==null)STARS[key]=p.stars;
  return{building:!!p.building,n:p.name,cover:p.coverText,k:p.kind,d:p.description,s:p.stack||[],repo:key,live:p.live||null,links:(p.links||[]).map(l=>[l.label,l.url])}});
 window.GLOW_LIST=(j.stack&&j.stack.strongGlow)||[];
 window.TEXT=Object.assign({navNow:'Now building',navProjects:'Projects',navStack:'Stack',navHistory:'Experience',navCerts:'Certifications',navWriting:'Writing',projectsTitle:'Projects',projectsHint:'Hover a card for details',stackTitle:'Stack',historyTitle:'Experience and education',certsTitle:'Certifications',writingTitle:'Writing',writingMore:'',buildingTag:'Currently building',buildingButton:'Follow the repo',liveTag:'Live',footerLeft:'',footerRight:'',searchButton:'Search the site'},T);
 const stack={};((j.stack&&j.stack.groups)||[]).forEach(g=>{stack[g.name]=g.skills||[]});
 window.SITE={
  name:[P.firstName||'',P.lastName||''],handle:P.handle||'',intro:P.tagline||'',sub:P.subline||'',status:P.status||'',
  links:(j.links||[]).map(l=>({k:l.icon,l:l.label,h:l.detail||'',u:l.url,copy:l.copy})),
  now:{title:B.title,kind:B.kind||'',blurb:B.description||'',stack:B.stack||[],repo:repoUrl(B.repo||''),image:B.image||null},
  projects,stack,notes,
  courses:(j.courses||[]).map(c=>({c:c.code,n:c.name,at:c.school,s:c.skills||[],now:!!c.inProgress})),
  history:(j.history||[]).map(h=>({t:h.type==='work'?'work':'edu',a:h.title,b:h.place,d:h.dates})),
  certs:(j.certifications||[]).map(c=>({a:c.name,b:c.issuer,y:c.year,i:c.icon||'badge',u:c.url})),
  writing:(j.writing||[]).map(w=>({a:w.title,b:w.summary,u:w.url}))};
 const seo=j.seo||{};if(seo.title)document.title=seo.title;
 if(seo.description){let m=document.querySelector('meta[name=description]');if(!m){m=document.createElement('meta');m.name='description';document.head.appendChild(m)}m.content=seo.description}
 const ga=j.analytics&&j.analytics.googleId;
 if(ga&&/^https?:$/.test(location.protocol)&&!/claude|localhost|127\.0\.0\.1/.test(location.hostname)){const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+ga;document.head.appendChild(s);
  window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',ga)}
}
function bootSite(){
 const inline=document.getElementById('site-data');
 const fromInline=()=>JSON.parse(inline.textContent);
 (location.protocol==='file:'&&inline?Promise.reject():fetch('site.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw 0;return r.json()}))
  .catch(()=>{if(inline)return fromInline();throw new Error('site.json not found')})
  .then(j=>{adaptSite(j);startApp()})
  .catch(e=>{document.getElementById('app').innerHTML=location.protocol==='file:'?'<p style="padding:40px;color:#8b959b;font-family:system-ui">Browsers block reading site.json from a double-clicked file. Run <code>python -m http.server</code> in this folder and open <code>http://localhost:8000</code>.</p>':'<p style="padding:40px;color:#8b959b;font-family:system-ui">Could not load site.json. If you just edited it, check it for a missing comma or quote at jsonlint.com.</p>';console.error(e)})}
