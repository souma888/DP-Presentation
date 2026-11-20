import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';

// Exercise the real controller with a minimal DOM contract. These are not layout tests.
class Element {
 constructor(){this.hidden=true;this.attrs={};this.classes=new Set();this.classList={toggle:(c,on)=>on?this.classes.add(c):this.classes.delete(c),contains:c=>this.classes.has(c)};this.style={};this.dataset={};this.tagName='DIV';this.listeners={};}
 setAttribute(k,v){this.attrs[k]=v}
 removeAttribute(k){delete this.attrs[k]}
 addEventListener(k,f){this.listeners[k]=f}
 insertAdjacentHTML(){}
 closest(){return null}
 focus(){document.activeElement=this}
 showModal(){this.open=true}
 close(){this.open=false}
 click(){this.onclick?.()}
}
const html=await readFile('dist/index.html','utf8');
const slides=[...html.matchAll(/<section class="slide[^>]+data-title="([^"]+)"/g)].map(m=>{const e=new Element();e.dataset.title=m[1];return e});
const ids=new Map([...html.matchAll(/id="([^"]+)"/g)].map(m=>['#'+m[1],new Element()]));
const buttons=Array.from({length:16},(_,i)=>{const e=new Element();e.dataset.slide=String(i%8);return e});
const next=new Element(), body=new Element(), events={}, winEvents={};
const document={body,activeElement:null,title:'',fullscreenElement:null,documentElement:{requestFullscreen:async()=>{document.fullscreenElement=true}},exitFullscreen:async()=>{document.fullscreenElement=null},
 querySelector:s=>s==='[data-next]'?next:s==='dialog[open]'?[ids.get('#overview'),ids.get('#sources')].find(e=>e.open):ids.get(s),
 querySelectorAll:s=>s==='.slide'?slides:s==='[data-slide]'?buttons:s==='#overviewGrid button'?buttons.slice(8):[],
 addEventListener:(k,f)=>events[k]=f};
let hash='#1', printed=0;
const context={document,location:{get hash(){return hash}},history:{pushState:(_a,_b,h)=>hash=h,replaceState:(_a,_b,h)=>hash=h},matchMedia:()=>({matches:false,addEventListener(){}}),window:{addEventListener:(k,f)=>winEvents[k]=f,print:()=>printed++},console};
vm.createContext(context);vm.runInContext(await readFile('dist/app.js','utf8'),context);
const key=k=>events.keydown({key:k,target:new Element(),preventDefault(){}});
const current=()=>ids.get('#current').textContent;
assert.equal(slides.length,8);
assert.equal(current(),'01');assert.equal(ids.get('#prev').disabled,true);
key('ArrowRight');assert.equal(current(),'02');
key('8');assert.equal(current(),'08');assert.equal(ids.get('#next').disabled,true);
key('ArrowRight');assert.equal(current(),'08');
key('Home');key('ArrowLeft');assert.equal(current(),'01');
key('6');assert.equal(hash,'#6');assert.equal(slides.filter(s=>!s.inert).length,1);
key('n');assert.equal(ids.get('#speakerNotes').hidden,false);assert.equal(ids.get('#notesBtn').attrs['aria-pressed'],'true');
key('Escape');assert.equal(ids.get('#speakerNotes').hidden,true);assert.equal(ids.get('#notesBtn').attrs['aria-pressed'],'false');
key('b');assert.equal(ids.get('#blank').hidden,false);key('ArrowRight');assert.equal(current(),'06');key('Escape');
key('o');assert.equal(ids.get('#overview').open,true);key('ArrowRight');assert.equal(current(),'06');
buttons[2].click();assert.equal(current(),'03');assert.equal(ids.get('#overview').open,false);
key('m');assert.equal(body.classList.contains('motion-paused'),true);key('m');assert.equal(body.classList.contains('motion-paused'),false);
key('p');assert.equal(printed,1);
winEvents.beforeprint();assert.equal(slides.every(s=>!s.inert),true);winEvents.afterprint();assert.equal(slides.filter(s=>!s.inert).length,1);
hash='#invalid';winEvents.hashchange();assert.equal(current(),'01');hash='#7';winEvents.hashchange();assert.equal(current(),'07');
ids.get('#deck').listeners.touchstart({touches:[{clientX:250,clientY:150}]});
ids.get('#deck').listeners.touchend({changedTouches:[{clientX:100,clientY:155}],target:new Element()});assert.equal(current(),'08');
assert.equal(ids.get('#progress').style.width,'100%');
console.log('Passed controller checks: navigation, boundaries, deep links, overview, notes, motion, blank screen, print state, and touch.');
