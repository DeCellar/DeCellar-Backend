import { NextApiRequest, NextApiResponse } from 'next';

export default function RobotsTxt(req: NextApiRequest, res: NextApiResponse) {
  const robotsTxtContent = `
    User-agent: *
    Disallow:
    Sitemap: https://www.decellar.io/sitemap.xml
  `;

  res.setHeader('Content-Type', 'text/plain');
  res.send(robotsTxtContent);
}
