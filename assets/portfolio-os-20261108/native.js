// The home screen is the entry point. Apps open only after an explicit tap.
modal.close();modal.classList.remove('desktop-window');
const artwork=[['mts','<strong>МТС</strong>'],['fashion','<strong class="brand-fm">ФМ</strong>'],['saas','<i data-lucide="chart-no-axes-combined"></i>'],['gds','<strong class="brand-gds">GDS</strong>'],['ai','<i data-lucide="sparkles"></i>']];
document.querySelectorAll('.apps>a').forEach((a,i)=>{const icon=a.querySelector('.app-icon');icon.className='app-icon '+artwork[i][0];icon.style.textShadow='none';icon.innerHTML=artwork[i][1];});
document.querySelector('.apps [data-open="skills"] .app-icon').innerHTML='<i data-lucide="settings"></i>';
const originalOpen=openApp;
openApp=function(type,button){modal.classList.remove('case-app','desktop-window');document.querySelector('.chat-note').hidden=type!=='chat';originalOpen(type,button);};
const homeBar=document.createElement('div');homeBar.className='home-indicator';homeBar.setAttribute('aria-hidden','true');modal.append(homeBar);
function openCase(href,name,trigger){
 opener=trigger;modal.classList.remove('desktop-window');modal.classList.add('case-app');composer.hidden=true;
 document.querySelector('.chat-note').hidden=true;content.classList.remove('text-page');content.replaceChildren();
 document.querySelector('#window-title').textContent=name;
 document.querySelector('#window-subtitle').textContent='Портфолио / проект';
 const frame=document.createElement('iframe');frame.title=name;frame.src=href;content.append(frame);
 frame.addEventListener('load',()=>{try{frame.contentDocument.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;const url=new URL(a.href);if(url.origin===location.origin&&url.pathname==='/'){e.preventDefault();modal.close();}});}catch{}});
 if(!modal.open)modal.showModal();
}
document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a||e.ctrlKey||e.metaKey||e.shiftKey)return;const url=new URL(a.href);if(url.origin===location.origin&&url.pathname.startsWith('/assets/portfolio-os-20261108/cases/')){e.preventDefault();openCase(url.href,a.querySelector('strong')?.textContent||a.textContent.trim(),a);}});
modal.addEventListener('close',()=>{if(modal.classList.contains('case-app'))content.replaceChildren();});
icons();
