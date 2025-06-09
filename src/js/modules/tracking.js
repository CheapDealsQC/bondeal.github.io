'use strict';

const API_URL = 'https://script.google.com/macros/s/AKfycbxEmJdgcerK1ENvsy8IvSnAZDJ6p4fr9hfO87haKbKrVXZaRf2Z3wnRzyQSDl527VtW/exec';

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

/**
 * Fetches order data from the API.
 * @param {string} orderNumber The order number to look up.
 * @returns {Promise<object|null>} The order data or null if not found.
 */
async function fetchTrackingData(orderNumber) {
    const loadingOverlay = document.getElementById('loading-overlay');
    if(loadingOverlay) loadingOverlay.style.display = 'flex';
    
    try {
        const response = await fetch(`${API_URL}?orderID=${orderNumber}`);
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        if (data.error) {
            return null; // Order not found
        }
        return data;
    } catch (error) {
        console.error('Failed to fetch tracking data:', error);
        return null;
    } finally {
        if(loadingOverlay) loadingOverlay.style.display = 'none';
    }
}

/**
 * Renders the tracking information on the page.
 * @param {object|null} data The order data.
 * @param {HTMLElement} resultContainer The container to render the results in.
 */
function displayTrackingResult(data, resultContainer) {
    resultContainer.innerHTML = '';
    resultContainer.classList.remove('hidden');

    if (!data) {
        resultContainer.innerHTML = `<p class="error-message">Commande non trouvée. Veuillez vérifier le numéro et réessayer.</p>`;
        return;
    }

    const statuses = {
        'pending': { text: 'En attente', step: 1},
        'processing': { text: 'En traitement', step: 2},
        'completed': { text: 'Terminée', step: 3}
    };
    const currentStatus = statuses[data.status] || { text: 'Inconnu', step: 0 };
    
    const resultHTML = `
        <div class="tracking-header">
            <div class="tracking-info">
                <h3>Commande #${data.orderID}</h3>
                <p class="tracking-date">Date: ${new Date(data.date).toLocaleDateString()}</p>
            </div>
            <div class="tracking-status">
                <span class="status-badge status-${data.status}">${currentStatus.text}</span>
            </div>
        </div>
        <div class="tracking-timeline">
            <div class="timeline-item ${currentStatus.step >= 1 ? 'completed' : ''}">
                <div class="timeline-icon">📝</div>
                <div class="timeline-content"><h4>Commande Reçue</h4><p>Votre commande a été enregistrée.</p></div>
            </div>
            <div class="timeline-item ${currentStatus.step >= 2 ? 'completed' : ''}">
                <div class="timeline-icon">⚙️</div>
                <div class="timeline-content"><h4>En Traitement</h4><p>Nous préparons l'activation de votre compte.</p></div>
            </div>
            <div class="timeline-item ${currentStatus.step >= 3 ? 'completed' : ''}">
                <div class="timeline-icon">✅</div>
                <div class="timeline-content"><h4>Activation Terminée</h4><p>Votre abonnement est actif. Un email de confirmation a été envoyé.</p></div>
            </div>
        </div>
        ${data.notes ? `<div class="tracking-notes"><h4>Notes:</h4><p>${data.notes}</p></div>` : ''}
    `;
    
    resultContainer.innerHTML = resultHTML;
}

/**
 * Initializes the order tracking functionality on the tracking page.
 */
function initStandaloneTracking() {
    const trackOrderBtn = document.getElementById('track-order-btn');
    const orderNumberInput = document.getElementById('order-number');
    const trackingResult = document.querySelector('.tracking-result');

    if (trackOrderBtn && orderNumberInput && trackingResult) {
        const trackOrder = async () => {
            const orderNumber = orderNumberInput.value.trim();
            if (!orderNumber) {
                alert('Veuillez entrer un numéro de commande.');
                return;
            };
            const data = await fetchTrackingData(orderNumber);
            displayTrackingResult(data, trackingResult);
        };
        
        trackOrderBtn.addEventListener('click', trackOrder);
        orderNumberInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') trackOrder();
        });
    }
}

/**
 * Simulates the progress of order activation for the homepage display.
 */
function simulateHomepageProgress() {
    const activationProgress = document.getElementById('activation-progress');
    if (!activationProgress) return;
    
    // This is mock data for demonstration on the homepage.
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
}

export function initTracking() {
    // This function is called by main.js and will run on ALL pages.
    // We need to check which functionality to initialize based on the current page.

    if (document.getElementById('activation-progress')) {
        // We are likely on the homepage, initialize the progress bar simulation.
        simulateHomepageProgress();
    }

    if (document.querySelector('.tracking-search')) {
        // We are on the standalone tracking page.
        initStandaloneTracking();
    }
} 