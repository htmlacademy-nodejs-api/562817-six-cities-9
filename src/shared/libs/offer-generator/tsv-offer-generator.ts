import dayjs from 'dayjs';

import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData, OfferType, UserType } from '../../types/index.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/index.js';

const MIN_PRICE = 500;
const MAX_PRICE = 2000;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

const MIN_RATING = 1;
const MAX_RATING = 6;

const MIN_ROOMS = 1;
const MAX_ROOMS = 8;

const MIN_GUESTS = 1;
const MAX_GUESTS = 10;

const MIN_COMMENTS = 0;
const MAX_COMMENTS = 100;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) { }

  public generate(): string {
    const photos = getRandomItems<string>(this.mockData.photos).join(';');
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const imagePreview = getRandomItem<string>(this.mockData.imagePreviews);
    const type = getRandomItem([OfferType.apartment, OfferType.hotel, OfferType.house, OfferType.room]);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
    const userName = getRandomItem(this.mockData.users);
    const email = getRandomItem(this.mockData.emails);
    const city = getRandomItem(this.mockData.cities);
    const userType = getRandomItem([UserType.pro, UserType.regular]);
    const userPic = getRandomItem<string>(this.mockData.avatars);
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1).toString();
    const roomCount = generateRandomValue(MIN_ROOMS, MAX_ROOMS).toString();
    const guestCount = generateRandomValue(MIN_GUESTS, MAX_GUESTS).toString();
    const commentsCount = generateRandomValue(MIN_COMMENTS, MAX_COMMENTS).toString();
    const facilities = getRandomItems<string>(this.mockData.facilities).join(';');
    const coords = getRandomItem<string>(this.mockData.coords);
    const isPremium = getRandomItem([true, false]);
    const isFavourite = getRandomItem([true, false]);
    const password = getRandomItem<string>(this.mockData.passwords);

    const createdDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();

    return [
      title,
      description,
      createdDate,
      city,
      imagePreview,
      photos,
      isPremium,
      isFavourite,
      rating,
      type,
      roomCount,
      guestCount,
      price,
      facilities,
      userName,
      email,
      userPic,
      userType,
      password,
      commentsCount,
      coords,
    ].join('\t');
  }
}
