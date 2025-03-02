import dayjs from 'dayjs';

import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData, OfferType, UserType } from '../../types/index.js';
import { generateRandomValue, getRandomItem, getRandomItems, OFFER } from '../../helpers/index.js';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) { }

  public generate(): string {
    const photos = getRandomItems<string>(this.mockData.photos).join(';');
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const imagePreview = getRandomItem<string>(this.mockData.imagePreviews);
    const type = getRandomItem([OfferType.apartment, OfferType.hotel, OfferType.house, OfferType.room]);
    const price = generateRandomValue(OFFER.MIN_PRICE, OFFER.MAX_PRICE).toString();
    const userName = getRandomItem(this.mockData.users);
    const email = getRandomItem(this.mockData.emails);
    const city = getRandomItem(this.mockData.cities);
    const userType = getRandomItem([UserType.pro, UserType.regular]);
    const userPic = getRandomItem<string>(this.mockData.avatars);
    const rating = generateRandomValue(OFFER.MIN_RATING, OFFER.MAX_RATING, 1).toString();
    const roomCount = generateRandomValue(OFFER.MIN_ROOMS, OFFER.MAX_ROOMS).toString();
    const guestCount = generateRandomValue(OFFER.MIN_GUESTS, OFFER.MAX_GUESTS).toString();
    const commentsCount = generateRandomValue(OFFER.MIN_COMMENTS, OFFER.MAX_COMMENTS).toString();
    const facilities = getRandomItems<string>(this.mockData.facilities).join(';');
    const coords = getRandomItem<string>(this.mockData.coords);
    const isPremium = getRandomItem([true, false]);
    const isFavourite = getRandomItem([true, false]);
    const password = getRandomItem<string>(this.mockData.passwords);

    const createdDate = dayjs()
      .subtract(generateRandomValue(OFFER.FIRST_WEEK_DAY, OFFER.LAST_WEEK_DAY), 'day')
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
