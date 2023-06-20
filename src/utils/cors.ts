import Cors from 'cors';
import initMiddleware from './init-middleware';
import { DOMAIN } from '../../config';

// Initialize the cors middleware
const cors = initMiddleware(
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS'],
    origin: [DOMAIN as string],
  })
);

export default cors;
