const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const slides = $$('.slide');
let index = 0;
let studyMode = false;
let studyObserver;

function references(chapter) {
  return `<div class="reading-references"><span class="small-label">SOURCES · PROJECT SNAPSHOT 74ba236 + BACKGROUND</span>${chapter.refs.map(([path, title]) => `<a href="${path.startsWith('https://') ? path : sourceRoot + path}" target="_blank" rel="noopener">${title}</a>`).join('')}</div>`;
}

function chapterMarkup(chapter) {
  return `<p class="reading-lead">${chapter.lead}</p>${chapter.html}${references(chapter)}`;
}

// Contextual panels and study chapters share the same project evidence.
slides.forEach((slide, i) => {
  const stage = document.createElement('div');
  stage.className = 'slide-stage';
  while (slide.firstChild) stage.append(slide.firstChild);
  slide.append(stage);
  const reading = document.createElement('div');
  reading.className = 'study-detail reading-body';
  reading.innerHTML = `<div class="study-heading"><span class="small-label">${chapterData[i].label} / TECHNICAL READING</span><h3>${chapterData[i].title}</h3></div>${chapterMarkup(chapterData[i])}`;
  slide.append(reading);
});

$('#taxonomy').innerHTML = classData.map((c, i) => `
  <button class="type" data-class="${i}" aria-label="Explore ${c.name}">
    <svg viewBox="0 0 112 100" aria-hidden="true">${c.svg}</svg>
    <div><h3>${c.name}</h3><p>${c.cue}</p><span class="type-meta">${c.train + c.val + c.test} photos <i>·</i> inspect evidence</span></div>
  </button>`).join('');

$('#dots').innerHTML = slides.map((s, i) => `<button data-slide="${i}" aria-label="Slide ${i + 1}: ${s.dataset.title}"></button>`).join('');
const overviewArt = [
  '<img src="assets/slope.png" alt="">',
  '<svg viewBox="0 0 200 70"><path d="M0 65 55 30 80 12 115 43 140 55 200 65M0 70Q80 10 140 60"/></svg>',
  '<svg viewBox="0 0 200 70"><path d="M5 60 35 10 65 60M70 60 100 10 130 60M135 60 165 10 195 60"/></svg>',
  '<svg viewBox="0 0 200 70"><path stroke-width="25" d="M10 35h110m8 0h20m8 0h34"/></svg>',
  '<svg viewBox="0 0 200 70"><path d="M20 35h35V12h70v46H55V35m70 0h55M55 35h70"/></svg>',
  '<svg viewBox="0 0 200 70"><path stroke-width="8" d="M20 15h150M20 35h120M20 55h62"/></svg>',
  '<img src="assets/output.jpg" alt="">',
  '<svg viewBox="0 0 200 70"><path d="M10 65 70 10 110 52 140 24 195 65"/></svg>'
];
$('#overviewGrid').innerHTML = slides.map((s, i) => `<button data-slide="${i}"><span class="overview-thumb" aria-hidden="true">${overviewArt[i]}</span><span class="overview-number">0${i + 1}</span>${s.dataset.title}</button>`).join('');
$('#theoryChapters').innerHTML = chapterData.map((c, i) => `<button data-theory-chapter="${i}" aria-label="Theory chapter ${i + 1}: ${c.title}">${String(i + 1).padStart(2, '0')} <span>${c.label.toLowerCase()}</span></button>`).join('');

function updateChrome() {
  $$('[data-slide]').forEach(button => button.setAttribute('aria-current', String(Number(button.dataset.slide) === index)));
  $('#current').textContent = String(index + 1).padStart(2, '0');
  $('#slideTitle').textContent = slides[index].dataset.title;
  $('#progress').style.width = `${(index + 1) / slides.length * 100}%`;
  $('#prev').disabled = index === 0;
  $('#next').disabled = index === slides.length - 1;
  $('#noteContent').textContent = chapterData[index].notes;
  document.title = `${index + 1}/8 · ${slides[index].dataset.title} · Slope Lens 3D`;
}

