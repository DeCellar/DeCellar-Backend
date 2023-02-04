// next
import { NextApiRequest, NextApiResponse } from 'next';
// utils
import cors from 'src/utils/cors';
// _mock
import _mock from '../../../../src/_mock';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  const gallery = [...Array(18)].map((_, index) => ({
    id: _mock.id(index),
    title: _mock.text.title(index),
    postAt: _mock.time(index),
    imageUrl: _mock.image.cover(index),
  }));

  res.status(200).json({ gallery });
}
