export type Order = {
  id: number;

  customer_name: string;
  phone: string;

  wilaya: string;
  commune: string;
  address: string;

  delivery_type: "home" | "office";
  office_name: string | null;

  delivery_price: number;
  total_price: number;

  quantity: number;

  status: string;

  tracking_number: string | null;
  ecotrack_reference: string | null;

  sent_to_ecotrack: boolean;

  product_id: number;

  created_at: string;
};

export type Product = {
  id: number;

  name: string;

  description: string;

  price: number;

  stock: number;

  image: string;

  active: boolean;

  created_at: string;
};

export type ShippingPrice = {
  id: number;

  state: string;

  wilaya_code: number;

  home_price: number;

  office_price: number;
};

export type DeliveryOffice = {
  id: number;

  state: string;

  office_name: string;
};