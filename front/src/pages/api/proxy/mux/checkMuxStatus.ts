// pages/api/checkMuxStatus.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Asset ID is required' });
    }

    try {
        const response = await fetch(`https://api.mux.com/video/v1/assets/${id}`, {
            headers: {
                Authorization: `Basic ${Buffer.from(`${process.env.MUX_TOKEN_ID || process.env.NEXT_PUBLIC_MUX_TOKEN_ID}:${process.env.MUX_TOKEN_SECRET || process.env.NEXT_PUBLIC_MUX_TOKEN_SECRET}`).toString('base64')}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log('Error Data:', errorData);
            return res.status(response.status).json({ error: errorData });
        }

        const data = await response.json();
        return res.status(200).json(data.data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Error fetching data from Mux API' });
    }
}
