import { Product } from './product.type'
interface Promotion {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    code: string;
    status: string;
    description: string;
    discountAmount: number;
    idShop: number;
  }


export  interface OrderItem {
    id: number;
    product: Product;
    idSizeQuantity: number | null;
    promotion: Promotion | null;
    quantity: number;
    note: string;
  }