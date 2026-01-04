// 🔐 KRYV VAULT: API Key & Cost Management System

export const SERVICE_CATALOG = {
    "DeepSeek": { cost: 0, type: "LLM", tier: "Free" },
    "OpenAI": { cost: 0.03, type: "LLM", tier: "Paid" },
    "AlphaVantage": { cost: 0, type: "Finance", tier: "Freemium" },
    "Twitter": { cost: 100, type: "Social", tier: "Enterprise" },
    "Binance": { cost: 0, type: "Crypto", tier: "Free" }
};

export const API_KEYS_STORE: Record<string, string | undefined> = {
    "DeepSeek": process.env.HF_TOKEN_1,
    "OpenAI": process.env.OPENAI_API_KEY,
    "AlphaVantage": process.env.ALPHA_VANTAGE_KEY,
};

// Function to retrieve key (Simulated Security)
export function getSecureKey(serviceName: string) {
    // In production, this would fetch from a secure encrypted DB table
    // ensuring the user has enough credits.
    const key = API_KEYS_STORE[serviceName];
    if (!key) return null;
    return `sk-live-*************${key.slice(-4)}`; // Masked return for frontend
}

// Function to calculate agent cost
export function calculateAgentCost(apis: string[]) {
    let total = 0;
    apis.forEach(api => {
        const service = SERVICE_CATALOG[api as keyof typeof SERVICE_CATALOG];
        if (service && service.tier === "Paid") total += 250; // Add markup
    });
    return total > 0 ? `${total} Credits` : "Free";
}

