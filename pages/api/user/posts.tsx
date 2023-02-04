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

  const posts = [...Array(3)].map((_, index) => ({
    id: _mock.id(index),
    author: {
      id: _mock.id(8),
      avatarUrl: _mock.image.avatar(1),
      name: 'Caitlyn Kerluke',
    },
    isLiked: true,
    createdAt: _mock.time(index),
    media: _mock.image.feed(index),
    message: _mock.text.sentence(index),
    personLikes: [...Array(36)].map((_, index) => ({
      name: _mock.name.fullName(index),
      avatarUrl: _mock.image.avatar(index + 2),
    })),
    comments: (index === 2 && []) || [
      {
        id: _mock.id(7),
        author: {
          id: _mock.id(8),
          avatarUrl: _mock.image.avatar(sample([2, 3, 4, 5, 6]) || 2),
          name: _mock.name.fullName(index + 5),
        },
        createdAt: _mock.time(2),
        message: 'Praesent venenatis metus at',
      },
      {
        id: _mock.id(9),
        author: {
          id: _mock.id(10),
          avatarUrl: _mock.image.avatar(sample([7, 8, 9, 10, 11]) || 7),
          name: _mock.name.fullName(index + 6),
        },
        createdAt: _mock.time(3),
        message:
          'Etiam rhoncus. Nullam vel sem. Pellentesque libero tortor, tincidunt et, tincidunt eget, semper nec, quam. Sed lectus.',
      },
    ],
  }));

  res.status(200).json({ posts });
}
