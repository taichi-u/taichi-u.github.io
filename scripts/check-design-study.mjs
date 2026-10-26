import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {galleryPhotos} from '../content/gallery.mjs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.PORTFOLIO_BASE_URL||'http://127.0.0.1:4173';
const prefix='/artifacts/design-study/';
const out='artifacts/design-study/previews';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH,args:['--enable-unsafe-swiftshader']});
const checks=[],errors=[];
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const page=await context.newPage();
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400) errors.push(`${r.status()}: ${r.url()}`);});
const visibleModel=async(p=page)=>{
  await p.locator('[data-scene]').scrollIntoViewIfNeeded();
  await p.locator('[data-scene].is-ready').waitFor();
};
const pause=async(p=page)=>{
  if(await p.locator('html').getAttribute('data-motion')!=='off') await p.locator('.scene-motion-button').click();
};
try{
 for(const design of ['a','b']) for(const lang of ['ja','en']){
  const home=`${base}${prefix}${design}-${lang}.html`;
  for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:width<600?844:1000});
   await page.goto(home);
   await visibleModel(); await pause();
   await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
   await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.locator('h1').count(),1);
   assert.equal(await page.locator('.project-card').count(),8);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${design}/${lang} overflow ${width}`);
   if(width===1440||width===390) await page.screenshot({path:`${out}/${design}-${lang}-${width===390?'mobile':'desktop'}.png`});
   checks.push(`${design}/${lang}: ${width}px home, no overflow, 8 projects`);
  }
  await page.locator('[data-filter=space]').click();
  assert.equal(await page.locator('.project-card:visible').count(),4);
  await page.locator('[data-filter=all]').click();
  await page.locator('.project-card h3 a').first().click();
  assert(page.url().includes('mission-design'));
  assert((await page.locator('.case-copy').innerText()).includes(lang==='ja'?'投稿':'submitted'));
  await page.screenshot({path:`${out}/${design}-${lang}-research.png`});
  await page.goto(`${base}${prefix}${design}-gallery-${lang}.html`);
  for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:width<600?844:1000});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${design}/${lang} gallery overflow ${width}`);
  }
  for(const id of ['research','travel','interests','events','all']){
   await page.locator(`[data-gallery-filter=${id}]`).click();
   assert.equal(await page.locator('.gallery-card:visible').count(),id==='all'?15:galleryPhotos.filter(p=>p.categories.includes(id)).length);
  }
  await page.locator('.gallery-photo').first().click();
  assert(await page.locator('dialog[open]').count());
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('#gallery-position').innerText(),'2 / 15');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog[open]').count(),0);
  assert(await page.locator('.gallery-photo').first().evaluate(el=>el===document.activeElement));
  await page.evaluate(async()=>{for(const i of document.querySelectorAll('.gallery-card img')){i.loading='eager';await i.decode();}});
  await page.screenshot({path:`${out}/${design}-${lang}-gallery.png`});
  const altLink=await page.locator('[data-language]').getAttribute('href');
  assert(altLink.endsWith(`gallery-${lang==='ja'?'en':'ja'}.html`));
  checks.push(`${design}/${lang}: research links and factual status, all gallery filters, image loading, lightbox arrows/Escape/focus, language counterpart`);
 }
 await page.setViewportSize({width:1440,height:1000});
 await page.goto(`${base}${prefix}a-ja.html`); await visibleModel(); await pause();
 const canvas=page.locator('.scene-canvas');
 await page.locator('[data-scene-reset]').click();
 const initial=await canvas.screenshot();
 const box=await canvas.boundingBox();
 await page.mouse.move(box.x+box.width*.4,box.y+box.height*.4);await page.mouse.down();
 await page.mouse.move(box.x+box.width*.7,box.y+box.height*.6,{steps:12});await page.mouse.up();
 assert(!initial.equals(await canvas.screenshot()),'Dragging must rotate rendered pixels while auto rotation is off');
 assert.equal(await page.locator('[data-scene]').getAttribute('data-animating'),'false');
 await canvas.focus();await page.keyboard.press('Home');
 assert(initial.equals(await canvas.screenshot()),'Home must restore the initial orientation');
 await page.keyboard.press('ArrowRight');
 assert(!initial.equals(await canvas.screenshot()),'Arrow key must rotate the model');
 await page.locator('[data-scene-reset]').click();
 for(let i=0;i<7;i++)await page.locator('[data-scene-rotate=up]').click();
 const limit=await canvas.screenshot();
 for(let i=0;i<7;i++)await page.locator('[data-scene-rotate=up]').click();
 assert(limit.equals(await canvas.screenshot()),'Pitch must clamp before the model flips');
 await page.locator('[data-scene-reset]').click();
 await page.locator('.scene-motion-button').click();
 await page.waitForFunction(()=>document.querySelector('[data-scene]').dataset.animating==='true');
 await page.locator('[data-scene-rotate=right]').click();
 assert.equal(await page.locator('[data-scene]').getAttribute('data-animating'),'false');
 await page.waitForTimeout(1500);
 assert.equal(await page.locator('[data-scene]').getAttribute('data-animating'),'false');
 await page.waitForFunction(()=>document.querySelector('[data-scene]').dataset.animating==='true');
 await page.locator('#contact').scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>document.querySelector('[data-scene]').dataset.animating==='false');
 checks.push('3D: mouse drag, keyboard, reset, pitch limit, manual rotation while paused, 3-second resumption, offscreen suspension');
 const reduced=await browser.newContext({reducedMotion:'reduce',viewport:{width:1440,height:1000}});
 const rp=await reduced.newPage();await rp.goto(`${base}${prefix}a-en.html`);await visibleModel(rp);
 assert(await rp.locator('.scene-motion-button').isDisabled());
 const r0=await rp.locator('canvas').screenshot();await rp.locator('[data-scene-rotate=left]').click();
 assert(!r0.equals(await rp.locator('canvas').screenshot()));
 assert.equal(await rp.locator('[data-scene]').getAttribute('data-animating'),'false');
 await reduced.close();checks.push('Reduced motion: static by default, manual rotation remains available');
 const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const mp=await mobile.newPage();await mp.goto(`${base}${prefix}a-ja.html`);await visibleModel(mp);await pause(mp);
 const cdp=await mobile.newCDPSession(mp);
 const touchDrag=async(dx,dy)=>{
  const b=await mp.locator('canvas').boundingBox(),x=b.x+b.width*.45,y=b.y+b.height*.45;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  for(let i=1;i<=8;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx*i/8,y:y+dy*i/8}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 };
 await mp.locator('[data-scene]').scrollIntoViewIfNeeded();
 let sy=await mp.evaluate(()=>scrollY);await touchDrag(0,-100);await mp.waitForTimeout(300);
 assert(Math.abs(await mp.evaluate(()=>scrollY)-sy)>10,'Inactive touch canvas must allow native page scrolling');
 await mp.locator('[data-scene-touch]').click();await mp.locator('[data-scene]').scrollIntoViewIfNeeded();
 sy=await mp.evaluate(()=>scrollY);const before=await mp.locator('canvas').screenshot();
 await touchDrag(80,40);assert(!before.equals(await mp.locator('canvas').screenshot()));
 assert(Math.abs(await mp.evaluate(()=>scrollY)-sy)<2,'Active 3D input must not also scroll the page');
 await mp.locator('[data-scene-touch]').click();assert.equal(await mp.locator('[data-scene-touch]').getAttribute('aria-pressed'),'false');
 await mp.locator('[data-scene]').scrollIntoViewIfNeeded();sy=await mp.evaluate(()=>scrollY);await touchDrag(0,-100);await mp.waitForTimeout(300);
 assert(Math.abs(await mp.evaluate(()=>scrollY)-sy)>10,'Finish interaction must restore scrolling');
 await mobile.close();checks.push('CDP touch: normal scrolling → explicit 3D activation and rotation → restored scrolling');
 const noGL=await browser.newContext();await noGL.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type.startsWith('webgl')?null:original.call(this,type,...args);};});
 const fp=await noGL.newPage();await fp.goto(`${base}${prefix}b-ja.html`);await fp.waitForLoadState('networkidle');assert(await fp.locator('.planet').isVisible());assert(await fp.locator('.scene-controls').isHidden());await noGL.close();
 const noJS=await browser.newContext({javaScriptEnabled:false});const np=await noJS.newPage();await np.goto(`${base}${prefix}a-ja.html`);assert.equal(await np.locator('.project-card').count(),8);assert(await np.locator('.planet').isVisible());await noJS.close();
 checks.push('No WebGL / JavaScript: fallback model and factual content remain available');
 assert.deepEqual(errors,[]);
 await writeFile('artifacts/design-study/checks.json',JSON.stringify(checks,null,2));
 console.log(checks.join('\n'));
}finally{await browser.close();}
