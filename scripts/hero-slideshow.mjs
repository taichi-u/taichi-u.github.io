import {galleryPhotos} from '../content/gallery.mjs';
import {galleryImages} from '../content/gallery-images.mjs';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function heroSlideshow(lang,root=''){
 const ja=lang==='ja',T=v=>v[ja?1:0];
 const ids=['fujiwara-bento','svalbard-2025','georgia-tech-presentation','running'];
 return `<div class="photo-opening photo-slideshow" role="region" aria-roledescription="${ja?'スライドショー':'carousel'}" aria-label="${ja?'留学・旅行・趣味の写真':'Photos from research stays, travel and interests'}" data-slideshow><div class="hero-slides">${ids.map((id,i)=>{
 const p=galleryPhotos.find(p=>p.id===id),variants=galleryImages[id],fallback=variants.find(v=>v.width>=800)||variants.at(-1),attr=i===0?'':'data-';
 return `<figure class="hero-slide" role="group" aria-roledescription="${ja?'スライド':'slide'}" aria-label="${i+1} / ${ids.length}" ${i?'hidden':''}><img class="opening-photo" ${attr}src="${root}${fallback.src}" ${attr}srcset="${variants.map(v=>`${root}${v.src} ${v.width}w`).join(', ')}" sizes="(max-width:600px) calc(100vw - 40px), (max-width:1000px) 50vw, 710px" width="${p.width}" height="${p.height}" alt="${esc(T(p.title))}" ${i?'':'fetchpriority="high"'} decoding="async"><figcaption>${esc(T(p.caption))}</figcaption></figure>`;
 }).join('')}</div><div class="slideshow-controls" hidden><button type="button" data-slide-pause aria-pressed="false">${ja?'一時停止':'Pause'}</button><span class="slide-count" aria-hidden="true">1 / ${ids.length}</span><button type="button" data-slide-previous aria-label="${ja?'前の写真':'Previous photo'}">←</button><button type="button" data-slide-next aria-label="${ja?'次の写真':'Next photo'}">→</button></div><p class="slideshow-status sr-only" role="status" aria-live="polite"></p></div>`;
}
