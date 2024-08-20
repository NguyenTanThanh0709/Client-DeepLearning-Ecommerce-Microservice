import { lazy, useContext } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import path from 'src/constants/path'
import { AppContext } from './contexts/app.context'
import CartLayout from './layouts/CartLayout'
import MainLayout from './layouts/MainLayout'
import RegisterLayout from './layouts/RegisterLayout'
import UserLayout from './pages/User/layouts/UserLayout'
import SellerLayout from './layouts/SellerLayout'
import FormProduct from './pages/SellerPage/FormProduct'
import DetailOrder from './pages/SellerPage/DetailOrder'
import PromotionList from './pages/SellerPage/PromotionList/PromotionList'
import DetailOrderU1 from './pages/User/pages/DetailOrderU1'
import Shipper from './pages/Shipper'
import OrderDelivered from './pages/OrderDelivered'


const Login = lazy(() => import('./pages/Login'))
const ProductList = lazy(() => import('./pages/ProductList'))
const Profile = lazy(() => import('./pages/User/pages/Profile'))
const Register = lazy(() => import('./pages/Register'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const ChangePassword = lazy(() => import('./pages/User/pages/ChangePassword'))
const HistoryPurchase = lazy(() => import('./pages/User/pages/HistoryPurchase'))
const DetailOrderU = lazy(() => import('./pages/User/pages/DetailOrderU'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Payment = lazy(() => import('./pages/Payment'))
const Order = lazy(() => import('./pages/SellerPage/Order'))
const Product = lazy(() => import('./pages/SellerPage/Product'))
const Promotion = lazy(() => import('./pages/SellerPage/Promotion'))
const Revenue = lazy(() => import('./pages/SellerPage/Revenue'))
const Shipping = lazy(() => import('./pages/SellerPage/Shipping'))
const ShopProfile = lazy(() => import('./pages/SellerPage/ShopProfile'))
const RegisterSeller = lazy(() => import('./pages/SellerPage/RegisterSeller'))



function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)

  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.order,
          element: (
            <SellerLayout>
              <Order />
            </SellerLayout>
          )
        },
        {
          path: path.detailorder,
          element: (
            <SellerLayout>
              <DetailOrder />
            </SellerLayout>
          )
        },
        {
          path: path.ordersellerdetail,
          element: (
            <SellerLayout>
              <DetailOrderU1 />
            </SellerLayout>
          )
        },
        {
          path: path.productlist,
          element: (
            <SellerLayout>
              <Product />
            </SellerLayout>
          )
        },
        {
          path: path.product,
          element: (
            <SellerLayout>
              <FormProduct />
            </SellerLayout>
          )
        },
        {
          path: path.shipper,
          element: (
            <Shipper/>
          )
        },
        {
          path: path.OrderDelivered,
          element: (
            <OrderDelivered/>
          )
        },
        {
          path: path.pageShop,
          element: (
            <SellerLayout>
              <ShopProfile />
            </SellerLayout>
          )
        },
        {
          path: path.pageFormPromotion,
          element: (
            <SellerLayout>
              <Promotion />
            </SellerLayout>
          )
        },
        {
          path: path.pageListPromotion,
          element: (
            <SellerLayout>
              <PromotionList />
            </SellerLayout>
          )
        },
        {
          path: path.shipping,
          element: (
            <SellerLayout>
              <Shipping />
            </SellerLayout>
          )
        },
        {
          path: path.revenue,
          element: (
            <SellerLayout>
              <Revenue />
            </SellerLayout>
          )
        },
        {
          path: path.RegisterShop,
          element: (
            <RegisterLayout>
              <RegisterSeller />
            </RegisterLayout>
          )
        }
      ]
    },












    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          )
        },
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.cart,
          element: (
            <CartLayout>
              <Cart />
            </CartLayout>
          )
        },
        {
          path: path.payment,
          element: (
            <MainLayout>
              <Payment />
            </MainLayout>
          )
        },
        {
          path: path.user,
          element: (
            <MainLayout>
              <UserLayout />
            </MainLayout>
          ),
          children: [
            {
              path: path.profile,
              element: <Profile />
            },
            {
              path: path.changePassword,
              element: <ChangePassword />
            },
            {
              path: path.historyPurchase,
              element: <HistoryPurchase />
            },
            {
              path: path.historyPurchaseDetail,
              element: <DetailOrderU />
            }
          ]
        }
      ]
    },
    {
      path: path.productDetail,
      element: (
        <MainLayout>
          <ProductDetail />
        </MainLayout>
      )
    },
    {
      path: '',
      index: true,
      element: (
        <MainLayout>
          <ProductList />
        </MainLayout>
      )
    },
    {
      path: '*',
      element: (
        <MainLayout>
          <NotFound />
        </MainLayout>
      )
    }
  ])
  return routeElements
}
