import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ShopApi from 'src/apis/shop.api';
import purchaseApi from 'src/apis/purchase.api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { OrderRequestFull } from 'src/constants/contant';

const Shipper: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'pickup' | 'delivery'>('pickup');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const profile = JSON.parse(localStorage.getItem('profile') || '{}');
  const city = profile?.city;

  const { data: Shops, refetch: refetchShop } = useQuery({
    queryKey: ['shop'],
    queryFn: () => ShopApi.getShopsByDistrict(city)
  });

  const { data: purchasesInCartData } = useQuery({
    queryKey: ['orders', selectedShopId],
    queryFn: () => purchaseApi.getOrderShop(selectedShopId?.toString() || '', 'waitForGetting'),
    enabled: !!selectedShopId, // Only run the query if selectedShopId is not null
  });


  const { data: purchasesInCartDataShip } = useQuery({
    queryKey: ['orderscity', city],
    queryFn: () => purchaseApi.getOrderShipper(city?.toString() || '', 'inProgress'),
    enabled: !!city, // Only run the query if selectedShopId is not null
  });

  const handleViewOrders = (shopId: number) => {
    setSelectedShopId(shopId);
    setShowModal(true);
  };


  const closeModal = () => {
    setShowModal(false);
    setSelectedShopId(null); // Reset selected shop ID when closing modal
  };

  const mutation = useMutation({
    mutationFn: (data: { id: string; status: string }) => {
      return purchaseApi.updateOrderStatus(data.id, data.status);
    },
    onSuccess: (data) => {
      toast.success('Order status updated successfully', { autoClose: 2000 });      
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

  const handleOKOrder = (id:string) => {
    const orderId = id?.toString() || '0';
    const newStatus = 'delivered';
    mutation.mutate({ id: orderId, status: newStatus });
    closeModal();
  };


  const handleNOTOKOrder = (id:string) => {
    const orderId = id?.toString() || '0';
    const newStatus = 'indelevered';
    mutation.mutate({ id: orderId, status: newStatus });
    closeModal();
  };
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Quản lý đơn hàng cho Shipper</h1>

      <div className="flex justify-center mb-4">
        <button
          className={`px-6 py-2 mr-4 font-semibold ${selectedTab === 'pickup' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
          onClick={() => setSelectedTab('pickup')}
        >
          Đơn hàng cần lấy
        </button>
        <button
          className={`px-6 py-2 font-semibold ${selectedTab === 'delivery' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
          onClick={() => setSelectedTab('delivery')}
        >
          Đơn hàng cần giao
        </button>
      </div>

    

      {selectedTab === 'pickup' && (
        <div>
          <h2 className="text-2xl font-semibold text-center text-orange-600 mb-4">Danh sách đơn hàng cần lấy</h2>
          <ul className="space-y-4">
            {Shops?.data.map((shop) => (
              <li key={shop.id} className="bg-white p-4 shadow-md rounded-md flex items-center justify-between">
              <span className="font-semibold text-lg">{shop.name}</span>
              <span className="text-gray-500">{shop.city}</span>
              <button
                onClick={() => handleViewOrders(shop.id)}
                className="bg-yellow-300 text-blue font-semibold py-2 px-4 rounded hover:bg-orange-700 transition duration-300"
              >
                Xem Danh Sách Đơn Hàng
              </button>
            </li>
            ))}
          </ul>
        </div>
      )}

      {selectedTab === 'delivery' && (
        <div>
          <h2 className="text-2xl font-semibold text-center text-green-600 mb-4">Danh sách đơn hàng cần giao</h2>
          <ul className="space-y-4">
          {purchasesInCartDataShip ? (
              <div>
                {purchasesInCartDataShip?.data?.map((order: OrderRequestFull) => (
                  <div key={order.id} className='bg-slate-300 p-2'>
                    <p><strong>ID Đơn Hàng:</strong> {order.id}</p>
                    <p><strong>Tổng Tiền:</strong> {order.totalMoney} VND</p>
                    <p><strong>Trạng Thái:</strong> {order.status}</p>
                    <p><strong>Ngày Đặt Hàng:</strong> {order.orderDate}</p>
                    <h4 className="mt-4 font-semibold">Chi Tiết Sản Phẩm:</h4>
                    
                    <ul>
                      {order.orderItems.map((item) => (
                        <li key={item.id} className="mb-2">
                          <p><strong>Sản Phẩm ID:</strong> {item.productData.id}</p>
                          <p><strong>Số Lượng:</strong> {item.quantity}</p>
                          <p><strong>Tên:</strong> {item.productData.name}</p>
                          <p><strong>Ghi Chú:</strong> {item.note}</p>

                        </li>
                      ))}
                                  <button
                onClick={() => handleOKOrder(order.id?.toString() || '0')}
              className="mt-4 bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-red-700 transition duration-300"
            >
              Xác nhận Giao Thành Công
            </button>
            <button
                onClick={() => handleNOTOKOrder(order.id?.toString() || '0')}
              className="mt-4 bg-green-600 m-2 text-white font-semibold py-2 px-4 rounded hover:bg-red-700 transition duration-300"
            >
              Xác nhận Giao Thất Bại
            </button>
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p>Không có dữ liệu đơn hàng.</p>
            )}
          </ul>
        </div>
      )}

{showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
            <h3 className="text-xl font-bold mb-4">Danh Sách Đơn Hàng</h3>
            {purchasesInCartData ? (
              <div>
                {purchasesInCartData?.data?.map((order: OrderRequestFull) => (
                  <div key={order.id}>
                    <p><strong>ID Đơn Hàng:</strong> {order.id}</p>
                    <p><strong>Tổng Tiền:</strong> {order.totalMoney} VND</p>
                    <p><strong>Trạng Thái:</strong> {order.status}</p>
                    <p><strong>Ngày Đặt Hàng:</strong> {order.orderDate}</p>
                    <h4 className="mt-4 font-semibold">Chi Tiết Sản Phẩm:</h4>
                    
                    <ul>
                      {order.orderItems.map((item) => (
                        <li key={item.id} className="mb-2">
                          <p><strong>Sản Phẩm ID:</strong> {item.productData.id}</p>
                          <p><strong>Số Lượng:</strong> {item.quantity}</p>
                          <p><strong>Tên:</strong> {item.productData.name}</p>
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
