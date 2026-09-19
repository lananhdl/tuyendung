const menu = document.getElementById('megaMenu');
const trigger = document.getElementById('menuTrigger');
const close = document.getElementById('menuClose');
const header = document.getElementById('siteHeader');

function setMenu(open) {
  menu.classList.toggle('open', open);
  menu.setAttribute('aria-hidden', String(!open));
  trigger.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
}
trigger.addEventListener('click', () => setMenu(true));
close.addEventListener('click', () => setMenu(false));
menu.querySelector('.menu-backdrop').addEventListener('click', () => setMenu(false));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// Header: trong suốt trên hero, chuyển nền sáng khi rời hero.
const syncHeader = () => header.classList.toggle('solid', scrollY > 60);
window.addEventListener('scroll', syncHeader, {passive:true});
syncHeader();

// Intro tabs: hover để preview; click để giữ tab trên desktop/mobile.
const tabs = [...document.querySelectorAll('.intro-tab')];
const contents = [...document.querySelectorAll('.tab-content')];
const tabWrap = document.getElementById('introTabs');
let selectedTab = 'about';
function showTab(key, persist=false) {
  selectedTab = persist ? key : selectedTab;
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === key));
  contents.forEach(c => c.classList.toggle('active', c.dataset.content === key));
  const panel=document.getElementById('gioi-thieu');
  if(panel){ panel.classList.remove('tab-about','tab-vision','tab-partners','tab-quality','tab-library','tab-loban'); panel.classList.add('tab-'+key); }
}
tabs.forEach(tab => {
  tab.addEventListener('mouseenter', () => showTab(tab.dataset.tab));
  tab.addEventListener('focus', () => showTab(tab.dataset.tab));
  tab.addEventListener('click', () => showTab(tab.dataset.tab, true));
});
tabWrap.addEventListener('mouseleave', () => showTab(selectedTab));
document.querySelectorAll('.mega-menu [data-tab]').forEach(link => {
  link.addEventListener('click', () => setTimeout(() => showTab(link.dataset.tab, true), 150));
});

// Hero slider: autoplay, hover pause, arrows, dots, keyboard.
const slides = [...document.querySelectorAll('.hero-slide')];
const dots = [...document.querySelectorAll('.hero-dot')];
const current = document.getElementById('heroCurrent');
let heroIndex = 0;
let heroTimer;
function goHero(index, userAction=false) {
  heroIndex = (index + slides.length) % slides.length;
  slides.forEach((s,i) => s.classList.toggle('active', i === heroIndex));
  dots.forEach((d,i) => d.classList.toggle('active', i === heroIndex));
  current.textContent = String(heroIndex + 1).padStart(2,'0');
  const progress = document.getElementById('heroProgressBar');
  if(progress) progress.style.width = `${((heroIndex+1)/slides.length)*100}%`;
  if (userAction) restartHero();
}
function restartHero(){ clearInterval(heroTimer); heroTimer=setInterval(()=>goHero(heroIndex+1),6500); }
dots.forEach(d => d.addEventListener('click',()=>goHero(Number(d.dataset.go),true)));
document.getElementById('heroPrev').addEventListener('click',()=>goHero(heroIndex-1,true));
document.getElementById('heroNext').addEventListener('click',()=>goHero(heroIndex+1,true));
document.addEventListener('keydown',e=>{
  if(document.body.classList.contains('menu-open')) return;
  if(e.key==='ArrowLeft') goHero(heroIndex-1,true);
  if(e.key==='ArrowRight') goHero(heroIndex+1,true);
});
document.querySelector('.hero').addEventListener('mouseenter',()=>clearInterval(heroTimer));
document.querySelector('.hero').addEventListener('mouseleave',restartHero);
restartHero();

// Desktop presentation wheel: chuyển từng scene như một trang trình chiếu.
const sceneIds=['top','gioi-thieu','san-pham','giai-phap','cam-ket','du-an','tin-tuc','lien-he'];
let sceneLock=false;
const sceneIndicator=document.getElementById('sceneIndicator');
function syncScene(){
  let best=0,dist=Infinity;
  sceneIds.forEach((id,i)=>{const el=document.getElementById(id); if(!el)return; const d=Math.abs(el.getBoundingClientRect().top); if(d<dist){dist=d;best=i;}});
  if(sceneIndicator){const n=sceneIndicator.querySelector('.scene-current'); if(n)n.textContent=String(Math.min(best+1,8)).padStart(2,'0');}
}
window.addEventListener('scroll',syncScene,{passive:true}); syncScene();
window.addEventListener('wheel',e=>{
  if(window.innerWidth<1001 || document.body.classList.contains('menu-open') || sceneLock || Math.abs(e.deltaY)<18) return;
  const active=document.elementFromPoint(window.innerWidth/2,window.innerHeight/2);
  if(active && active.closest('input,textarea,select')) return;
  e.preventDefault();
  const rects=sceneIds.map(id=>({id,el:document.getElementById(id)})).filter(x=>x.el);
  let idx=0,dist=Infinity;
  rects.forEach((x,i)=>{const d=Math.abs(x.el.getBoundingClientRect().top);if(d<dist){dist=d;idx=i;}});
  const next=Math.max(0,Math.min(rects.length-1,idx+(e.deltaY>0?1:-1)));
  if(next!==idx){sceneLock=true;rects[next].el.scrollIntoView({behavior:'smooth',block:'start'});setTimeout(()=>{sceneLock=false;syncScene()},950);}
},{passive:false});

