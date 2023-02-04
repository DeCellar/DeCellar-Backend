// next
import { NextApiRequest, NextApiResponse } from 'next';
// utils
import cors from 'src/utils/cors';
// _mock
import { posts } from '../../../../src/_mock/_blog';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    const { index = 0, step = 10 } = req.query;
    const maxLength = posts.length;
    const loadMore = parseInt(`${index}`, 10) + parseInt(`${step}`, 10);

    const sortPosts = [...posts].sort(
      (a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
    );

    const results = sortPosts.slice(0, loadMore);

    res.status(200).json({ results, maxLength });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
}
