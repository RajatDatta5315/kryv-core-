```typescript
const VERCEL_TOKEN = process.env.VERCEL_API_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID;

/**
 * Fetches the latest deployment error from Vercel.
 * 
 * @returns {Promise<string|null>} The error message or null if no error occurred.
 */
export async function getLatestBuildError(): Promise<string | null> {
  if (!VERCEL_TOKEN || !PROJECT_ID) return null;

  try {
    // 1. Get Deployment Status
    const deploymentResponse = await fetch(`https://api.vercel.com/v6/deployments?projectId=${PROJECT_ID}&limit=1`, {
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` }
    });

    if (!deploymentResponse.ok) {
      throw new Error(`Failed to fetch deployment status: ${deploymentResponse.status} ${deploymentResponse.statusText}`);
    }

    const deploymentData = await deploymentResponse.json();
    const latestDeployment = deploymentData.deployments?.[0];

    if (!latestDeployment || latestDeployment.state === 'READY') return null;

    // 2. Fetch Actual Logs (Events)
    const logResponse = await fetch(`https://api.vercel.com/v2/deployments/${latestDeployment.uid}/events?limit=100`, {
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` }
    });

    if (!logResponse.ok) {
      throw new Error(`Failed to fetch logs: ${logResponse.status} ${logResponse.statusText}`);
    }

    const logData = await logResponse.json();

    // 3. Extract Error Lines
    const errorLogs = logData
      .filter((log: any) => log.text.includes("Error") || log.text.includes("Failed") || log.text.includes("Err"))
      .map((log: any) => log.text)
      .join("\n");

    return errorLogs || "Build Failed (Unknown Error)";
  } catch (error) {
    console.error("Vercel Log Error:", error);
    return null;
  }
}
```