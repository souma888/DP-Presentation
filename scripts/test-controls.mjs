import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';

// Controller contract tests. Browser QA separately checks actual layout and focus.
const elements = new Map();
const all = [];
const events = {};
const windowEvents = {};
let document;
class Element {
  constructor() {
    this.hidden = false;
    this.attrs = {};
    this.classes = new Set();
    this.classList = { toggle: (name, on) => on ? this.classes.add(name) : this.classes.delete(name), contains: name => this.classes.has(name) };
    this.style = {};
    this.dataset = {};
    this.tagName = 'DIV';
    this.listeners = {};
    this.children = [];
    this.textContent = '';
    this.value = '2';
  }
  set innerHTML(value) {
    this.markup = value;
    // Retain only generated controls needed by the controller contract.
    for (const match of value.matchAll(/<button\b([^>]*)>/g)) {
      const button = parseElement(match[1]);
      button.tagName = 'BUTTON';
      button.parentElement = this;
      this.children.push(button);
    }
  }
  get innerHTML() { return this.markup || ''; }
  setAttribute(key, value) { this.attrs[key] = String(value); }
  getAttribute(key) { return this.attrs[key] ?? null; }
  removeAttribute(key) { delete this.attrs[key]; }
  addEventListener(name, callback) { this.listeners[name] = callback; }
  append(child) { child.parentElement = this; this.children.push(child); }
  scrollIntoView() {}
  closest(selector) {
    if (selector === '[role="tablist"]') return this.parentElement;
    return null;
  }
  querySelectorAll(selector) {
    return this.children.filter(child => selector === '[role="tab"]' ? child.attrs.role === 'tab' : false);
  }
  focus() { document.activeElement = this; }
  showModal() { this.open = true; }
  close() { this.open = false; }
  click() { this.onclick?.(); }
}
function parseElement(attributes) {
  const element = new Element();
  for (const match of attributes.matchAll(/([\w-]+)="([^"]*)"/g)) {
    const [, key, value] = match;
    element.attrs[key] = value;
    if (key === 'id') elements.set('#' + value, element);
    if (key.startsWith('data-')) element.dataset[key.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = value;
  }
  for (const match of attributes.matchAll(/\bdata-(close|next)(?=\s|$)/g)) element.dataset[match[1]] = '';
  if (/\bhidden\b/.test(attributes)) element.hidden = true;
  all.push(element);
  return element;
}
const html = await readFile('dist/index.html', 'utf8');
for (const match of html.matchAll(/<([a-z][\w-]*)\b([^>]*)>/g)) {
  if (!/\bid=|data-close|data-next|data-evidence|data-measure-view/.test(match[2])) continue;
  const element = parseElement(match[2]);
  element.tagName = match[1].toUpperCase();
}
const slides = [...html.matchAll(/<section class="slide[^>]+data-title="([^"]+)"/g)].map(match => {
  const element = new Element(); element.dataset.title = match[1]; return element;
});
const body = new Element();
const fallback = new Map();
const get = selector => elements.get(selector) || (fallback.has(selector) ? fallback.get(selector) : fallback.set(selector, new Element()).get(selector));
const next = all.find(element => 'next' in element.dataset);
const evidenceGroup = new Element();
all.filter(element => 'evidence' in element.dataset).forEach(element => { element.parentElement = evidenceGroup; evidenceGroup.children.push(element); });
const measureGroup = new Element();
all.filter(element => 'measureView' in element.dataset).forEach(element => { element.parentElement = measureGroup; measureGroup.children.push(element); });
document = {
  body, activeElement: null, title: '', fullscreenElement: null,
  documentElement: { requestFullscreen: async () => { document.fullscreenElement = true; } },
  exitFullscreen: async () => { document.fullscreenElement = null; },
  createElement: () => new Element(),
  querySelector(selector) {
    if (selector === '[data-next]') return next;
    if (selector === 'dialog[open]') return [...elements.values()].find(element => element.open);
    return get(selector);
  },
  querySelectorAll(selector) {
    if (selector === '.slide') return slides;
    const match = selector.match(/^\[data-([\w-]+)\]$/);
    if (match) { const name = match[1].replace(/-([a-z])/g, (_, c) => c.toUpperCase()); return all.filter(element => name in element.dataset); }
    return [];
  },
  getElementById: id => get('#' + id),
  addEventListener: (name, callback) => { events[name] = callback; }
};
let hash = '#1';
let printed = 0;
const context = vm.createContext({
  document,
  location: { get hash() { return hash; } },
  history: { pushState: (_a, _b, h) => { hash = h; }, replaceState: (_a, _b, h) => { hash = h; } },
  matchMedia: () => ({ matches: false, addEventListener() {} }),
  IntersectionObserver: class { observe() {} disconnect() {} },
  window: { addEventListener: (name, callback) => { windowEvents[name] = callback; }, print: () => { printed++; } },
  console
});
vm.runInContext(await readFile('dist/content.js', 'utf8'), context);
vm.runInContext(await readFile('dist/app.js', 'utf8'), context);
const key = (name, target = new Element()) => events.keydown({ key: name, target, preventDefault() {} });
const current = () => get('#current').textContent;
assert.equal(slides.length, 8);
assert.equal(current(), '01'); assert.equal(get('#prev').disabled, true);
key('ArrowRight'); assert.equal(current(), '02');
key('8'); assert.equal(current(), '08'); assert.equal(get('#next').disabled, true);
key('ArrowRight'); assert.equal(current(), '08');
key('Home'); key('ArrowLeft'); assert.equal(current(), '01');
key('6'); assert.equal(hash, '#6'); assert.equal(slides.filter(slide => !slide.inert).length, 1);
key('n'); assert.equal(get('#speakerNotes').hidden, false);
key('Escape'); assert.equal(get('#speakerNotes').hidden, true); assert.equal(get('#notesBtn').attrs['aria-pressed'], 'false');
key('b'); key('ArrowRight'); assert.equal(current(), '06'); key('Escape');
key('o'); key('ArrowRight'); assert.equal(current(), '06');
all.find(element => element.dataset.slide === '2').click(); assert.equal(current(), '03'); assert.equal(get('#overview').open, false);
key('m'); assert.equal(body.classList.contains('motion-paused'), true); key('m'); assert.equal(body.classList.contains('motion-paused'), false);
key('p'); assert.equal(printed, 1);
windowEvents.beforeprint(); assert.equal(slides.every(slide => !slide.inert), true);
windowEvents.afterprint(); assert.equal(slides.filter(slide => !slide.inert).length, 1);
key('t'); assert.equal(get('#theoryDialog').open, true); assert.match(get('#theoryBody').innerHTML, /taxonomy/i);
get('#theoryDialog').close();
key('s'); assert.equal(body.classList.contains('study-mode'), true); assert.equal(slides.every(slide => !slide.inert), true);
key('s'); assert.equal(body.classList.contains('study-mode'), false); assert.equal(slides.filter(slide => !slide.inert).length, 1);
const riskTab = all.find(element => element.dataset.evidence === 'risk');
riskTab.click(); assert.equal(get('#evidence-risk').hidden, false); assert.equal(get('#evidence-models').hidden, true);
get('#riskSlider').value = '4'; get('#riskSlider').listeners.input();
assert.equal(get('#riskThreshold').textContent, '0.80'); assert.equal(get('#riskCoverage').textContent, '46%'); assert.equal(get('#riskAccuracy').textContent, '94.4%');
key('ArrowRight', get('#riskSlider')); assert.equal(current(), '03', 'Slider keys must not advance the deck');
all.find(element => element.dataset.stage === '3').click(); assert.match(get('#stageTitle').textContent, /Back-project/);
all.find(element => element.dataset.class === '4').click(); assert.equal(get('#classDialog').open, true); assert.match(get('#classBody').innerHTML, /51/);
get('#classDialog').close();
hash = '#invalid'; windowEvents.hashchange(); assert.equal(current(), '01');
hash = '#7'; windowEvents.hashchange(); assert.equal(current(), '07');
get('#deck').listeners.touchstart({ touches: [{ clientX: 250, clientY: 150 }], target: new Element() });
get('#deck').listeners.touchend({ changedTouches: [{ clientX: 100, clientY: 155 }], target: new Element() });
assert.equal(current(), '08'); assert.equal(get('#progress').style.width, '100%');
assert.equal(vm.runInContext('chapterData.length', context), 8);
assert.equal(vm.runInContext('classData.reduce((n, c) => n + c.train + c.val + c.test, 0)', context), 1325);
console.log('Passed navigation, modal, study, tab, measured-threshold, category, print, motion, and touch contracts.');
