// 🔐 THE VAULT: API Key Management
// This file will eventually fetch keys from Secure Storage (Env/DB)
// instead of exposing them to the user.

export const APIMap = {
    "AlphaVantage": process.env.KEY_ALPHA_VANTAGE,
    "OpenAI": process.env.KEY_OPENAI,
    "Twitter": process.env.KEY_TWITTER,
    "DeepSeek": process.env.HF_TOKEN_1
};

export function getApiKey(serviceName: string) {
    // In Phase E, we will add logic here to check if user has paid credits
    // before returning the key.
    return APIMap[serviceName as keyof typeof APIMap] || null;
}
