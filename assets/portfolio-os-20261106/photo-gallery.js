import media from './photo-library.js';
let selected=-1;
export function renderGallery(){
 const area=document.querySelector('.window-content');
 document.querySelector('.window-count').textContent=`${media.filter(m=>m.type==='image').length} фото · ${media.filter(m=>m.type==='video').length} видео`;
 selected=-1;
 area.innerHTML='<h2>Фотографии</h2><div class="personal-gallery">'+media.map((m,i)=>`<button data-media="${i}" aria-label="${m.alt}"><img src="${m.thumb}" alt="${m.alt}" loading="lazy">${m.type==='video'?'<span class="video-badge">▶ Видео</span>':''}</button>`).join('')+'</div>';
 area.querySelectorAll('[data-media]').forEach(b=>b.onclick=()=>show(Number(b.dataset.media)));
}
function show(i){
 selected=(i+media.length)%media.length;const m=media[selected];
 const area=document.querySelector('.window-content');
 area.querySelector('video')?.pause();
 area.innerHTML=`<div class="personal-viewer"><div class="photo-tools"><button class="photo-grid-back">Все фотографии</button><span aria-live="polite">${selected+1} / ${media.length}</span></div><div class="photo-stage">${m.type==='video'?`<video controls playsinline preload="metadata" poster="${m.thumb}" src="${m.src}" aria-label="${m.alt}"></video>`:`<img src="${m.src}" alt="${m.alt}" draggable="false">`}</div><div class="photo-navigation"><button class="photo-prev" aria-label="Предыдущее">←</button><button class="photo-next" aria-label="Следующее">→</button></div></div>`;
 area.querySelector('.photo-grid-back').onclick=renderGallery;
 area.querySelector('.photo-prev').onclick=()=>show(selected-1);
 area.querySelector('.photo-next').onclick=()=>show(selected+1);
 let start;
 const stage=area.querySelector('.photo-stage');
 stage.addEventListener('touchstart',e=>{if(e.target.tagName==='VIDEO')return;start=[e.touches[0].clientX,e.touches[0].clientY];},{passive:true});
 stage.addEventListener('touchend',e=>{if(!start)return;const dx=e.changedTouches[0].clientX-start[0],dy=e.changedTouches[0].clientY-start[1];start=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))show(selected+(dx<0?1:-1));},{passive:true});
}
document.addEventListener('keydown',e=>{
 if(!document.querySelector('.personal-viewer')||document.querySelector('.app-window').hidden||e.target.matches('input,textarea,video'))return;
 if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();show(selected+(e.key==='ArrowLeft'?-1:1));}
});
