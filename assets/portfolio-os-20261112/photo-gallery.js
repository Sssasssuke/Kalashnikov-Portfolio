import media from './photo-library.js';
let selected=-1;
let gridScroll=0, gridFocus=0;
let mediaFilter='all',mediaQuery='';
function phoneGallery(){
 const area=document.querySelector('.window-content');selected=-1;
 area.innerHTML='<h2>Медиатека</h2><div class="ios-photo-search"><input type="search" aria-label="Поиск фотографий" placeholder="Поиск по подписи"></div><div class="personal-gallery"></div><nav class="ios-photo-tabs" aria-label="Медиатека"><button data-filter="all">Медиатека</button><button data-filter="image">Фото</button><button data-filter="video">Видео</button></nav>';
 const render=()=>{const grid=area.querySelector('.personal-gallery');grid.innerHTML=media.map((m,i)=>({m,i})).filter(({m})=>(mediaFilter==='all'||m.type===mediaFilter)&&m.alt.toLowerCase().includes(mediaQuery.toLowerCase())).map(({m,i})=>`<button data-media="${i}" aria-label="${m.alt}"><img src="${m.thumb}" alt="${m.alt}" loading="lazy">${m.type==='video'?'<span class="video-badge">Видео</span>':''}</button>`).join('')||'<p class="photo-empty">Ничего не найдено</p>';grid.querySelectorAll('button').forEach(b=>b.onclick=()=>show(Number(b.dataset.media)));area.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===mediaFilter)));};
 area.querySelector('input').value=mediaQuery;area.querySelector('input').oninput=e=>{mediaQuery=e.target.value;render();};area.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{mediaFilter=b.dataset.filter;render();});render();area.scrollTop=gridScroll;
}
export function renderGallery(){
 if(innerWidth<=700){phoneGallery();return;}
 const area=document.querySelector('.window-content');
 document.querySelector('.window-count').textContent=`${media.filter(m=>m.type==='image').length} фото · ${media.filter(m=>m.type==='video').length} видео`;
 selected=-1;
 area.innerHTML='<h2>Фотографии</h2><div class="personal-gallery">'+media.map((m,i)=>`<button data-media="${i}" aria-label="${m.alt}"><img src="${m.thumb}" alt="${m.alt}" loading="lazy">${m.type==='video'?'<span class="video-badge">▶ Видео</span>':''}</button>`).join('')+'</div>';
 area.querySelectorAll('[data-media]').forEach(b=>b.onclick=()=>show(Number(b.dataset.media)));
 area.scrollTop=gridScroll;
 area.querySelector(`[data-media="${gridFocus}"]`)?.focus({preventScroll:true});
}
function show(i){
 const grid=document.querySelector('.personal-gallery');
 if(grid){gridScroll=document.querySelector('.window-content').scrollTop;gridFocus=i;}
 selected=(i+media.length)%media.length;const m=media[selected];
 const area=document.querySelector('.window-content');
 area.querySelector('video')?.pause();
 area.scrollTop=0;
 area.innerHTML=`<div class="personal-viewer"><div class="photo-tools"><button class="photo-grid-back">Все фотографии</button><span aria-live="polite">${selected+1} / ${media.length}</span></div><div class="photo-stage">${m.type==='video'?`<video controls playsinline preload="metadata" poster="${m.thumb}" src="${m.src}" aria-label="${m.alt}"></video>`:`<img src="${m.src}" alt="${m.alt}" draggable="false">`}</div><div class="photo-navigation"><button class="photo-prev" aria-label="Предыдущее">←</button><button class="photo-next" aria-label="Следующее">→</button></div></div>`;
 area.querySelector('.photo-grid-back').onclick=renderGallery;
 area.querySelector('.photo-prev').onclick=()=>show(selected-1);
 area.querySelector('.photo-next').onclick=()=>show(selected+1);
 let start;
 const stage=area.querySelector('.photo-stage');
 stage.addEventListener('touchstart',e=>{if(e.target.tagName==='VIDEO')return;start=[e.touches[0].clientX,e.touches[0].clientY];},{passive:true});
 stage.addEventListener('touchend',e=>{if(!start)return;const dx=e.changedTouches[0].clientX-start[0],dy=e.changedTouches[0].clientY-start[1];start=null;if(dy>70&&dy>Math.abs(dx))renderGallery();else if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))show(selected+(dx<0?1:-1));},{passive:true});
}
document.addEventListener('keydown',e=>{
 if(!document.querySelector('.personal-viewer')||document.querySelector('.app-window').hidden||e.target.matches('input,textarea,video'))return;
 if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();show(selected+(e.key==='ArrowLeft'?-1:1));}
});
