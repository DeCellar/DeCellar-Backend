// next
import { NextApiRequest, NextApiResponse } from 'next';
// utils
import cors from 'src/utils/cors';
// _mock
import _mock from '../../../../src/_mock';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  const invoices = [...Array(10)].map((_, index) => ({
    id: _mock.id(index),
    createdAt: _mock.time(index),
    price: _mock.number.price(index),
  }));

  res.status(200).json({ invoices });
}
