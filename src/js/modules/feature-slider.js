'use strict';

export function initFeatureSlider() {
  const featureSlider = document.querySelector('.feature-slider');
  if (!featureSlider) {
    return;
  }

  const sliderTrack = featureSlider.querySelector('.feature-slide-track');
  let isDown = false;
  let startX;
  let scrollLeft;

  const startDrag = (x) => {
    isDown = true;
    featureSlider.classList.add('dragging');
    startX = x - featureSlider.offsetLeft;
    scrollLeft = featureSlider.scrollLeft;
  };

  const endDrag = () => {
    isDown = false;
    featureSlider.classList.remove('dragging');
  };

  const moveDrag = (x) => {
    if (!isDown) return;
    const walk = x - featureSlider.offsetLeft - startX;
    featureSlider.scrollLeft = scrollLeft - walk;
  };

  featureSlider.addEventListener('mousedown', e => startDrag(e.pageX));
  featureSlider.addEventListener('touchstart', e => startDrag(e.touches[0].pageX), {passive: true});
  window.addEventListener('mouseup', endDrag);
  featureSlider.addEventListener('touchend', endDrag);
  featureSlider.addEventListener('mousemove', e => moveDrag(e.pageX));
  featureSlider.addEventListener('touchmove', e => moveDrag(e.touches[0].pageX), {passive: true});
} 