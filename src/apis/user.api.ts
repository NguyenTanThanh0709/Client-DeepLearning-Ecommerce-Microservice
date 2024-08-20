import { User } from 'src/types/user.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'
import { ShopData } from 'src/constants/contant'

interface BodyUpdateProfile {
  phone: string | undefined;
  city: string | undefined;
  district: string | undefined;
  ward: string | undefined;
  detailLocation: string | undefined;
}

interface changePassword {
  confirm_password: string | undefined;
  new_password: string | undefined;
  password: string | undefined;
}

const userApi = {
  getProfile(id: number) {
    return http.get<SuccessResponse<User>>(`/api/v1/users/${id}`)
  },
  updateProfile(body: BodyUpdateProfile, id: number) {
    return http.put<SuccessResponse<User>>(`/api/v1/users/${id}`, body);
},
changepassword(body: changePassword, id: number) {
  return http.patch<String>(`/api/v1/users/${id}/password`, body);
},
  uploadAvatar(body: FormData) {
    return http.post<SuccessResponse<string>>('user/upload-avatar', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
  ,
  checkexitsshop(id: number) {
    return http.get<number>(`/api/v1/users/shop/exists?sellerId=${id}`);
  },
  registerShop(body: ShopData) {
    return http.post<ShopData>('/api/v1/users/shop', body)
  }
}

export default userApi
