import { Facility } from './facility.type.js';
import { OfferType } from './offer-type.type.js';
import { User } from './user.type.js';

export type Offer = {
  title: string
  description: string
  date: Date
  city: string
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
  coords: string
}
