import { sub } from 'date-fns';
//
import { role } from './role';
import { email } from './email';
import { boolean } from './boolean';
import { company } from './company';
import { phoneNumber } from './phoneNumber';
import { fullAddress, country } from './address';
import { firstName, lastName, fullName } from './name';
import { title, sentence, description } from './text';
import { price, rating, age, percent } from './number';
import { HOST_API } from '../../config';

// ----------------------------------------------------------------------

const _mock = {
  id: (index: number) => `e99f09a7-dd88-49d5-b1c8-1daf80c2d7b${index + 1}`,
  email: (index: number) => email[index],
  phoneNumber: (index: number) => phoneNumber[index],
  time: (index: number) => sub(new Date(), { days: index, hours: index }),
  boolean: (index: number) => boolean[index],
  role: (index: number) => role[index],
  company: (index: number) => company[index],
  address: {
    fullAddress: (index: number) => fullAddress[index],
    country: (index: number) => country[index],
  },
  name: {
    firstName: (index: number) => firstName[index],
    lastName: (index: number) => lastName[index],
    fullName: (index: number) => fullName[index],
  },
  text: {
    title: (index: number) => title[index],
    sentence: (index: number) => sentence[index],
    description: (index: number) => description[index],
  },
  number: {
    percent: (index: number) => percent[index],
    rating: (index: number) => rating[index],
    age: (index: number) => age[index],
    price: (index: number) => price[index],
  },
  image: {
    cover: (index: number) => `${HOST_API}/assets/images/covers/cover_${index + 1}.jpg`,
    feed: (index: number) => `${HOST_API}/assets/images/feeds/feed_${index + 1}.jpg`,
    product: (index: number) => `${HOST_API}/assets/images/products/product_${index + 1}.jpg`,
    avatar: (index: number) => `${HOST_API}/assets/images/avatars/avatar_${index + 1}.jpg`,
  },
};

export default _mock;
