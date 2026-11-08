(() => {
 const posts=JSON.parse(document.querySelector('#post-data').textContent);
 const modal=document.querySelector('.post-dialog');
 const track=modal.querySelector('.post-strip');
 let trigger;
 function setup(player){
  const strip=player.querySelector('.slide-strip'), count=player.querySelector('.strip-count');
  const update=()=>{
   const n=Math.round(strip.scrollLeft/strip.clientWidth);
   count.textContent=`${n+1} / ${strip.children.length}`;
   player.querySelector('[data-direction="-1"]').disabled=n===0;
   player.querySelector('[data-direction="1"]').disabled=n>=strip.children.length-1;
  };
  const move=d=>strip.scrollTo({left:(Math.round(strip.scrollLeft/strip.clientWidth)+d)*strip.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  player.querySelectorAll('[data-direction]').forEach(b=>b.addEventListener('click',()=>move(Number(b.dataset.direction))));
  strip.addEventListener('scroll',update,{passive:true});
  strip.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}});
  let drag;
  strip.addEventListener('pointerdown',e=>{
   if(e.pointerType!=='mouse'||e.button!==0)return;
   drag={x:e.clientX,left:strip.scrollLeft};strip.setPointerCapture(e.pointerId);strip.classList.add('dragging');
  });
  strip.addEventListener('pointermove',e=>{if(drag)strip.scrollLeft=drag.left+drag.x-e.clientX;});
  const end=()=>{if(!drag)return;drag=null;const target=Math.round(strip.scrollLeft/strip.clientWidth)*strip.clientWidth;strip.classList.remove('dragging');strip.scrollTo({left:target,behavior:'smooth'});};
  strip.addEventListener('pointerup',end);strip.addEventListener('pointercancel',end);
  new ResizeObserver(()=>{if(strip.clientWidth)update();}).observe(strip);
  return update;
 }
 setup(document.querySelector('.persona-player'));
 const update=setup(document.querySelector('.post-player'));
 document.querySelectorAll('[data-post]').forEach(b=>b.addEventListener('click',()=>{
  trigger=b;const post=posts[Number(b.dataset.post)];
  track.replaceChildren(...post.slides.map(s=>{const img=new Image();img.src=s.src;img.alt=s.alt;img.width=s.width;img.height=s.height;img.draggable=false;return img;}));
  modal.querySelector('.post-caption').textContent=post.title;
  modal.showModal();smoothScroll?.stop();document.body.style.overflow='hidden';track.scrollLeft=0;update();
 }));
 modal.querySelector('.post-close').addEventListener('click',()=>modal.close());
 modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close();}});
 modal.addEventListener('close',()=>{smoothScroll?.start();document.body.style.overflow='';trigger?.focus({preventScroll:true});});
})();
