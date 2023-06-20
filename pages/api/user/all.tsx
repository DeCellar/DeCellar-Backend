import { random } from 'lodash';
// next
import { NextApiRequest, NextApiResponse } from 'next';
// utils
import cors from '../.././src/utils/cors';
// _mock
import _mock from '../.././src/_mock';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  const users = [...Array(24)].map((_, index) => ({
    id: _mock.id(index),
    avatarUrl: _mock.image.avatar(index),
    cover: _mock.image.cover(index),
    name: _mock.name.fullName(index),
    follower: random(9999),
    following: random(9999),
    totalPost: random(9999),
    position: _mock.role(index),
  }));

  res.status(200).json({ users });
}