// Reveal on scroll.
const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting) entry.target.classList.add('is-visible');
}),{threshold:.12});
document.querySelectorAll('.reveal-section').forEach(el=>observer.observe(el));

// Scroll progress bar.
const updateProgress=()=>{
  const max=document.documentElement.scrollHeight-window.innerHeight;
  document.body.style.setProperty('--scroll-progress', max>0 ? `${(scrollY/max)*100}vh` : '0vh');
};
window.addEventListener('scroll', updateProgress, {passive:true});
updateProgress();

// Search overlay.
const searchOverlay=document.getElementById('searchOverlay');
const searchBtn=document.querySelector('.search-btn');
const searchClose=document.getElementById('searchClose');
const searchInput=document.getElementById('searchInput');
const searchForm=document.getElementById('searchForm');
function setSearch(open){ if(!searchOverlay)return; searchOverlay.classList.toggle('open',open); searchOverlay.setAttribute('aria-hidden',String(!open)); if(open){setTimeout(()=>searchInput&&searchInput.focus(),180);} }
if(searchBtn) searchBtn.addEventListener('click',()=>setSearch(true));
if(searchClose) searchClose.addEventListener('click',()=>setSearch(false));
if(searchOverlay) searchOverlay.addEventListener('click',e=>{if(e.target===searchOverlay)setSearch(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape')setSearch(false)});
if(searchForm) searchForm.addEventListener('submit',e=>{e.preventDefault(); const q=(searchInput.value||'').trim().toLowerCase(); if(!q){searchInput.focus();return;} const map=[['composite','san-pham'],['cửa gỗ','san-pham'],['mdf','san-pham'],['chống cháy','san-pham'],['khóa','san-pham'],['dự án','du-an'],['tin tức','tin-tuc']]; const hit=map.find(([term])=>q.includes(term)); setSearch(false); document.getElementById(hit?hit[1]:'san-pham')?.scrollIntoView({behavior:'smooth'}); });

// Back to top.
const backTop=document.getElementById('backTop');
backTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

// V10: continuously moving project rail; pauses on hover/focus and supports drag + arrows.
(function(){
  const track=document.getElementById('projectTrack'); if(!track) return;
  const prev=document.querySelector('.project-prev'), next=document.querySelector('.project-next');
  let timer=null, paused=false, dragging=false, startX=0, startScroll=0;
  const step=()=>Math.min(520, track.clientWidth*.62);
  const advance=()=>{ if(paused||dragging) return; const max=track.scrollWidth-track.clientWidth; if(track.scrollLeft>=max-8){ track.scrollTo({left:0,behavior:'smooth'}); } else { track.scrollBy({left:step(),behavior:'smooth'}); } };
  const start=()=>{clearInterval(timer); timer=setInterval(advance,3600)};
  const stop=()=>{clearInterval(timer)};
  track.addEventListener('mouseenter',()=>{paused=true;stop()});
  track.addEventListener('mouseleave',()=>{paused=false;start()});
  track.addEventListener('focusin',()=>{paused=true;stop()});
  track.addEventListener('focusout',()=>{paused=false;start()});
  next?.addEventListener('click',()=>track.scrollBy({left:step(),behavior:'smooth'}));
  prev?.addEventListener('click',()=>track.scrollBy({left:-step(),behavior:'smooth'}));
  track.addEventListener('pointerdown',e=>{dragging=true;track.classList.add('dragging');startX=e.clientX;startScroll=track.scrollLeft;track.setPointerCapture(e.pointerId);stop()});
  track.addEventListener('pointermove',e=>{if(!dragging)return;track.scrollLeft=startScroll-(e.clientX-startX)});
  track.addEventListener('pointerup',()=>{dragging=false;track.classList.remove('dragging');if(!paused)start()});
  track.addEventListener('pointercancel',()=>{dragging=false;track.classList.remove('dragging');if(!paused)start()});
  start();
})();
