import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseClient } from '../../../utils/supabase';

const chatRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { data, error } = await supabaseClient.from('chat_messages').select('*');
        if (error) {
          return res.status(500).json({ message: 'Failed to fetch chat messages' });
        }
        return res.status(200).json(data);
      } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch chat messages' });
      }
    case 'POST':
      try {
        const { message, userId } = req.body;
        const { data, error } = await supabaseClient.from('chat_messages').insert([{ message, user_id: userId }]);
        if (error) {
          return res.status(500).json({ message: 'Failed to send chat message' });
        }
        return res.status(201).json(data);
      } catch (error) {
        return res.status(500).json({ message: 'Failed to send chat message' });
      }
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
};

export default chatRoute;