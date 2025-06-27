export interface Company {
    id: string;
    identification: string;
    bussines_name: string;
    type_company_id: number;
    trade_name: string;
    phone: string;
    city: number;
    district: number;
    provincia: number;
    address: string;
    color_primary: string;
    status: number;
    tax_id: number;
    logo_path: string | null;
    logo_ticket: number;
    longitude: number | null;
    latitude: number | null;
    coins_id: number;
    createdAt: string;
    updatedAt: string;
} 