export interface Promotion {
  id: number;
  name: string;
  startDate: string; // ISO 8601 date string
  endDate: string;   // ISO 8601 date string
  code: string;
  status: 'active' | 'inactive'; // Assuming status can be 'active' or 'inactive'
  description: string;
  discountAmount: number; // Assuming it's in the same currency unit as the rest of the prices
  idShop: number; // ID of the shop
  products: Product[]; // Assuming products is an array of Product objects
}



export interface Product {
  id: number;
  images: string[];
  price: number;
  priceBeforeDiscount: number;
  quantity: number;
  name: string;
  description: string;
  shortDescription: string;
  image: string;
  idShop: number;
  length: number;
  width: number;
  height: number;
  weight: number;
  category: Category;
  createdAt: string; // Assuming ISO string format
  updatedAt: string | null;
  reviews: Reviews[]; // Assuming reviews are any type, you can replace with appropriate type if known
  rating: number;
  sold: number;
  view: number;
  orderNumber: number;
  sizeQuantities: SizeQuantity[];
  public: boolean;
}

interface Category {
  id: number;
  name: string;
}

interface Reviews{
  id:number;
  idCustomer:number;
  rating:number;
  comment: string;
  createdAt: string;
}

export interface SizeQuantity {
  id: number;
  size: string;
  color: string;
  quantity: number;
}




export interface ProductList {
  products: Product[]
  pagination: {
    page: number
    limit: number
    page_size: number
  }
}
export interface ProductListConfig {
  page?: number | string
  limit?: number | string
  sort_by?: 'createdAt' | 'price' | 'rating' | 'sold' | 'view'
  order?: 'asc' | 'desc'
  exclude?: string
  rating_filter?: number | string
  price_max?: number | string
  price_min?: number | string
  name?: string
  category?: string
  deeplearning?:string
}
