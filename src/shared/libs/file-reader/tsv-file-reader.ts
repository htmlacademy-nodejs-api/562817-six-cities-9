import { readFileSync } from 'node:fs';
import { FileReader } from './file-reader.interface.js';
import { CityType, Facility, Offer, OfferType, UserType } from '../../types/index.js';

const SEMICOLON = ';';
const DECIMAL_NUMERAL = 10;
const COMMA = ',';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(private readonly filename: string) {}

  private validateRawData(): void {
    if (!this.rawData) {
      throw new Error('File was not read');
    }
  }

  private parseRawDataToOffers(): Offer[] {
    return this.rawData
      .split('\n')
      .filter((row) => !!row.trim().length)
      .map((line) => this.parseLineToOffer(line));
  }

  private parseLineToOffer(line: string): Offer {
    const [
      title,
      description,
      date,
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
      name,
      email,
      userPic,
      userType,
      password,
      commentsCount,
      coords,
    ] = line.split('\t');

    return {
      title,
      description,
      date: new Date(date).getTime() ? new Date(date) : new Date(),
      city: city as CityType,
      imagePreview,
      photos: this.parseManyItems(photos),
      isPremium: this.parseStringToBoolean(isPremium),
      isFavourite: this.parseStringToBoolean(isFavourite),
      rating: this.parseStringToNumber(rating),
      type: type as OfferType,
      roomCount: this.parseStringToNumber(roomCount),
      guestCount: this.parseStringToNumber(guestCount),
      price: this.parseStringToNumber(price),
      facilities: this.parseManyItems(facilities) as Facility[],
      author: { name, email, userPic, userType: userType as UserType, password },
      commentsCount: this.parseStringToNumber(commentsCount),
      coords: {
        latitude: this.parseManyItems(coords, COMMA)[0],
        longitude: this.parseManyItems(coords, COMMA)[1],
      },
    };
  }

  private parseManyItems(itemsString: string, devider: string = SEMICOLON): string[] {
    return itemsString.split(devider).map((name) => name);
  }

  private parseStringToBoolean(value: string): boolean {
    return value === 'true' || false;
  }

  private parseStringToNumber(priceString: string): number {
    return Number.parseInt(priceString, DECIMAL_NUMERAL);
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
