import { ReactNode } from "react";

export interface Order {
  id: string;
  customer_name: string;
  total_products: number;
  total_price: string;
  created_at: string;
}
