const fs = require('fs');
const path = require('path');
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const { JSDOM } = require('jsdom');

describe('sanitization', () => {
  test('renders HTML tags as text', async () => {
    const html = fs.readFileSync(path.join(__dirname, '../tracking.html'), 'utf8');
    const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });

    await new Promise(res => dom.window.document.addEventListener('DOMContentLoaded', res));

    dom.window.fetch = () => Promise.resolve({
      json: () => Promise.resolve({
        orderID: '<b>123</b>',
        email: '<i>user@example.com</i>',
        notes: '<script>alert(1)</script>',
        date: '2024-01-01',
        status: 'completed'
      })
    });

    dom.window.document.getElementById('orderNumber').value = '123';
    await dom.window.checkOrder(new dom.window.Event('submit'));

    const details = dom.window.document.getElementById('orderDetails');
    expect(details.textContent).toContain('<b>123</b>');
    expect(details.querySelector('b')).toBeNull();
    expect(details.querySelector('script')).toBeNull();
  });
});
