import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';

import { FileReader } from './file-reader.interface.js';
import { CityType, Facility, Offer, OfferType, UserType } from '../../types/index.js';

const SEMICOLON = ';';
const DECIMAL_NUMERAL = 10;
const COMMA = ',';

export class TSVFileReader extends EventEmitter implements FileReader {
  private CHUNK_SIZE = 16384; // 16KB

  constructor(private readonly filename: string) {
    super()
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

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: this.CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        const parsedOffer = this.parseLineToOffer(completeRow);
        this.emit('line', parsedOffer);
      }
    }

    this.emit('end', importedRowCount);

  }
}
