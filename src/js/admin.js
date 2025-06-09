'use strict';

import { checkAuth, logout, getAdminHash } from './modules/auth.js';

// --- GLOBAL STATE ---
// The API URL should be configured in a more secure way in a real-world app.
const API_URL = 'https://script.google.com/macros/s/AKfycbxEmJdgcerK1ENvsy8IvSnAZDJ6p4fr9hfO87haKbKrVXZaRf2Z3wnRzyQSDl527VtW/exec';
let allOrders = []; // Cache for all orders to allow local filtering/sorting.

// --- AUTHENTICATION ---
/**
 * Handles the initial password check if the user is not already logged in via localStorage.
 */
async function initAdminView() {
    const pwd = document.getElementById("adminPassword").value.trim();
    if (!pwd) {
        alert("Veuillez entrer un mot de passe.");
        return;
    }

    const ADMIN_PASSWORD_HASH = await getAdminHash();
    if (!ADMIN_PASSWORD_HASH) return; // Error is handled in getAdminHash

    const inputHash = await hashPassword(pwd);

    if (inputHash !== ADMIN_PASSWORD_HASH) {
        alert("Mot de passe incorrect.");
        return;
    }
    
    // On successful manual login, store the hash and show the content
    localStorage.setItem('adminPasswordHash', inputHash);
    document.querySelector('.password-section').style.display = 'none';
    document.getElementById('adminContent').style.display = 'block';
    loadOrders();
}

/**
 * A simple SHA-256 hashing function wrapper.
 * @param {string} pwd The password to hash.
 * @returns {Promise<string>} The hashed password.
 */
async function hashPassword(pwd) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pwd));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}


// --- API CALLS ---
/**
 * Loads all orders from the Google Script API.
 */
async function loadOrders() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const errorMessage = document.getElementById('errorMessage');
    const orderList = document.getElementById('orderList');
    
    loadingIndicator.style.display = 'block';
    errorMessage.style.display = 'none';
    orderList.textContent = '';

    try {
        const res = await fetch(API_URL);
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: `Erreur HTTP: ${res.status}` }));
            throw new Error(errorData.error || `Erreur HTTP: ${res.status}`);
        }
        const data = await res.json();
        if (data.error) {
            throw new Error(data.error);
        }
        allOrders = data; // Cache the orders
        updateStats(allOrders);
        displayOrders(sortOrders(allOrders));
    } catch (error) {
        console.error("Erreur lors du chargement des commandes:", error);
        errorMessage.textContent = "Erreur lors du chargement des commandes: " + error.message;
        errorMessage.style.display = 'block';
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

/**
 * Updates an order's status and notes via API.
 * @param {string} orderID The ID of the order to update.
 */
async function updateOrder(orderID) {
    const status = document.getElementById(`status-${orderID}`).value;
    const notes = document.getElementById(`notes-${orderID}`).value;
    const messageDiv = document.getElementById(`message-${orderID}`);
    messageDiv.textContent = '';
    messageDiv.className = '';

    const adminPasswordHash = localStorage.getItem('adminPasswordHash');
    if (!adminPasswordHash) {
        alert("Session expirée. Veuillez vous reconnecter.");
        logout();
        return;
    }
    
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = 'block';

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                password: adminPasswordHash,
                action: 'updateOrder',
                orderID,
                status,
                notes
            })
        });

        const result = await res.json();
        
        if (result.success) {
            messageDiv.textContent = result.message || "Commande mise à jour avec succès!";
            messageDiv.className = 'success-message';
            // Update local cache
            const orderIndex = allOrders.findIndex(o => o.orderID === orderID);
            if (orderIndex > -1) {
                allOrders[orderIndex].status = status;
                allOrders[orderIndex].notes = notes;
            }
            updateStats(allOrders);
        } else {
            throw new Error(result.error || "Impossible de mettre à jour la commande.");
        }
    } catch (error) {
        messageDiv.textContent = `Erreur: ${error.message}`;
        messageDiv.className = 'error-message';
        console.error("Erreur lors de la mise à jour:", error);
    } finally {
        loadingIndicator.style.display = 'none';
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = '';
        }, 5000);
    }
}

