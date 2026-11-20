const $=s=>document.querySelector(s);
const slides=[...document.querySelectorAll('.slide')];
const notes=[
 'Introduce Slope Lens 3D as an IC202P field decision-support prototype. The starting point is a ground-level phone photo taken from a safe location. Classification, qualified size estimates and a field record are implemented. The interactive 3D viewer remains proposed.',
 'Use the mountain cross-section to explain the viewpoint. An engineer needs the crown, face and deposit in context. The app supports observation and documentation; it cannot determine whether approaching the slope is safe or see hazards outside the photo.',
 'Walk through the movement mechanisms: detached blocks; a rotating slump; a planar slide; coarse material flowing in a channel; fine wet material forming a lobe; and no visible failure. These are six practical ground-photo categories, not the entire Hungr taxonomy. Stable-looking photos are not a safety certification.',
 'Explain why a split by site matters: two photos of the same landslide would otherwise inflate evaluation. Of 4,954 collected images, 1,325 were usable. The usable split is 908/154/263. The poster says human-labelled, but the report explicitly says every current label is AI-made. Follow the report and disclose the pending blind human review.',
 'The app averages three frozen-feature probes: DINOv2-base, DINOv2-large and SigLIP2-base, each with linear heads. Features stay frozen because the labelled dataset is small. Selection uses train and validation only, with site-balanced CV and distribution shifts. The 0.60 threshold was selected to reach 85% CV accuracy with at least 50% coverage. Current app behaviour still shows unreliable results with a warning when photo quality fails.',
 'Keep the denominators explicit. The classifier scores 80.6% accuracy and 0.784 macro-F1 on 263 usable photos. In the full pipeline, 69.2% of usable photos receive a confident answer and accuracy on those is 85.7%. Across all 1,008 photos, including 745 unusable ones, precision is 60.5%. The photo check is the weak link. These scores measure agreement with AI labels; only 20 test photos are real phone images.',
 'This is an actual output reproduced from the poster, not a live classifier running in this deck. The 78% is one photo’s confidence, not overall test accuracy. Explain outline, depth, scale and plane geometry. These displayed numbers are estimates; there are no verified ground-truth field sizes. In the app, 90% ranges communicate uncertainty. Medium depth trust and fair photo quality should be acknowledged.',
 'Close on a concrete next experiment: obtain blind human labels and 30–50 local phone photos, improve the photo check and scarce classes, and validate absolute measurements. The interactive 3D viewer is future scope. Thank the team and mentor, then invite questions. Source and poster links are available here.'
];
const types=[
 ['Rock fall / topple','Detached blocks, a steep face and talus at the base.','<path d="M10 86 40 50 52 12 77 12 78 85"/><path class="moving" d="m62 35 14-4 7 13-13 9Zm21 24 12 2 4 10-12 5Z"/><path d="m54 88 9-11 14 11 11-5 13 6"/>'],
 ['Rotational slide','A curved scarp, back-tilted blocks and a bulging toe.','<path d="M8 86 33 28 65 22 101 85M24 47q30 49 69 35"/><path class="moving" d="m35 39 28-9 17 36-25 8Z"/>'],
 ['Translational slide','A sheet of material moves along a planar surface.','<path d="M8 88 37 16 68 43 102 88M27 52l66 31"/><path class="moving" d="m43 29 40 31-8 12-40-31Z"/>'],
 ['Debris flow','Coarse, mixed material follows a channel into a fan.','<path d="m9 83 32-64 20 13 18-15 25 66"/><path class="moving" d="M55 32q-14 19 3 25t-8 20L30 88h58L63 73q15-20 1-27Z"/><path d="m49 61 3 2m8 17 3 3m-20 1 3 2"/>'],
 ['Earth / mud flow','Fine wet material forms a tongue or rounded lobe.','<path d="M8 87 37 24 69 32 101 86"/><path class="moving" d="M45 36q-10 15 0 24t-4 16q-16 15 13 14t17-17Q53 51 63 38Z"/>'],
 ['No visible landslide','A slope, cliff or cut without visible slope failure.','<path d="M8 87 34 48 61 20 102 87M18 87h80M35 47l17 12 12-35M61 60l23 5"/><path d="M19 67v-17m-7 9 7-12 7 12M88 81V64m-7 9 7-12 7 12"/>']
];
$('#taxonomy').innerHTML=types.map(([name,desc,svg])=>`<article class="type"><svg viewBox="0 0 112 100" role="img" aria-label="${name} movement schematic">${svg}</svg><div><h3>${name}</h3><p>${desc}</p></div></article>`).join('');
$('#dots').innerHTML=slides.map((s,i)=>`<button data-slide="${i}" aria-label="Slide ${i+1}: ${s.dataset.title}"></button>`).join('');
$('#overviewGrid').innerHTML=slides.map((s,i)=>`<button data-slide="${i}"><span class="overview-number">0${i+1}</span>${s.dataset.title}</button>`).join('');
const thumbs = [
 '<img src="assets/slope.png" alt="">',
 '<svg viewBox="0 0 200 70"><path d="M0 65 55 30 80 12 115 43 140 55 200 65M0 70Q80 10 140 60"/></svg>',
 '<svg viewBox="0 0 200 70"><path d="M5 60 35 10 65 60M70 60 100 10 130 60M135 60 165 10 195 60"/></svg>',
 '<svg viewBox="0 0 200 70"><path stroke-width="25" d="M10 35h110m8 0h20m8 0h34"/></svg>',
 '<svg viewBox="0 0 200 70"><path d="M20 35h35V12h70v46H55V35m70 0h55M55 35h70"/></svg>',
 '<svg viewBox="0 0 200 70"><path stroke-width="8" d="M20 15h150M20 35h120M20 55h62"/></svg>',
 '<img src="assets/output.jpg" alt="">',
 '<svg viewBox="0 0 200 70"><path d="M10 65 70 10 110 52 140 24 195 65"/></svg>'
];
document.querySelectorAll('#overviewGrid button').forEach((button,i) => button.insertAdjacentHTML('afterbegin','<span class="overview-thumb">'+thumbs[i]+'</span>'));
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
function setMotion(paused) {
 document.body.classList.toggle('motion-paused',paused);
 $('#motionBtn').setAttribute('aria-pressed',String(paused));
 $('#motionBtn').textContent=paused?'Motion off':'Motion';
}
setMotion(motionPreference.matches);
$('#motionBtn').onclick=()=>setMotion(!document.body.classList.contains('motion-paused'));
motionPreference.addEventListener('change', e=>setMotion(e.matches));
$('#printBtn').onclick=()=>window.print();
let index=0;
function go(n,replace=false){index=Math.max(0,Math.min(7,n));slides.forEach((s,i)=>{s.classList.toggle('active',i===index);s.inert=i!==index;s.setAttribute('aria-hidden',String(i!==index));s.setAttribute('tabindex','-1');if(i===index)s.scrollTop=0;});document.querySelectorAll('[data-slide]').forEach(b=>b.setAttribute('aria-current',String(Number(b.dataset.slide)===index)));$('#current').textContent=String(index+1).padStart(2,'0');$('#slideTitle').textContent=slides[index].dataset.title;$('#progress').style.width=`${(index+1)/8*100}%`;if(document.activeElement?.closest('.slide')?.inert)slides[index].focus({preventScroll:true});$('#prev').disabled=index===0;$('#next').disabled=index===7;$('#noteContent').textContent=notes[index];document.title=`${index+1}/8 · ${slides[index].dataset.title} · Slope Lens 3D`;$('#announcement').textContent=`Slide ${index+1} of 8: ${slides[index].dataset.title}`;const hash=`#${index+1}`;if(location.hash!==hash)history[replace?'replaceState':'pushState'](null,'',hash);}
function fromHash(){const n=Number(location.hash.slice(1));go(Number.isInteger(n)&&n>=1&&n<=8?n-1:0,true)}
$('#prev').onclick=()=>go(index-1);$('#next').onclick=()=>go(index+1);document.querySelector('[data-next]').onclick=()=>go(index+1);
document.querySelectorAll('[data-slide]').forEach(b=>b.onclick=()=>{go(Number(b.dataset.slide));$('#overview').close()});
$('#overviewBtn').onclick=()=>$('#overview').showModal();$('#sourcesBtn').onclick=()=>$('#sources').showModal();document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());
const toggleNotes=()=>{$('#speakerNotes').hidden=!$('#speakerNotes').hidden;$('#notesBtn').setAttribute('aria-pressed',String(!$('#speakerNotes').hidden))};$('#notesBtn').onclick=toggleNotes;$('#closeNotes').onclick=toggleNotes;
async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{$('#announcement').textContent='Fullscreen unavailable in this browser. Use the browser fullscreen control.'}}
$('#fullBtn').onclick=fullscreen;
document.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(e.key==='Escape'){$('#blank').hidden=true;$('#speakerNotes').hidden=true;$('#notesBtn').setAttribute('aria-pressed','false');return}if(document.querySelector('dialog[open]'))return;if(!$('#blank').hidden){if(e.key.toLowerCase()==='b')$('#blank').hidden=true;return}if(e.target.closest('button,a')&&(e.key===' '||e.key==='Enter'))return;const k=e.key.toLowerCase();if(['arrowright','arrowdown','pagedown',' ','enter'].includes(k)){e.preventDefault();go(index+1)}else if(['arrowleft','arrowup','pageup'].includes(k)){e.preventDefault();go(index-1)}else if(k==='home')go(0);else if(k==='end')go(7);else if(/^[1-8]$/.test(k))go(Number(k)-1);else if(k==='f')fullscreen();else if(k==='o')$('#overview').showModal();else if(k==='n')toggleNotes();else if(k==='m')$('#motionBtn').click();else if(k==='p')window.print();else if(k==='b')$('#blank').hidden=false;});
let touch=null;$('#deck').addEventListener('touchstart',e=>{touch={x:e.touches[0].clientX,y:e.touches[0].clientY}},{passive:true});$('#deck').addEventListener('touchend',e=>{if(!touch||e.target.closest('a,button'))return;const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.6)go(index+(dx<0?1:-1));touch=null},{passive:true});
window.addEventListener('hashchange',fromHash);fromHash();

// Print every slide, including those normally removed from keyboard navigation.
window.addEventListener('beforeprint',()=>slides.forEach(s=>{s.inert=false;s.removeAttribute('aria-hidden')}));
window.addEventListener('afterprint',()=>go(index,true));
