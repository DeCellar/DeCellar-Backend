import { random } from 'lodash';
// next
import { NextApiRequest, NextApiResponse } from 'next';
// utils
import cors from 'src/utils/cors';
// _mock
import _mock from '../../../src/_mock';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  const profile = {
    id: _mock.id(1),
    cover: _mock.image.cover(1),
    position: 'UI Designer',
    follower: random(99999),
    following: random(99999),
    quote:
      'Tart I love sugar plum I love oat cake. Sweet roll caramels I love jujubes. Topping cake wafer..',
    country: _mock.address.country(1),
    email: _mock.email(1),
    company: _mock.company(1),
    school: _mock.company(2),
    role: 'Manager',
    facebookLink: `https://www.facebook.com/caitlyn.kerluke`,
    instagramLink: `https://www.instagram.com/caitlyn.kerluke`,
    linkedinLink: `https://www.linkedin.com/in/caitlyn.kerluke`,
    twitterLink: `https://www.twitter.com/caitlyn.kerluke`,
  };

  res.status(200).json({ profile });
}
