import OrderDelivered from "src/pages/OrderDelivered"

const path = {
  home: '/',
  user: '/user',
  profile: '/user/profile',
  changePassword: '/user/password',
  historyPurchase: '/user/purchase',
  historyPurchaseDetail: '/user/purchase/detail',
  login: '/login',
  register: '/register',
  logout: '/logout',
  productDetail: ':nameId',
  cart: '/cart',
  payment:'/payment',

  // seller page
  order: '/seller/order',
  ordersellerdetail: '/seller/order/detail',
  detailorder: '/seller/order/:id',
  
  productlist: '/seller/product/list',
  product: '/seller/product/:id',

  RegisterShop : '/seller-shop-register',

  pageShop:'/seller-shop/:id',

  pageFormPromotion:'/seller-promiton/:promotionId',
  pageListPromotion:'/seller-list-promotion',


  

  shipping: '/seller/product/shipping',
  revenue: '/seller/product/revenue',
  



  shipper:'/shipper',
  OrderDelivered:'/shipper/order-delivered',


} as const

export default path
