```typescript
const VERCEL_TOKEN = process.env.VERCEL_API_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID;

/**
 * Retrieves the latest build error from Vercel API.
 * 
 * @returns {Promise<string|null>} The error message if a build failed, null otherwise.
 */
export async function getLatestBuildError() {
  if (!VERCEL_TOKEN || !PROJECT_ID) return null;

  try {
    // 1. Get latest deployment
    const depRes = await fetch(`https://api.vercel.com/v9/deployments?projectId=${PROJECT_ID}&limit=1`, {
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!depRes.ok) {
      throw new Error(`Failed to fetch deployments: ${depRes.status} ${depRes.statusText}`);
    }

    const deployments = await depRes.json();
    const latest = deployments.deployments?.[0];

    if (!latest || latest.state === 'READY') return null; // No error

    // 2. If Failed, fetch its logs
    if (latest.state === 'ERROR') {
      const logRes = await fetch(`https://api.vercel.com/v9/deployments/${latest.uid}/logs`, {
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!logRes.ok) {
        throw new Error(`Failed to fetch logs: ${logRes.status} ${logRes.statusText}`);
      }

      const logs = await logRes.json();
      const errorMessage = logs.logs.find(log => log.type === 'ERROR')?.message;

      if (errorMessage) {
        return `BUILD FAILED: Deployment ${latest.uid} failed with error: ${errorMessage}`;
      } else {
        return `BUILD FAILED: Deployment ${latest.uid} is in state ${latest.state}. Please check logs manually or ask Architect to fix.`;
      }
    } else {
      return `BUILD FAILED: Deployment ${latest.uid} is in state ${latest.state}. Please check logs manually or ask Architect to fix.`;
    }
  } catch (e) {
    console.error("Vercel API Error:", e);
    return null;
  }
}