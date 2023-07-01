import { NextApiRequest, NextApiResponse } from 'next';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

const postId = [
  'rising-demand-for-italian-fine-wines-a-lucrative-investment-opportunity_Z70DzkXNET5Ei7lGxmpb/',
  'crypto-connoisseurs-how-cryptocurrencies-are-disrupting-the-wine-industry_fYDLQ4IbMEJtW4txgGA8/',
  'the-intersection-of-wine-and-technology-selling-wine-as-nf-ts_cMfGOITCjeEfvl0ZsH0s/',
  'trading-wine-as-nft-a-unique-blend-of-art-and-technology_F8PX4cT1y14fBe1saKeU',
];

export default async function Sitemap(req: NextApiRequest, res: NextApiResponse) {
  // extension = io / xyz
  const { extension } = req.query;

  const baseUrl = `https://www.decellar.${extension ? extension : 'io'}`;

  const postLinks = postId.map((id) => ({
    url: `${baseUrl}/posts/${id}`,
    changefreq: 'weekly',
    priority: 0.9,
  }));

  const links = [
    { url: '/', changefreq: 'monthly', priority: 1.0 },
    { url: '/coming-soon/', changefreq: 'monthly', priority: 0.8 },
    { url: '/marketplace/', changefreq: 'monthly', priority: 0.8 },
    { url: '/auth/login/', changefreq: 'monthly', priority: 0.8 },
    { url: '/dashboard/', changefreq: 'monthly', priority: 0.8 },
    { url: '/blog/posts/', changefreq: 'monthly', priority: 0.8 },
    { url: '/about-us/', changefreq: 'monthly', priority: 0.8 },
    { url: '/contact-us/', changefreq: 'monthly', priority: 0.8 },
    ...postLinks,
  ];

  const stream = new SitemapStream({ hostname: baseUrl });
  links.forEach((link) => {
    stream.write(link);
  });
  stream.end();

  const sitemapStream = await streamToPromise(Readable.from(stream));

  res.setHeader('Content-Type', 'application/xml');
  res.send(sitemapStream.toString());
}
