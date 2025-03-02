export interface Card {
  number: string;
  name: string;
  image: string;
  description: string;
  acquiredDate: string;
  location: string;
  quest: string;
  isAcquired: boolean;
  qrCode?: string;
}