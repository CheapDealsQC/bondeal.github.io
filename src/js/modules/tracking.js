'use strict';

function updateProgressBar(step) {
  const fill = document.getElementById('progress-bar-fill');
  const steps = document.querySelectorAll('.step');
  if (!fill || !steps.length) return;

  let percent = 0;
  if (step === 1) percent = 0;
  else if (step === 2) percent = 20;
  else if (step === 3) percent = 40;
  else if (step === 4) percent = 60;
  else if (step === 5) percent = 100;
  
  fill.style.width = percent + '%';
  
  steps.forEach((s, index) => {
    const stepNum = index + 1;
    s.classList.remove('active', 'completed');

    if (stepNum < step) {
      s.classList.add('completed');
    } else if (stepNum === step) {
      s.classList.add('active');
    }
  });
}

function initOrderTracking() {
    const trackSection = document.getElementById('order-tracking');
    if (trackSection) {
        const trackOrderBtn = trackSection.querySelector('#track-order-btn');
        const orderNumberInput = trackSection.querySelector('#order-number');
        const trackingResult = trackSection.querySelector('.tracking-result');

        if (trackOrderBtn && orderNumberInput && trackingResult) {
            trackOrderBtn.addEventListener('click', () => {
                const orderNumber = orderNumberInput.value.trim();
                if (!orderNumber) return;

                // NOTE: The following is mock data for demonstration purposes.
                // In a real application, this would be an API call to a backend service.
                trackingResult.style.display = 'block';

                document.getElementById('result-order-number').textContent = orderNumber;
                document.getElementById('result-order-date').textContent = new Date().toLocaleDateString();
                document.getElementById('result-email').textContent = 'exemple@email.com';
                document.getElementById('result-amount').textContent = '82,62$ CAD';
                document.getElementById('result-payment-method').textContent = 'PayPal';
                document.getElementById('result-estimated-time').textContent = '3 à 5 jours ouvrables';

                const now = new Date();
                document.getElementById('timeline-order-date').textContent = now.toLocaleString();
                document.getElementById('timeline-payment-date').textContent = new Date(now.getTime() + 1000 * 60 * 30).toLocaleString();
                document.getElementById('timeline-verification-date').textContent = new Date(now.getTime() + 1000 * 60 * 60).toLocaleString();
                document.getElementById('timeline-activation-date').textContent = 'En attente';
                document.getElementById('timeline-confirmation-date').textContent = 'En attente';
                
                const simulateProgress = () => {
                    let currentStep = 1;
                    updateProgressBar(currentStep);
                    const interval = setInterval(() => {
                        currentStep++;
                        if (currentStep > 5) {
                            clearInterval(interval);
                            return;
                        }
                        updateProgressBar(currentStep);
                    }, 2000);
                };

                simulateProgress();
            });
        }
    }
}

export function initTracking() {
    initOrderTracking();
    // Expose a global function if other scripts need it
    window.updateProgressBar = updateProgressBar;
} 