import type { NextApiRequest, NextApiResponse } from 'next';

const chatRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      return res.status(200).json({ message: 'Chat API' });
    case 'POST':
      return res.status(201).json({ message: 'Message sent' });
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
};

export default chatRoute;