/**
 * Resends a confirmation email for an order.
 * @param {string} orderID The ID of the order.
 */
async function resendEmail(orderID) {
    const adminPasswordHash = localStorage.getItem('adminPasswordHash');
    if (!adminPasswordHash) return alert('Session expirée. Veuillez vous reconnecter.');
    
    alert('Tentative de renvoi de l\'email...');
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPasswordHash, action: 'resendEmail', orderID })
    });
    const data = await res.json().catch(() => ({}));
    alert(data.message || 'Email renvoyé (ou une erreur est survenue).');
}

/**
 * Deletes an order after confirmation.
 * @param {string} orderID The ID of the order to delete.
 */
async function deleteOrder(orderID) {
    const adminPasswordHash = localStorage.getItem('adminPasswordHash');
    if (!adminPasswordHash) return alert('Session expirée. Veuillez vous reconnecter.');
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la commande ${orderID} ? Cette action est irréversible.`)) return;

    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPasswordHash, action: 'deleteOrder', orderID })
    });
    const data = await res.json().catch(() => ({}));
    if (data.success) {
        allOrders = allOrders.filter(o => o.orderID !== orderID);
        filterAndDisplayOrders();
    } else {
        alert(data.error || 'Erreur lors de la suppression.');
    }
}

// --- UI & DISPLAY ---

/**
 * Renders a list of orders to the DOM.
 * @param {Array} orders The orders to display.
 */
function displayOrders(orders) {
    const container = document.getElementById('orderList');
    container.innerHTML = '';
    if (orders.length === 0) {
        container.innerHTML = '<p>Aucune commande à afficher.</p>';
        return;
    }

    orders.forEach(order => {
        const dateObj = new Date(order.date);
        const formattedDate = !isNaN(dateObj) 
            ? dateObj.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
            : 'Date invalide';

        const orderItemHTML = `
            <div class="order-item" data-order-id="${order.orderID}">
                <div class="order-header">
                    <h3>Commande: ${order.orderID}</h3>
                </div>
                <div class="order-details">
                    <p><strong>Email:</strong> ${order.email || 'Non fourni'}</p>
                    <p><strong>Date:</strong> ${formattedDate}</p>
                    <div class="order-actions">
                        <label for="status-${order.orderID}">Statut:</label>
                        <select id="status-${order.orderID}" class="status-select">
                            ${['pending', 'processing', 'completed', 'cancelled', 'refunded']
                                .map(s => `<option value="${s}" ${order.status === s ? 'selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`)
                                .join('')}
                        </select>

                        <label for="notes-${order.orderID}">Notes:</label>
                        <textarea id="notes-${order.orderID}" class="notes-input" rows="3">${order.notes || ''}</textarea>
                        
                        <div class="action-buttons">
                            <button class="save-btn update-btn" data-id="${order.orderID}">✏️ Sauvegarder</button>
                            <button class="save-btn resend-btn" data-id="${order.orderID}" title="Renvoyer l'email">📧</button>
                            <button class="save-btn delete-btn" data-id="${order.orderID}" title="Supprimer">🗑️</button>
                        </div>
                        <div id="message-${order.orderID}" class="message-area"></div>
                    </div>
                </div>
            </div>`;
        container.insertAdjacentHTML('beforeend', orderItemHTML);
    });
}

/**
 * Updates the statistics boxes.
 * @param {Array} data The full list of orders.
 */
function updateStats(data) {
    const total = data.length;
    const pending = data.filter(o => o.status === 'pending').length;
    const today = data.filter(o => {
        const orderDate = new Date(o.date);
        const now = new Date();
        return orderDate.toDateString() === now.toDateString();
    }).length;
    
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1) ));
    weekStart.setHours(0,0,0,0);

    const weekOrders = data.filter(o => new Date(o.date) >= weekStart);
    const completedThisWeek = weekOrders.filter(o => o.status === 'completed').length;
    const completionRate = weekOrders.length > 0 ? Math.round((completedThisWeek / weekOrders.length) * 100) : 0;

    document.getElementById('stat-total').textContent = `Total: ${total}`;
    document.getElementById('stat-pending').textContent = `En attente: ${pending}`;
    document.getElementById('stat-today').textContent = `Aujourd'hui: ${today}`;
    document.getElementById('stat-week').textContent = `Complété cette semaine: ${completionRate}%`;
}


