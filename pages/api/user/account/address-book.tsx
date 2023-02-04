// next
import { NextApiRequest, NextApiResponse } from 'next';
// utils
import cors from 'src/utils/cors';
// _mock
import _mock from '../../../../src/_mock';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  const addressBook = [...Array(4)].map((_, index) => ({
    id: _mock.id(index),
    name: _mock.name.fullName(index),
    phone: _mock.phoneNumber(index),
    country: _mock.address.country(index),
    state: 'New Hampshire',
    city: 'East Sambury',
    street: '41256 Kamille Turnpike',
    zipCode: '85807',
  }));

  res.status(200).json({ addressBook });
}