function go(number, replace = false) {
  index = Math.max(0, Math.min(slides.length - 1, number));
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
    slide.inert = !studyMode && i !== index;
    slide.setAttribute('aria-hidden', String(!studyMode && i !== index));
    slide.setAttribute('tabindex', '-1');
    if (i === index && !studyMode) slide.scrollTop = 0;
  });
  updateChrome();
  if (document.activeElement?.closest('.slide')?.inert) slides[index].focus({ preventScroll: true });
  if (studyMode) slides[index].scrollIntoView({ behavior: 'instant', block: 'start' });
  $('#announcement').textContent = `Slide ${index + 1} of 8: ${slides[index].dataset.title}`;
  const hash = `#${index + 1}`;
  if (location.hash !== hash) history[replace ? 'replaceState' : 'pushState'](null, '', hash);
}

function fromHash() {
  const number = Number(location.hash.slice(1));
  go(Number.isInteger(number) && number >= 1 && number <= 8 ? number - 1 : 0, true);
}

function toggleStudy() {
  studyMode = !studyMode;
  document.body.classList.toggle('study-mode', studyMode);
  $('#studyBtn').textContent = studyMode ? 'Present slides' : 'Study view';
  $('#studyBtn').setAttribute('aria-pressed', String(studyMode));
  if (studyObserver) studyObserver.disconnect();
  go(index, true);
  if (studyMode) {
    studyObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting);
      if (visible.length) {
        index = slides.indexOf(visible[visible.length - 1].target);
        updateChrome();
      }
    }, { rootMargin: '-90px 0px -70% 0px', threshold: 0 });
    slides.forEach(slide => studyObserver.observe(slide));
  }
}

function renderTheory(number) {
  const chapter = chapterData[number];
  $('#theoryLabel').textContent = `${String(number + 1).padStart(2, '0')} / ${chapter.label}`;
  $('#theoryTitle').textContent = chapter.title;
  $('#theoryBody').innerHTML = chapterMarkup(chapter);
  $('#theoryBody').scrollTop = 0;
  $$('[data-theory-chapter]').forEach(button => button.setAttribute('aria-current', String(Number(button.dataset.theoryChapter) === number)));
}

function openTheory() {
  renderTheory(index);
  $('#theoryDialog').showModal();
}

function showClass(number) {
  const c = classData[number];
  $('#classFamily').textContent = `${c.family} / HUNGR 2014 GROUP`;
  $('#classBody').innerHTML = `
    <div class="class-detail-heading"><svg viewBox="0 0 112 100" aria-hidden="true">${c.svg}</svg><div><h3 id="classTitle">${c.name}</h3><p>${c.mechanism}</p></div></div>
    <div class="class-detail-copy"><article><h4>Field evidence</h4><p>${c.inspect}</p></article><article><h4>Where interpretation breaks down</h4><p>${c.confusion}</p></article></div>
    <div class="class-detail-stats"><div><strong>${c.train + c.val + c.test}</strong><span>total usable photos</span></div><div><strong>${c.test}</strong><span>test photos</span></div><div><strong>${c.recall}%</strong><span>test recall</span></div><div><strong>${c.precision}%</strong><span>test precision</span></div></div>
    <p class="footnote">Reported test agreement with AI annotations. Samples are site-disjoint; these numbers are not expert-verified field accuracy.</p>
    <a class="detail-source" href="${sourceRoot}report.md#42-untouched-test-split-263-usable-photos-152-sites-resultssummarymd" target="_blank" rel="noopener">Read the source evidence</a>`;
  $('#classDialog').showModal();
}

// Arrow keys stay within a tablist instead of advancing the deck.
function selectTab(button, kind) {
  const tabs = [...button.closest('[role="tablist"]').querySelectorAll('[role="tab"]')];
  tabs.forEach(tab => {
    const selected = tab === button;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    const panel = tab.getAttribute('aria-controls');
    if (panel && kind !== 'stage') document.getElementById(panel).hidden = !selected;
  });
  if (kind === 'stage') renderStage(Number(button.dataset.stage));
}

