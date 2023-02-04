import map from 'lodash/map';
import assign from 'lodash/assign';
// next
import { NextApiRequest, NextApiResponse } from 'next';
// utils
import cors from 'src/utils/cors';
// _mock
import { cloneEvents } from 'src/_mock/_calendar';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    const { eventId, updateEvent } = req.body;

    let event = null;

    map(cloneEvents, (_event) => {
      if (_event.id === eventId) {
        assign(_event, { ...updateEvent });
        event = _event;
      }
      return _event;
    });

    res.status(200).json({ event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
