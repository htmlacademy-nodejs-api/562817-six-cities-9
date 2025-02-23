import { CityType } from './city.type.js';
import { Facility } from './facility.type.js';
import { Location } from './location.type.js';
import { OfferType } from './offer-type.type.js';
import { User } from './user.type.js';

export type Offer = {
  title: string
  description: string
  date: Date
  city: CityType
  imagePreview: string
  photos: string[]
  isPremium: boolean
  isFavourite: boolean
  rating: number
  type: OfferType
  roomCount: number
  guestCount: number
  price: number
  facilities: Facility[]
  author: User
  commentsCount: number
  coords: Location
}
