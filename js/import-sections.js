// Import external section HTML into index.html placeholders

document.addEventListener('DOMContentLoaded', () => {
  const sections = ['price', 'process', 'comparatif'];
  const mapping = {
    price: 'sections/price-section.html',
    process: 'sections/process-section.html',
    comparatif: 'sections/comparative-section.html'
  };

  sections.forEach(key => {
    const container = document.getElementById(key + '-section');
    if (!container) return;
    fetch(mapping[key])
      .then(resp => resp.ok ? resp.text() : Promise.reject(resp.statusText))
      .then(html => container.innerHTML = html)
      .catch(err => console.error('Error importing section', key, err));
  });
});
