import {readFile,access} from 'node:fs/promises';
import assert from 'node:assert/strict';
const html=await readFile('dist/index.html','utf8');
assert.equal((html.match(/class="slide[ "]/g)||[]).length,8,'Exactly eight slides');
for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){if(!/^(https?:|mailto:)/.test(match[1]))await access('dist/'+match[1]);}
for(const file of ['dist/app.js','dist/content.js','dist/style.css','dist/depth.css','dist/assets/slope.png','dist/assets/output.jpg','dist/assets/poster.pdf'])await access(file);
console.log('Verified eight slides and all local assets. Static deployment ready: dist/');
