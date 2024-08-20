import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ShopApi from 'src/apis/shop.api';
import { Shop } from 'src/constants/contant';
import userApi from 'src/apis/user.api';
import purchaseApi from 'src/apis/purchase.api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export interface OrderItemRequest {
  id: number | null;
  productId: number;
  idSizeQuantity?: number;
  promotionId?: number;
  quantity: number;
  note: string;
}

export interface OrderRequest {
  id: number | null;
  customerId: number;
  shopId: number;
  totalMoney: number;
  status: string;
  orderItems: OrderItemRequest[];
  orderDate: string;
}

const Shipper: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);

  const id = localStorage.getItem('id');
  const userId = id !== null ? parseInt(id) : 0;
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => userApi.getProfile(userId)
  });
  const profile = profileData?.data.data;

  useEffect(() => {
    const fetchShops = async () => {
      const districtId = profile?.city;

      if (districtId === undefined) {
        return;
      }

      try {
        const response = await ShopApi.getShopsByDistrict(districtId);
        setShops(response.data);
      } catch (error) {
        setError('Error fetching shops');
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [profile]);

  const { data: purchasesInCartData } = useQuery({
    queryKey: ['orders', selectedShopId],
    queryFn: () => purchaseApi.getOrderShop(selectedShopId?.toString() || '', 'waitForGetting'),
    enabled: !!selectedShopId, // Only run the query if selectedShopId is not null
  });

  const handleViewOrders = (shopId: number) => {
    setSelectedShopId(shopId);
    setShowModal(true);
  };

  const mutation = useMutation({
    mutationFn: (data: { id: string; status: string }) => {
      return purchaseApi.updateOrderStatus(data.id, data.status);
    },
    onSuccess: (data) => {
      toast.success('Order status updated successfully', { autoClose: 2000 });
      refetch();
      
    },
    onError: (error) => {
      toast.error('Failed to update order status', { autoClose: 2000 });
    },
  });

  const handleCancelOrder = (id:string) => {
    const orderId = id?.toString() || '0';
    const newStatus = 'inProgress';
    mutation.mutate({ id: orderId, status: newStatus });
    closeModal();
  };


  const closeModal = () => {
    setShowModal(false);
    setSelectedShopId(null); // Reset selected shop ID when closing modal
  };

  if (loading) {
    return <p className="text-center text-xl font-semibold">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center text-lg">{error}</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link to="/" className="text-3xl font-bold mb-6 text-center text-pink-600">
        Trang chủ
      </Link>
      <br />
      <Link to="/shipper/order-delivered" className="text-3xl font-bold mb-6 text-center text-pink-600">
        CLick Danh sách đơn cần giao
      </Link>
      <br />

      <br />
      <br />

      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Danh sách shop tại địa chỉ của bạn</h2>
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Các đơn hàng cần nhận của bạn</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {shops.map((shop) => (
          <li key={shop.id} className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
            <div className="relative">
              <img
                src="https://cdn.vietnambiz.vn/2019/10/3/color-silhouette-cartoon-facade-shop-store-vector-14711058-1570007843495391141359-1570076859193969194096-15700769046292030065819-1570076927728377843390.png"
                alt={shop.name}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <h3 className="text-white text-xl font-semibold">{shop.name}</h3>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-600 mb-2">{shop.description}</p>
              <p className="text-gray-500">Type: {shop.type}</p>
              <p className="text-gray-500">
                Location: {shop.detailLocation}, {shop.ward}, {shop.district}, {shop.city}
              </p>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => handleViewOrders(shop.id)}
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
              >
                Xem Danh Sách Đơn Hàng
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
            <h3 className="text-xl font-bold mb-4">Danh Sách Đơn Hàng</h3>
            {purchasesInCartData ? (
              <div>
                {purchasesInCartData?.data?.map((order: OrderRequest) => (
                  <div key={order.id}>
                    <p><strong>ID Đơn Hàng:</strong> {order.id}</p>
                    <p><strong>Tổng Tiền:</strong> {order.totalMoney} VND</p>
                    <p><strong>Trạng Thái:</strong> {order.status}</p>
                    <p><strong>Ngày Đặt Hàng:</strong> {order.orderDate}</p>
                    <h4 className="mt-4 font-semibold">Chi Tiết Sản Phẩm:</h4>
                    
                    <ul>
                      {order.orderItems.map((item) => (
                        <li key={item.id} className="mb-2">
                          <p><strong>Sản Phẩm ID:</strong> {item.productId}</p>
                          <p><strong>Số Lượng:</strong> {item.quantity}</p>
                          <p><strong>Ghi Chú:</strong> {item.note}</p>

                        </li>
                      ))}
                                  <button
                onClick={() => handleCancelOrder(order.id?.toString() || '0')}
              className="mt-4 bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-red-700 transition duration-300"
            >
              Xác nhận Đơn Hàng
            </button>
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p>Không có dữ liệu đơn hàng.</p>
            )}
            <button
              onClick={closeModal}
              className="mt-4 bg-red-600 text-white font-semibold py-2 px-4 rounded hover:bg-red-700 transition duration-300"
            >
              Đóng
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default Shipper;
