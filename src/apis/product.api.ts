import { ProductRequest, ProductReview, PromotionRequest } from 'src/constants/contant'
import { Product, ProductList, ProductListConfig, Promotion } from 'src/types/product.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'
const URL = '/api/v1/products'
const productApi = {
  
  getProductRecommentSystem(id:string){
    return http.get<string[]>(`http://localhost:8086/api/v1/aggreations?iduser=${id}`)
  },
  getListProductRecommentSystem(data:string[]){
    return http.post<Product[]>(`/api/v1/products/by-ids`, data)
  },

  
  getProducts(params: ProductListConfig) {
    return http.get<SuccessResponse<ProductList>>(`${URL}/search-elastic`, { params })
  },

  getProductDetail(id: string) {
    return http.get<SuccessResponse<Product>>(`${URL}/${id}/ElasticSearch`)
  },
  

  addProduct(data:ProductRequest){
    return http.post<string>("/api/v1/products/seller", data)
  },
  async getProductByIdShop(idShop: string) {
    const response = await http.get<Product[]>(`/api/v1/products/shop/${idShop}`);
    return response.data; // Trả về dữ liệu sản phẩm từ phản hồi
  },
  updateStatusProduct(id: string, status: number) {
    return http.patch<void>(`/api/v1/products/seller/${id}/public?isPublic=${status}`)
  },

  getReview(id:string){
    return http.get<ProductReview[]>(`/api/v1/products/review/product/${id}`).then((res) => res.data)
  },

  updateProductBasic(id: string, data: any) {
    return http.put<SuccessResponse<Product>>(`/api/v1/products/seller/${id}/basic`, data)
  },

  updateProductDetail(id: string, data: any) {
    return http.put<SuccessResponse<Product>>(`/api/v1/products/seller/${id}/detail`, data)
  },

  updateProductSell(id: string, data: any) {
    return http.put<SuccessResponse<Product>>(`/api/v1/products/seller/${id}/sell`, data)
  },

  updateProductShip(id: string, data: any) {
    return http.put<SuccessResponse<Product>>(`/api/v1/products/seller/${id}/ship`, data)
  },

  deleteSizeQuantity(id: any) {
    return http.delete<void>(`/api/v1/products/seller/${id}/sizequantity`)
  },


  addPromotion(data:PromotionRequest){
    return http.post<string>("/api/v1/products/promotions/", data)
  },

  addpreview(data: any){
    return http.post<any>("/api/v1/products/review/", data)
  },

  async getPromotionsByIdShop(idShop: string) {
    const response = await http.get<Promotion[]>(`/api/v1/products/promotions/shop/${idShop}`);
    return response.data
  },
  getPromotion(id: string) {
    return http.get<Promotion>(`/api/v1/products/promotions/${id}`)
  },
  updatePromotion(id: string, data: PromotionRequest) {
    return http.put<Promotion>(`/api/v1/products/promotions/${id}`, data)
  },
  async getPromotionByProductActive(idProduct: string) {
    const response = await http.get<Promotion[]>(`/api/v1/products/promotions/product/${idProduct}/active`);
    return response.data; // Trả về dữ liệu sản phẩm từ phản hồi
  },


  
}
export default productApi
