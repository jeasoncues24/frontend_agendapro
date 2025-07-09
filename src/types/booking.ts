export interface Professional {
  id: string;
  user: {
    id: string;
    name: string;
  };
  initials: string;
}

export interface BookingData {
  service: any;
  date: string;
  time: string;
  professional: Professional | null;
  customerName: string;
  customerEmail: string;
} 