// --- UTILS & EVENT HANDLERS ---
/**
 * Sorts a list of orders based on the selected sort option.
 * @param {Array} list The list of orders to sort.
 * @returns {Array} The sorted list.
 */
function sortOrders(list) {
    const sortValue = document.getElementById('sortSelect').value;
    return [...list].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortValue === 'date-asc' ? dateA - dateB : dateB - dateA;
    });
}

/**
 * Filters and sorts orders based on search and filter controls, then displays them.
 */
function filterAndDisplayOrders() {
    const searchTerm = document.getElementById('searchBox').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    
    if (!allOrders) return;

    let filtered = allOrders.filter(order => {
        const searchMatch = !searchTerm ||
            (order.orderID && String(order.orderID).toLowerCase().includes(searchTerm)) ||
            (order.email && order.email.toLowerCase().includes(searchTerm));
        
        const statusMatch = statusFilter === 'all' || order.status === statusFilter;

        return searchMatch && statusMatch;
    });

    const sorted = sortOrders(filtered);
    displayOrders(sorted);
}

/**
 * Exports the currently filtered orders to a CSV file.
 */
function exportCSV() {
    if (!allOrders.length) return;
    // This exports ALL orders, not just filtered ones. This can be changed if needed.
    const headers = ['orderID', 'email', 'date', 'status', 'notes'];
    const rows = allOrders.map(order => 
        headers.map(header => `"${(order[header] || '').toString().replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    const csvContent = `${headers.join(',')}\n${rows}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `spotideals_orders_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Attaches all necessary event listeners.
 */
function setupEventListeners() {
    document.getElementById('statusFilter').addEventListener('change', filterAndDisplayOrders);
    document.getElementById('sortSelect').addEventListener('change', filterAndDisplayOrders);
    document.getElementById('searchBox').addEventListener('input', filterAndDisplayOrders);
    
    document.getElementById('exportCsvBtn').addEventListener('click', exportCSV);
    document.getElementById('printBtn').addEventListener('click', () => window.print());
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    const accessBtn = document.querySelector('.password-section button');
    if (accessBtn) {
        accessBtn.addEventListener('click', initAdminView);
    }
    document.getElementById('adminPassword').addEventListener('keypress', (e) => {
        if(e.key === 'Enter') initAdminView();
    });

    // Delegated event listeners for dynamically created buttons
    document.getElementById('orderList').addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const orderId = target.dataset.id;
        if (target.classList.contains('update-btn')) {
            updateOrder(orderId);
        } else if (target.classList.contains('resend-btn')) {
            resendEmail(orderId);
        } else if (target.classList.contains('delete-btn')) {
            deleteOrder(orderId);
        }
    });
}

// --- INITIALIZATION ---
/**
 * Main function to initialize the admin page.
 */
async function initializeAdminPage() {
    const storedHash = localStorage.getItem('adminPasswordHash');
    const ADMIN_PASSWORD_HASH = await getAdminHash();

    // If config fails, auth module shows an error. Stop execution.
    if (!ADMIN_PASSWORD_HASH) return;

    if (storedHash === ADMIN_PASSWORD_HASH) {
        // User is properly logged in
        document.querySelector('.password-section').style.display = 'none';
        document.getElementById('adminContent').style.display = 'block';
        setupEventListeners();
        loadOrders();
    } else {
        // User is not logged in, show password prompt and set up basic listeners
        document.querySelector('.password-section').style.display = 'block';
        document.getElementById('adminContent').style.display = 'none';
        // Remove admin-only listeners if password is not good
        setupEventListeners(); // We still need logout and the password prompt listeners.
    }
}


// --- SCRIPT EXECUTION ---
// Protect the page first, then initialize.
// Note: `checkAuth` will redirect if authentication fails. The code below will only run if auth succeeds.
// However, the current logic allows the user to enter a password on the page itself,
// so a full checkAuth() redirect isn't appropriate. We'll do a manual check instead.
document.addEventListener('DOMContentLoaded', initializeAdminPage); 