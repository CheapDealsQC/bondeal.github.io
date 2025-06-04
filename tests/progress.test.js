const fs = require('fs');
const path = require('path');
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const { JSDOM } = require('jsdom');

describe('updateProgressBar', () => {
  test('sets width to 100% on final step', () => {
    const html = `
      <div id="progress-bar-fill"></div>
      <div class="step"></div>
      <div class="step"></div>
      <div class="step"></div>
      <div class="step"></div>
      <div class="step"></div>`;
    const dom = new JSDOM(html, { runScripts: 'outside-only' });
    const script = fs.readFileSync(path.join(__dirname, '../js/main.js'), 'utf8');
    dom.window.eval(script);
    dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));

    dom.window.updateProgressBar(5);

    const fill = dom.window.document.getElementById('progress-bar-fill');
    expect(fill.style.width).toBe('100%');
  });
});
