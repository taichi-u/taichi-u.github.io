import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.PORTFOLIO_BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH,args:['--enable-unsafe-swiftshader']});
const checks=[];
try{
 for(const lang of ['ja','en']) for(const width of [320,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:width<600?844:1000},reducedMotion:'reduce'});
  const page=await context.newPage();const requests=[];page.on('request',r=>requests.push(r.url()));
  await page.goto(`${base}/${lang==='ja'?'index-ja':'index'}.html`);await page.waitForLoadState('networkidle');
  const imgs=page.locator('.hero-slide img');
  const delayed=await imgs.evaluateAll(imgs=>imgs.slice(1).map(i=>i.dataset.src));
  if (width === 320 || width === 390) assert(!requests.some(url => url.endsWith("scene.min.js")), "A sliver of the mobile scene must not trigger a 1MB load");
  assert(delayed.every(Boolean));assert(delayed.every(src=>!requests.some(url=>url.endsWith(src))));
  assert(await page.locator('[data-slide-pause]').isDisabled());
  const heights=[];
  for(let i=0;i<4;i++){
   heights.push((await page.locator('[data-slideshow]').boundingBox()).height);
   await page.locator('[data-slide-next]').click();
   await page.waitForFunction(n=>document.querySelector('.slide-count').textContent===`${n} / 4`,(i+1)%4+1);
   assert(await page.locator('.hero-slide:visible img').evaluate(i=>i.complete&&i.naturalWidth>0));
   assert.equal(await page.locator('.hero-slide:visible').count(),1);
  }
  assert(Math.max(...heights)-Math.min(...heights)<1,`${lang}/${width}: slideshow moved layout: ${heights}`);
  await page.locator('[data-slide-previous]').focus();await page.keyboard.press('Enter');
  await page.waitForFunction(()=>document.querySelector('.slide-count').textContent==='4 / 4');
  checks.push(`${lang}/${width}: one initial photo, all photos decode, no layout shift, previous/next/keyboard, reduced motion`);
  await context.close();
 }
 const context=await browser.newContext({viewport:{width:1440,height:1000}});const page=await context.newPage();
 await page.goto(`${base}/index-ja.html`);await page.waitForLoadState('networkidle');
 await page.waitForFunction(()=>document.querySelector('.slide-count').textContent==='2 / 4',null,{timeout:15000});
 await page.locator('[data-slide-pause]').click();await page.mouse.move(0,0);await page.keyboard.press('Tab');
 const paused=await page.locator('.slide-count').innerText();await page.waitForTimeout(8500);assert.equal(await page.locator('.slide-count').innerText(),paused);
 await page.locator('[data-slide-pause]').click();await page.keyboard.press('Tab');await page.locator('#contact').scrollIntoViewIfNeeded();
 await page.waitForTimeout(8500);assert.equal(await page.locator('.slide-count').innerText(),paused);
 checks.push('Autoplay after 8 seconds, pause, offscreen suspension');await context.close();
 const fail=await browser.newContext({reducedMotion:'reduce'});const fp=await fail.newPage();await fp.goto(`${base}/index-ja.html`);
 const path=await fp.locator('.hero-slide img').nth(1).getAttribute('data-src');const file=path.split('/').at(-1).replace(/-(?:\d+|thumb)\.webp$/, '');
 const pattern=new RegExp(file+'.*\\.webp');await fp.route(pattern,r=>r.abort());await fp.locator('[data-slide-next]').click();
 await fp.waitForFunction(()=>document.querySelector('.slideshow-status').textContent.includes('読み込めません'));
 assert.equal(await fp.locator('.slide-count').innerText(),'1 / 4');await fp.unroute(pattern);await fp.locator('[data-slide-next]').click();
 await fp.waitForFunction(()=>document.querySelector('.slide-count').textContent==='2 / 4');
 checks.push('Failed photo preserves current image; retry succeeds');await fail.close();
 const noJS=await browser.newContext({javaScriptEnabled:false});const np=await noJS.newPage();await np.goto(`${base}/index-ja.html`);assert.equal(await np.locator('.hero-slide:visible').count(),1);assert(await np.locator('.slideshow-controls').isHidden());await noJS.close();checks.push('No JavaScript: first photograph and caption remain visible');
 await mkdir('artifacts/design-study',{recursive:true});await writeFile('artifacts/design-study/slideshow-checks.json',JSON.stringify(checks,null,2));console.log(checks.join('\n'));
}finally{await browser.close()}
