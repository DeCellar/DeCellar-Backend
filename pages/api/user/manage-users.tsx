import { sample } from 'lodash';
// next
import { NextApiRequest, NextApiResponse } from 'next';
// utils
import cors from 'src/utils/cors';
// _mock
import _mock from '../../../src/_mock';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  const users = [...Array(24)].map((_, index) => ({
    id: _mock.id(index),
    avatarUrl: _mock.image.avatar(index),
    name: _mock.name.fullName(index),
    email: _mock.email(index),
    phoneNumber: _mock.phoneNumber(index),
    address: '908 Jack Locks',
    country: _mock.address.country(index),
    state: 'Virginia',
    city: 'Rancho Cordova',
    zipCode: '85807',
    company: _mock.company(index),
    isVerified: _mock.boolean(index),
    status: sample(['active', 'banned']) || 'active',
    role: _mock.role(index),
  }));

  res.status(200).json({ users });
}
