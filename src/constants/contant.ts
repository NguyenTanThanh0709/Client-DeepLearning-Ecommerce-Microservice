export interface PaymentInfo {
  id: number;
  paymentDate: string;
  status: string;
  method: string;
  amount: number;
}

export interface Shop {
  id: number;
  name: string;
  description: string;
  type: string;
  city: string;
  district: string;
  ward: string;
  detailLocation: string;
}


export interface ProductReview {
  id: number;
  idCustomer: number;
  rating: number;
  comment: string;
  createdAt: string; // Hoặc có thể sử dụng Date nếu bạn muốn
}


export interface PromotionRequest {
  id: number | null; // Assuming id can be null or a number
  name: string;
  startDate: string; // You can also use Date if you parse it to a Date object later
  endDate: string; // Same as above
  code: string;
  status: 'active' | 'inactive'; // Assuming status can only be 'active' or 'inactive'
  description: string;
  discountAmount: number;
  idShop: number;
  idProducts: string[]; // Array of product IDs
}

export interface OrderItemRequest {
  id: number |null;
  productId: number;
  idSizeQuantity?: number; // cho phép null nếu là các sản phẩm k có size
  promotionId?: number; // cho phép null nếu là các sản phẩm k có promotion
  quantity: number; // số lượng sản phẩm
  note: string;
}

export interface OrderRequest {
  id: number |null;
  customerId: number;
  shopId: number;
  totalMoney: number;
  status: string; // Trạng thái hiện tại của đơn hàng (ví dụ: pending, paid, shipped, delivered, cancelled)
  orderItems: OrderItemRequest[];
  orderDate:string | '';
}



interface SizeQuantityRequest {
  id: number;
  size: string;
  color: string;
  quantity: number;
}

export interface ProductRequest {
  id?: number; // Optional if not provided

  images: string[];
  name: string;
  description: string;
  categoryId: number;
  image?: string; // Optional, default value is an empty string


  shortDescription: string;


  length: number;
  width: number;
  height: number; // Note: Consider renaming to height for consistency
  weight: number;

  price: number;
  priceBeforeDiscount: number;
  quantity: number; // Optional, default value is 0
  sizeQuantities?: SizeQuantityRequest[]; // Optional if not provided
  
  idShop: number;
}



export interface ShopData {
  id?: number | null;
  name: string;
  type: string;
  description: string;
  city: string;
  district: string;
  ward: string;
  detailLocation: string;
  seller?: number;
}


export interface City  {
    ProvinceID: number;
    ProvinceName: string;
    CountryID: number;
    Code: string;
    NameExtension: string[];
    IsEnable: number;
    RegionID: number;
    RegionCPN: number;
    UpdatedBy: number;
    CreatedAt: string;
    UpdatedAt: string;
    CanUpdateCOD: boolean;
    Status: number;
  }

  export interface District  {
    DistrictID: number;
    ProvinceID: number;
    DistrictName: string;
    Code: string;
    Type: number;
    SupportType: number;
    NameExtension: string[];
    IsEnable: number;
    CanUpdateCOD: boolean;
    Status: number;
    PickType: number;
    DeliverType: number;
    WhiteListClient: {
        From: number[];
        To: number[];
        Return: number[];
    };
    WhiteListDistrict: {
        From: any;
        To: any;
    };
    ReasonCode: string;
    ReasonMessage: string;
    OnDates: any;
    CreatedIP: string;
    CreatedEmployee: number;
    CreatedSource: string;
    CreatedDate: string;
    UpdatedEmployee: number;
    UpdatedDate: string;
  }
  
  export interface Ward  {
    WardCode: string;
    DistrictID: number;
    WardName: string;
    NameExtension: string[];
    CanUpdateCOD: boolean;
    SupportType: number;
    PickType: number;
    DeliverType: number;
    WhiteListClient: {
        From: number[];
        To: number[];
        Return: number[];
    };
    WhiteListWard: {
        From: any;
        To: any;
    };
    Status: number;
    ReasonCode: string;
    ReasonMessage: string;
    OnDates: string[];
    CreatedIP: string;
    CreatedEmployee: number;
    CreatedSource: string;
    CreatedDate: string;
    UpdatedEmployee: number;
    UpdatedDate: string;
  }