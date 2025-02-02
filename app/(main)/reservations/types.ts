export interface Reservation {
  id: string;
  date: Date;
  time: string;
  title: string;
  location: {
    address: string;
    access: string;
  };
  status: 'reserved' | 'completed';
  qrCode?: string;
}