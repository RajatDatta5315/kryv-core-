const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
// ⚠️ DHYAN DE: Ye naam EXACT wahi hona chahiye jo GitHub URL mein hai
// Agar URL hai: github.com/tDatta5315/kryv-core-
// Toh ye hona chahiye: "kryv-core-"
const REPO_OWNER = "tDatta5315"; 
const REPO_NAME = "kryv-core-"; 

export async function createFile(path: string, content: string, message: string = "Nehira Auto-Update") {
  if (!GITHUB_TOKEN) {
    throw new Error("MISSING_TOKEN: Vercel Env Variable GITHUB_TOKEN nahi mila.");
  }

  console.log(`Attempting to create file: ${path} in ${REPO_OWNER}/${REPO_NAME}`);

  // 1. Check if file exists (SHA lene ke liye)
  let sha = null;
  try {
    const checkRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
      headers: { 
        Authorization: `token ${GITHUB_TOKEN}`,
        "Accept": "application/vnd.github.v3+json"
      },
      cache: 'no-store'
    });
    
    if (checkRes.ok) {
      const data = await checkRes.json();
      sha = data.sha;
    }
  } catch (e) {
    // File nahi mili, koi baat nahi, nayi banayenge
  }

  // 2. Create or Update
  const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
    method: "PUT",
    headers: {
      "Authorization": `token ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
      "Accept": "application/vnd.github.v3+json"
    },
    body: JSON.stringify({
      message: message,
      content: Buffer.from(content).toString("base64"),
      sha: sha ? sha : undefined,
    }),
  });

  // 🚨 ASLI FIX: Agar GitHub ne mana kiya, toh error throw karo
  if (!res.ok) {
    const errorText = await res.text();
    console.error("GitHub Error:", errorText);
    throw new Error(`GITHUB REFUSED: ${res.status} - ${errorText}`);
  }

  return res.json();
}

