import type { NextApiRequest, NextApiResponse } from 'next';

const FETCH_DRYPAPER_DATA = () => {
  return [
    {
      id: 1,
      name: 'Tax Tracker',
      description: 'Track your taxes with ease',
      price: 9.99,
      imageUrl: '/tax-tracker.png',
    },
    {
      id: 2,
      name: 'Outreach',
      description: 'Reach new customers with our outreach tool',
      price: 19.99,
      imageUrl: '/outreach.png',
    },
    {
      id: 3,
      name: 'Legal',
      description: 'Get legal advice and documents',
      price: 29.99,
      imageUrl: '/legal.png',
    },
  ];
};

const marketplaceRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const data = FETCH_DRYPAPER_DATA();
    return res.status(200).json(data);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
};

export default marketplaceRoute;