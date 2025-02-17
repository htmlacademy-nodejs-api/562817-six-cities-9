import { UserType } from './user-type.type.js';

export type User = {
  name: string
  email: string
  userPic?: string
  userType: UserType
  password: string
}