function renderRisk() {
  const r = riskData[Number($('#riskSlider').value)];
  $('#riskThreshold').textContent = r.threshold.toFixed(2);
  $('#riskSlider').setAttribute('aria-valuetext', `Threshold ${r.threshold.toFixed(2)}: ${r.coverage}% coverage, ${r.accuracy}% answered accuracy`);
  $('#riskCoverage').textContent = `${r.coverage}%`;
  $('#riskAccuracy').textContent = `${r.accuracy}%`;
  $('#riskF1').textContent = r.f1.toFixed(3);
  const meetsRule = r.accuracy >= 85 && r.coverage >= 50;
  $('#riskExplanation').textContent = r.threshold === 0.6
    ? 'Selected operating point: the smallest reported threshold meeting ≥85% accuracy with ≥50% coverage.'
    : meetsRule
      ? 'Meets the accuracy and coverage targets, but answers fewer photos than the selected 0.60 threshold.'
      : r.coverage < 50
        ? 'Higher answered accuracy, but coverage falls below the 50% selection requirement.'
        : 'Covers more photos, but answered accuracy stays below the 85% selection requirement.';
  const x = c => 45 + c * 4.6;
  const y = a => 135 - (a - 70) * 3.7;
  $('#riskChart').innerHTML = `
    <g class="risk-grid"><path d="M45 25H505M45 62H505M45 99H505M45 136H505"/><text x="5" y="29">100%</text><text x="12" y="66">90%</text><text x="12" y="103">80%</text><text x="40" y="157">0</text><text x="252" y="157">COVERAGE</text><text x="470" y="157">100%</text></g>
    <path class="risk-target" d="M275 20V136M45 ${y(85)}H505"/>
    <polyline class="risk-line" points="${riskData.map(d => `${x(d.coverage)},${y(d.accuracy)}`).join(' ')}"/>
    ${riskData.map(d => `<circle cx="${x(d.coverage)}" cy="${y(d.accuracy)}" r="3.5" class="risk-point"/>`).join('')}
    <circle cx="${x(r.coverage)}" cy="${y(r.accuracy)}" r="8" class="risk-selected"/>
    <text class="risk-point-label" x="${x(r.coverage) - 18}" y="${Math.max(13, y(r.accuracy) - 15)}">t=${r.threshold.toFixed(2)}</text>`;
}

$('#recallChart').innerHTML = classData.map(c => `<div class="recall-row"><div><span>${c.name}</span><small>n = ${c.test}</small></div><div class="recall-track"><i style="width:${c.recall}%"></i></div><strong>${c.recall}%</strong></div>`).join('');
$('#stageControls').innerHTML = measurementStages.map((stage, i) => `<button id="stage-tab-${i}" role="tab" data-stage="${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" aria-controls="stageDescription">${stage.name}</button>`).join('');
const stageDescription = document.createElement('div');
stageDescription.id = 'stageDescription';
stageDescription.setAttribute('role', 'tabpanel');
['#stageNumber', '#stageTitle', '#stageText', '#stageFormula', '#stageNote'].forEach(selector => stageDescription.append($(selector)));
$('.stage-detail').append(stageDescription);

function renderStage(number) {
  const stage = measurementStages[number];
  $('#stageNumber').textContent = `STAGE ${number + 1} / 5`;
  $('#stageTitle').textContent = stage.title;
  $('#stageText').textContent = stage.text;
  $('#stageFormula').textContent = stage.formula;
  $('#stageNote').textContent = stage.note;
  $('#stageDescription').setAttribute('aria-labelledby', `stage-tab-${number}`);
  $('.geometry-illustration').dataset.stage = number;
}

$('#prev').onclick = () => go(index - 1);
$('#next').onclick = () => go(index + 1);
$('[data-next]').onclick = () => go(index + 1);
$$('[data-slide]').forEach(button => button.onclick = () => { go(Number(button.dataset.slide)); $('#overview').close(); });
$$('[data-class]').forEach(button => button.onclick = () => showClass(Number(button.dataset.class)));
$$('[data-theory-chapter]').forEach(button => button.onclick = () => renderTheory(Number(button.dataset.theoryChapter)));
$('#overviewBtn').onclick = () => $('#overview').showModal();
$('#sourcesBtn').onclick = () => $('#sources').showModal();
$('#theoryBtn').onclick = openTheory;
$('#footerTheory').onclick = openTheory;
$('#studyBtn').onclick = toggleStudy;
$$('[data-close]').forEach(button => button.onclick = () => button.closest('dialog').close());
$('#riskSlider').addEventListener('input', renderRisk);
document.addEventListener('input', event => {
  if (!event.target.matches('[data-scale-input]')) return;
  const lab = event.target.closest('[data-scale-lab]');
  const scale = Number(event.target.value) / 100;
  lab.querySelector('[data-scale-value]').textContent = `${scale.toFixed(2)}×`;
  lab.querySelector('[data-scale-length]').textContent = `${scale.toFixed(2)}×`;
  lab.querySelector('[data-scale-area]').textContent = `${(scale ** 2).toFixed(2)}×`;
  lab.querySelector('[data-scale-volume]').textContent = `${(scale ** 3).toFixed(2)}×`;
});
$$('[data-evidence]').forEach(button => button.onclick = () => selectTab(button, 'evidence'));
$$('[data-measure-view]').forEach(button => button.onclick = () => selectTab(button, 'measurement'));
$$('[data-stage]').forEach(button => button.onclick = () => selectTab(button, 'stage'));

