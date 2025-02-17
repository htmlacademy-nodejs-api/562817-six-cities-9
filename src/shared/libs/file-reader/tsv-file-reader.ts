import { readFileSync } from 'node:fs';
import { FileReader } from './file-reader.interface.js';
import { Facility, Offer, OfferType, User, UserType } from '../../types/index.js';

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
      .filter((row) => row.trim().length > 0)
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
    ] = line.split('    ');

    return {
      title,
      description,
      date: new Date(date),
      city,
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
      author: this.parseUser(name,
        email,
        userPic,
        userType as UserType,
        password),
      commentsCount: this.parseStringToNumber(commentsCount),
      coords,
    };
  }

  private parseManyItems(itemsString: string): string[] {
    return itemsString.split(';').map((name) => name);
  }

  private parseStringToBoolean(value: string): boolean {
    return !!value;
  }

  private parseStringToNumber(priceString: string): number {
    return Number.parseInt(priceString, 10);
  }

  private parseUser(name: string, email: string, userPic: string, userType: UserType, password: string): User {
    return { name, email, userPic, userType, password };
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
