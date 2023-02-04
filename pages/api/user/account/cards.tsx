// next
import { NextApiRequest, NextApiResponse } from 'next';
// utils
import cors from 'src/utils/cors';
// _mock
import _mock from '../../../../src/_mock';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  const cards = [...Array(2)].map((_, index) => ({
    id: _mock.id(index),
    cardNumber:
      (index === 0 && '**** **** **** 1234') ||
      (index === 1 && '**** **** **** 5678') ||
      '**** **** **** 5678',
    cardType: (index === 0 && 'master_card') || (index === 1 && 'visa') || 'master_card',
  }));

  res.status(200).json({ cards });
}