function toggleNotes(force) {
  const open = typeof force === 'boolean' ? force : $('#speakerNotes').hidden;
  $('#speakerNotes').hidden = !open;
  $('#notesBtn').setAttribute('aria-pressed', String(open));
}
$('#notesBtn').onclick = () => toggleNotes();
$('#closeNotes').onclick = () => toggleNotes(false);
async function fullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch { $('#announcement').textContent = 'Fullscreen unavailable here. Use your browser’s fullscreen control.'; }
}
$('#fullBtn').onclick = fullscreen;

const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
function setMotion(paused) {
  document.body.classList.toggle('motion-paused', paused);
  $('#motionBtn').setAttribute('aria-pressed', String(paused));
  $('#motionBtn').textContent = paused ? 'Motion off' : 'Motion';
}
setMotion(motionPreference.matches);
$('#motionBtn').onclick = () => setMotion(!document.body.classList.contains('motion-paused'));
motionPreference.addEventListener('change', event => setMotion(event.matches));
$('#printBtn').onclick = () => window.print();

document.addEventListener('keydown', event => {
  const key = event.key.toLowerCase();
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.target.closest('[role="tablist"]') && ['arrowleft', 'arrowright', 'home', 'end'].includes(key)) {
    const tabs = [...event.target.closest('[role="tablist"]').querySelectorAll('[role="tab"]')];
    const current = tabs.indexOf(event.target);
    const next = key === 'home' ? 0 : key === 'end' ? tabs.length - 1 : (current + (key === 'arrowright' ? 1 : -1) + tabs.length) % tabs.length;
    event.preventDefault(); tabs[next].focus(); tabs[next].click(); return;
  }
  if (event.key === 'Escape') { $('#blank').hidden = true; toggleNotes(false); return; }
  if (/INPUT|TEXTAREA|SELECT/.test(event.target.tagName) || document.querySelector('dialog[open]')) return;
  if (!$('#blank').hidden) { if (key === 'b') $('#blank').hidden = true; return; }
  if (event.target.closest('button,a') && [' ', 'enter'].includes(key)) return;
  if (key === 't') openTheory();
  else if (key === 's') toggleStudy();
  else if (key === 'f') fullscreen();
  else if (key === 'o') $('#overview').showModal();
  else if (key === 'n') toggleNotes();
  else if (key === 'm') $('#motionBtn').click();
  else if (key === 'p') window.print();
  else if (key === 'b') $('#blank').hidden = false;
  else if (/^[1-8]$/.test(key)) go(Number(key) - 1);
  else if (studyMode) return;
  else if (['arrowright', 'arrowdown', 'pagedown', ' ', 'enter'].includes(key)) { event.preventDefault(); go(index + 1); }
  else if (['arrowleft', 'arrowup', 'pageup'].includes(key)) { event.preventDefault(); go(index - 1); }
  else if (key === 'home') go(0);
  else if (key === 'end') go(7);
});

let touchStart;
$('#deck').addEventListener('touchstart', event => {
  if (event.target.closest('input,button,a,[role="tablist"]')) return;
  touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
}, { passive: true });
$('#deck').addEventListener('touchend', event => {
  if (!touchStart || studyMode || event.target.closest('input,button,a')) { touchStart = null; return; }
  const dx = event.changedTouches[0].clientX - touchStart.x;
  const dy = event.changedTouches[0].clientY - touchStart.y;
  if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6) go(index + (dx < 0 ? 1 : -1));
  touchStart = null;
}, { passive: true });
renderRisk();
renderStage(0);
window.addEventListener('hashchange', fromHash);
window.addEventListener('beforeprint', () => slides.forEach(slide => { slide.inert = false; slide.removeAttribute('aria-hidden'); }));
window.addEventListener('afterprint', () => go(index, true));
fromHash();
