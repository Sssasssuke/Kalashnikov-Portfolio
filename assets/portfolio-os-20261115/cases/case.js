const tabs=[...document.querySelectorAll('[data-tab]')];
function activate(tab){tabs.forEach(t=>{const selected=t===tab;t.setAttribute('aria-selected',selected);t.tabIndex=selected?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!selected;});}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>activate(tab));tab.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;activate(tabs[n]);tabs[n].focus();});});
const dialog=document.querySelector('.image-dialog');
const image=dialog.querySelector('.viewer-image');
let group=[],index=0,opener;
function show(){const source=group[index].querySelector('img');image.src=source.src;image.alt=source.alt;dialog.querySelector('.viewer-count').textContent=`${index+1} / ${group.length}`;}
function step(n){index=(index+n+group.length)%group.length;show();}
document.querySelectorAll('[data-group]').forEach(button=>button.addEventListener('click',()=>{opener=button;group=[...document.querySelectorAll(`[data-group="${button.dataset.group}"]`)];index=Number(button.dataset.index);show();dialog.showModal();smoothScroll?.stop();}));
dialog.querySelector('.viewer-close').addEventListener('click',()=>dialog.close());
dialog.querySelector('.viewer-prev').addEventListener('click',()=>step(-1));
dialog.querySelector('.viewer-next').addEventListener('click',()=>step(1));
dialog.addEventListener('close',()=>{smoothScroll?.start();opener?.focus({preventScroll:true});});
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();step(e.key==='ArrowLeft'?-1:1);}});
let start;
image.addEventListener('touchstart',e=>{start=[e.touches[0].clientX,e.touches[0].clientY];},{passive:true});
image.addEventListener('touchend',e=>{if(!start)return;const dx=e.changedTouches[0].clientX-start[0],dy=e.changedTouches[0].clientY-start[1];if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))step(dx<0?1:-1);start=null;},{passive:true});
