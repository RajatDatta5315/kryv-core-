import { BskyAgent } from '@atproto/api';

const agent = new BskyAgent({ service: 'https://bsky.social' });

export const loginToBluesky = async () => {
  await agent.login({
    identifier: process.env.BLUESKY_HANDLE!, // e.g. kryv.bsky.social
    password: process.env.BLUESKY_APP_PASSWORD!, // App password from settings
  });
  return agent;
};

export const autoPostToBluesky = async (content: string) => {
  try {
    const bsky = await loginToBluesky();
    await bsky.post({
      text: content,
      createdAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    console.error("Bluesky Post Error:", error);
    return { success: false };
  }
};
