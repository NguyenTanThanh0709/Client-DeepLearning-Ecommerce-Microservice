import { get } from 'lodash'
import { OrderItemRequest,OrderRequestFull, OrderRequest, PaymentInfo } from 'src/constants/contant'
import { OrderItem } from 'src/types/order.type'
import { Purchase, PurchaseListStatus } from 'src/types/purchase.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL = '/api/v1/carts'

interface MomoPaymentResponse {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  responseTime: number;
  message: string;
  resultCode: number;
  payUrl: string;
  shortLink: string;
}


const purchaseApi = {
  addToCart(iduser:string, body: { idProduct: string; quantity: number; idSizeQuantity:string|null }) {
    return http.post<SuccessResponse<Purchase>>(`/api/v1/carts/${iduser}`, body)
  },

  getPurchases(id:string) {
    return http.get<SuccessResponse<Purchase[]>>(`/api/v1/carts/carts-user-v2/${id}`)
  },
  
  updatePurchase(body: { product_id: string; buy_count: number }) {
    return http.put<SuccessResponse<Purchase>>(`${URL}/update-purchase`, body)
  },


  deletePurchase(purchaseIds: string[]) {
    return http.delete<SuccessResponse<{ deleted_count: number }>>(`${URL}`, {
      data: purchaseIds
    })
  },


  addOrder(data: OrderRequest) {
    return http.post<string>(`/api/v1/purchases/orders/`, data).then((res) => res.data)
  },

  getOrder(id:string, status:string){
    return http.get<OrderRequestFull[]>(`/api/v1/purchases/orders/customer/${id}?status=${status}`)
  },

  getOrderDetailItem(id:number){
    return http.get<OrderRequestFull>(`/api/v1/purchases/orders/${id}`)
  },

  getOrderShop(id:string, status:string){
    return http.get<OrderRequestFull[]>(`/api/v1/purchases/orders/shop/${id}?status=${status}`)
  },

  getOrderShipper(city:string, status:string){
    return http.get<OrderRequestFull[]>(`/api/v1/purchases/orders/shipper?status=${status}&city=${city}`)
  },

  // New method to update the order status
  updateOrderStatus(id: string, status: string) {
    return http.put<string>(`/api/v1/purchases/orders/${id}/status`, null, {
      params: { status },
    });
  },

  

  //
  paymentMomo({ id, totalMoney }: { id: string; totalMoney: number }) {
    return http.post<MomoPaymentResponse>(`/api/v1/notifications/payment/`, { id, totalMoney }).then(response => response.data); // Trả về dữ liệu từ phản hồi;
  }
  ,
  getPaymentByOrderId(id: number) {
    return http.get<PaymentInfo>(`/api/v1/purchases/payments/order/${id}`)
  }

}

export default purchaseApi
