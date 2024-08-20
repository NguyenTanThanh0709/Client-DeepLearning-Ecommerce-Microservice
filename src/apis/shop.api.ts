import { Shop } from 'src/constants/contant'
import http from 'src/utils/http'


const ShopApi = {
  getShop(id:string) {
    return http.get<Shop>(
        `/api/v1/users/shop/seller/${id}`
    )
  },

  getShopsByDistrict(districtId: string) {
    return http.get<Shop[]>(
      `/api/v1/users/shop/list?district=${districtId}`
    );
  }
  
}

export default ShopApi
