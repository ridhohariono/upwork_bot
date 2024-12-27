import myData from "../data/accounts.json";

export interface DataAccount {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  password?: string | null;
  imageUrl?: string | null;
  emailVerified?: boolean | null;
  streetAddress?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  phone?: string | null;
  country?: string | null;
  dateOfBirth?: string | null;
  registeredDate?: Date | null;
  registrationComple?: boolean | number;
}

export class UpworkAccount {
  getAll(): DataAccount[] {
    return myData;
  }
}
