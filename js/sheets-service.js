class SheetsService {
    constructor() {
        this.SPREADSHEET_ID = CONFIG.SPREADSHEET_ID;
        this.SERVICE_ACCOUNT = CONFIG.SERVICE_ACCOUNT;
    }

    async getAuthToken() {
        const now = Math.floor(Date.now() / 1000);
        const exp = now + 3600; // Token valide pendant 1 heure

        const header = {
            alg: 'RS256',
            typ: 'JWT',
            kid: this.SERVICE_ACCOUNT.private_key_id
        };

        const claim = {
            iss: this.SERVICE_ACCOUNT.client_email,
            scope: 'https://www.googleapis.com/auth/spreadsheets',
            aud: this.SERVICE_ACCOUNT.token_uri,
            exp: exp,
            iat: now
        };

        const encodedHeader = btoa(JSON.stringify(header));
        const encodedClaim = btoa(JSON.stringify(claim));
        const signatureInput = `${encodedHeader}.${encodedClaim}`;

        // Signer avec la clé privée
        const signature = await this.sign(signatureInput);
        const encodedSignature = btoa(signature);

        const jwt = `${encodedHeader}.${encodedClaim}.${encodedSignature}`;

        // Échanger le JWT contre un token d'accès
        const response = await fetch(this.SERVICE_ACCOUNT.token_uri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
        });

        const data = await response.json();
        return data.access_token;
    }

    async sign(input) {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const key = await crypto.subtle.importKey(
            'pkcs8',
            this.base64ToArrayBuffer(this.SERVICE_ACCOUNT.private_key),
            {
                name: 'RSASSA-PKCS1-v1_5',
                hash: 'SHA-256'
            },
            false,
            ['sign']
        );
        const signature = await crypto.subtle.sign(
            'RSASSA-PKCS1-v1_5',
            key,
            data
        );
        return String.fromCharCode.apply(null, new Uint8Array(signature));
    }

    base64ToArrayBuffer(base64) {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    async getOrders() {
        const token = await this.getAuthToken();
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${this.SPREADSHEET_ID}/values/Commandes!A2:E`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        const data = await response.json();
        return data.values || [];
    }

    async updateOrder(orderIndex, orderData) {
        const token = await this.getAuthToken();
        const range = `Commandes!A${orderIndex + 2}:E${orderIndex + 2}`;
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${this.SPREADSHEET_ID}/values/${range}?valueInputOption=RAW`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    values: [orderData]
                })
            }
        );
        return response.ok;
    }
} 