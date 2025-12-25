const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = "tDatta5315"; // Tera GitHub Username
const REPO_NAME = "kryv-core-"; // Teri Repo ka naam (Check kar lena exact spelling)

export async function createFile(path: string, content: string, message: string = "Nehira Auto-Update") {
  if (!GITHUB_TOKEN) throw new Error("GITHUB_TOKEN missing");

  // 1. Check if file exists (to get SHA for update)
  let sha;
  try {
    const checkRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
    if (checkRes.ok) {
      const data = await checkRes.json();
      sha = data.sha;
    }
  } catch (e) {
    // File doesn't exist, we will create it
  }

  // 2. Create or Update file
  const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
    method: "PUT",
    headers: {
      "Authorization": `token ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: message,
      content: Buffer.from(content).toString("base64"), // Convert content to base64
      sha: sha, // Required if updating
    }),
  });

  return res.json();
}
