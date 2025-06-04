class SheetsService {
    constructor(baseUrl = '') {
        this.baseUrl = baseUrl;
    }

    async getOrders() {
        const response = await fetch(`${this.baseUrl}/orders`);
        return await response.json();
    }

    async updateOrder(orderIndex, orderData) {
        const response = await fetch(`${this.baseUrl}/orders/${orderIndex}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        return response.ok;
    }
}

export default SheetsService;
