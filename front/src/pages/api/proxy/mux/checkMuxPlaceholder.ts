import type { NextApiRequest, NextApiResponse } from 'next';
import { createBlurUp } from '@mux/blurup';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Playback ID is required' });
    }

    try {
        const response = await createBlurUp(id, {});

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error generating BlurHash:', error);
        return res.status(500).json({ error: 'Error generating BlurHash' });
    }
}