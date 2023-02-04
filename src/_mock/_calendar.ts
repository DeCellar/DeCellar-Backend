import cloneDeep from 'lodash/cloneDeep';
import { addDays, setHours, setMinutes, subDays, startOfDay, endOfDay, subHours } from 'date-fns';
// theme
import palette from '../theme/palette';
// utils
import _mock from './_mock';

// ----------------------------------------------------------------------

const primaryMain = palette.primary.main;
const infoMain = palette.info.main;
const infoDarker = palette.info.darker;
const successMain = palette.success.main;
const warningMain = palette.warning.main;
const errorMain = palette.error.main;
const errorDarker = palette.error.darker;

const now = new Date();

const fUTC = (date: any) => subHours(date, 7);

export let events = [
  {
    id: _mock.id(1),
    allDay: false,
    textColor: primaryMain,
    description: _mock.text.description(1),
    start: setHours(setMinutes(subDays(now, 12), 30), 7),
    end: setHours(setMinutes(subDays(now, 12), 0), 9),
    title: _mock.text.title(1),
  },
  {
    id: _mock.id(2),
    allDay: false,
    textColor: infoMain,
    description: _mock.text.description(2),
    start: setHours(setMinutes(subDays(now, 6), 0), 2),
    end: setHours(setMinutes(subDays(now, 6), 30), 5),
    title: _mock.text.title(2),
  },
  {
    id: _mock.id(3),
    allDay: false,
    textColor: successMain,
    description: _mock.text.description(3),
    start: setHours(setMinutes(addDays(now, 3), 0), 8),
    end: setHours(setMinutes(addDays(now, 3), 0), 12),
    title: _mock.text.title(3),
  },
  {
    id: _mock.id(4),
    allDay: false,
    textColor: primaryMain,
    description: _mock.text.description(4),
    start: setHours(setMinutes(now, 0), 8),
    end: setHours(setMinutes(now, 0), 12),
    title: _mock.text.title(4),
  },
  {
    id: _mock.id(5),
    allDay: false,
    textColor: warningMain,
    description: _mock.text.description(5),
    start: setHours(setMinutes(addDays(now, 3), 15), 5),
    end: setHours(setMinutes(addDays(now, 3), 30), 5),
    title: _mock.text.title(5),
  },
  {
    id: _mock.id(6),
    allDay: true,
    textColor: errorMain,
    description: _mock.text.description(6),
    start: fUTC(endOfDay(subDays(now, 4))),
    end: fUTC(startOfDay(subDays(now, 3))),
    title: _mock.text.title(6),
  },
  {
    id: _mock.id(7),
    allDay: false,
    textColor: infoDarker,
    description: _mock.text.description(7),
    start: setHours(setMinutes(addDays(now, 3), 45), 7),
    end: setHours(setMinutes(addDays(now, 3), 50), 7),
    title: _mock.text.title(7),
  },
  {
    id: _mock.id(8),
    allDay: false,
    textColor: infoMain,
    description: _mock.text.description(8),
    start: setHours(setMinutes(addDays(now, 3), 50), 8),
    end: setHours(setMinutes(addDays(now, 3), 55), 8),
    title: _mock.text.title(8),
  },
  {
    id: _mock.id(9),
    allDay: false,
    textColor: errorDarker,
    description: _mock.text.description(9),
    start: setHours(setMinutes(addDays(now, 6), 12), 7),
    end: setHours(setMinutes(addDays(now, 8), 20), 7),
    title: _mock.text.title(9),
  },
];

export let cloneEvents = cloneDeep(events);
