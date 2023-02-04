// next
import { NextApiRequest, NextApiResponse } from 'next';
// utils
import cors from 'src/utils/cors';
// _mock
import _mock from '../../../../src/_mock';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  const followers = [...Array(18)].map((_, index) => ({
    id: _mock.id(index),
    avatarUrl: _mock.image.avatar(index),
    name: _mock.name.fullName(index),
    country: _mock.address.country(index),
    isFollowed: _mock.boolean(index),
  }));

  res.status(200).json({ followers });
}
