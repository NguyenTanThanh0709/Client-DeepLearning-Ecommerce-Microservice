import { AuthResponse } from 'src/types/auth.type'
import http from 'src/utils/http'
export const URL_LOGIN = '/api/v1/users/authenticate'
export const URL_REGISTER = 'register'
export const URL_LOGOUT = 'logout'
export const URL_REFRESH_TOKEN = 'refresh-access-token'

const authApi = {
  registerAccount(body: { email: string; password: string }) {
    return http.post<AuthResponse>('/api/v1/users/register', body)
  },
  loginAccount(body: { email: string; password: string }) {
    return http.post<AuthResponse>(URL_LOGIN, body)
  },
  logoutAccount() {
    return http.post('/api/v1/users/logout')
  }
}
export default authApi
