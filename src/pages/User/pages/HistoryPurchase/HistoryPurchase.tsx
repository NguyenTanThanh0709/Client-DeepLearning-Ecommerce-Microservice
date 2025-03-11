import { useMutation, useQuery } from '@tanstack/react-query';
import purchaseApi from 'src/apis/purchase.api'
import classNames from 'classnames'
import { createSearchParams, Link } from 'react-router-dom'
import path from 'src/constants/path'
import { OrderItemDtoReponse } from 'src/constants/contant';
import Modal from 'react-modal';
import { purchasesStatus } from 'src/constants/purchase'
import { useState } from 'react'
import useQueryParams from 'src/hooks/useQueryParams'
import { Purchase, PurchaseListStatus } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import { useNavigate } from 'react-router-dom';
import { PaymentInfo } from 'src/constants/contant'
import { toast } from 'react-toastify'
import { Mail, Phone, MapPin, Store, CreditCard } from "lucide-react";
import productApi from 'src/apis/product.api';


const purchaseTabs = [
  { status: purchasesStatus.waitForConfirmation, name: 'Chờ xác nhận' }, 
  { status: purchasesStatus.waitForGetting, name: 'Chờ lấy hàng' }, //
  { status: purchasesStatus.inProgress, name: 'Đang giao' },
  { status: purchasesStatus.delivered, name: 'Đã giao' },
  { status: purchasesStatus.cancelled, name: 'Đã hủy' },
  { status: purchasesStatus.refund, name: 'Hoàn tiền' },
  { status: purchasesStatus.indelevered, name: 'Giao không thành công' }
]


// Định nghĩa interface cho props của ModalComponent
interface ModalComponentProps {
  isOpen: boolean;
  onRequestClose: () => void;
  paymentInfo: PaymentInfo | null;
}

// Định nghĩa modal tùy chỉnh
const ModalComponent: React.FC<ModalComponentProps> = ({ isOpen, onRequestClose, paymentInfo }) => {
  if (!isOpen) return null; // Không hiển thị modal nếu không mở





  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-11/12 md:w-1/3">
        <h2 className="text-xl font-bold mb-4">Thông tin thanh toán</h2>
        {paymentInfo && (
          <div>
            <p><strong>ID:</strong> {paymentInfo.id}</p>
            <p><strong>Ngày thanh toán:</strong> {new Date(paymentInfo.paymentDate).toLocaleString()}</p>
            <p><strong>Trạng thái:</strong> {paymentInfo.status}</p>
            <p><strong>Phương thức:</strong> {paymentInfo.method}</p>
            <p><strong>Số tiền:</strong> {formatCurrency(paymentInfo.amount)}</p>
          </div>
        )}
        <button onClick={onRequestClose} className="mt-4 bg-red-500 text-white rounded-full px-6 py-2 text-sm font-semibold">
          Đóng
        </button>
      </div>
    </div>
  );
};




export default function HistoryPurchase() {
  const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentReviewItem, setCurrentReviewItem] = useState<OrderItemDtoReponse | null>(null);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(1);

  const queryParams: { status?: string } = useQueryParams()
  const status = queryParams.status || purchasesStatus.waitForConfirmation
  console.log(status)

  const id = localStorage.getItem('id');
  const userId = id !== null ? id : '0'; // Keep it as a string since API might expect a string
  
  const { data: purchasesInCartData } = useQuery({
    queryKey: ['orders', { status }],
    queryFn: () => purchaseApi.getOrder(userId, status as PurchaseListStatus) // Pass userId as the first parameter
  });
  

  const purchasesInCart = purchasesInCartData?.data
  console.log(purchasesInCart)


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

  const handleSubmitReview = () => {
    const idCustomer = localStorage.getItem('id');
    if (!idCustomer) {
      toast.error('User not logged in', { autoClose: 2000 });
      return;
    }

    const data = {
      idCustomer,
      productId: currentReviewItem?.productData.id || '',
      comment,
      rating,
    };
    console.log(data);
    try {
      productApi.addpreview(data);
      toast.success('Review submitted successfully', { autoClose: 2000 });
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to submit review', { autoClose: 2000 });
    } 

  };
  
  const handleCancelOrder = (id: number | null) => {
    if (id === null) {
      console.error("Order ID is null, cannot cancel order.");
      return;
    }
  
    const orderId = id.toString();
    const newStatus = 'cancelled';
    mutation.mutate({ id: orderId, status: newStatus });
  };

  const handleOpenModal = (item: OrderItemDtoReponse) => {
    setCurrentReviewItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentReviewItem(null);
    setComment('');
    setRating(1);
  };
  


  const purchaseTabsLink = purchaseTabs.map((tab) => (
    <Link
      key={tab.status}
      to={{
        pathname: path.historyPurchase,
        search: createSearchParams({
          status: String(tab.status),
        }).toString(),
      }}
      className={classNames('flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center', {
        'border-b-orange text-orange': status === tab.status,
        'border-b-black/10 text-gray-900': status !== tab.status,
      })}
    >
      {tab.name}
    </Link>
  ));


  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);

  const onViewPaymentInfo = async (purchaseId: number) => {
    try {
      const response = await purchaseApi.getPaymentByOrderId(purchaseId);
      // Kiểm tra xem mã trạng thái có phải là 200 hay không
      if (response.status === 200) {
        setPaymentInfo(response.data);
        setModalIsOpen(true);
      } else {
        // Hiển thị alert nếu không phải là 200
        toast.warning('Không tìm thấy thông tin thanh toán.');
      }
    } catch (error) {
      // Xử lý lỗi nếu có
      toast.warning('đơn hàng này chưa được thanh toán')
    }
  };
  
  

  return (
    <div>
<div className='overflow-x-auto'>
  <div className='min-w-[700px]'>
  {isModalOpen && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center'>
          <div className='bg-white p-6 rounded-lg shadow-lg'>
            <h2 className='text-xl font-bold mb-4'>Đánh giá sản phẩm</h2>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder='Viết đánh giá của bạn...'
              className='w-full p-2 border rounded mb-4'
            />
            <div className='mb-4'>
              <span className='mr-2'>Đánh giá:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-1 ${star <= rating ? 'text-yellow-500' : 'text-gray-400'}`}
                >
                  ★
                </button>
              ))}
            </div>
            <div className='flex justify-end space-x-2'>
              <button
                onClick={handleCloseModal}
                className='px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400'
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitReview}
                className='px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-700'
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      )}
    <div className='sticky top-0 flex rounded-t-sm shadow-sm'>{purchaseTabsLink}</div>
    <div>
      {purchasesInCart?.map((purchase) => (
        <div
          key={purchase.id}
          className='mt-6 rounded-lg border border-gray-300 bg-gradient-to-r from-blue-50 to-blue-100 p-6 shadow-lg transition duration-300 hover:shadow-2xl'
        >
          {/* Thông tin đơn hàng */}
          <div className='flex justify-between items-center mb-4'>
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <div>
              <h3 className="text-xl font-bold text-blue-800">🛒 Đơn hàng ID: {purchase.id}</h3>
              <p className="text-md text-blue-600">{`Trạng thái: ${purchase.status}`}</p>
              <p className="text-sm text-gray-500">🕒 Ngày đặt: {new Date(purchase.orderDate).toLocaleDateString()}</p>
            </div>
          </div>
            <div className='flex flex-col space-y-4'>
              <button
                onClick={() => purchase.id !== null && onViewPaymentInfo(purchase.id)}
                className='bg-green-400 text-white rounded-full px-6 py-2 text-sm font-semibold transition-transform transform hover:scale-105'
              >
                Xem thông tin thanh toán
              </button>
            </div>
          </div>

          {/* Thông tin khách hàng */}
          <div className="bg-blue-50 p-4 rounded-lg shadow-md mb-4">
        <h4 className="text-lg font-semibold text-gray-700 flex items-center">
          <Mail className="mr-2 text-blue-600" /> Thông tin khách hàng
        </h4>
        <p className="text-sm text-gray-600 flex items-center">
          <Mail className="mr-2 text-gray-500" /> Email: {purchase.customerData.email}
        </p>
        <p className="text-sm text-gray-600 flex items-center">
          <Phone className="mr-2 text-gray-500" /> SĐT: {purchase.customerData.phone}
        </p>
        <p className="text-sm text-gray-600 flex items-center">
          <MapPin className="mr-2 text-gray-500" /> Địa chỉ: {purchase.customerData.detailLocation}, {purchase.customerData.ward}, {purchase.customerData.district}, {purchase.customerData.city}
        </p>
      </div>

      {/* Thông tin cửa hàng */}
      <div className="bg-yellow-50 p-4 rounded-lg shadow-md mb-4">
        <h4 className="text-lg font-semibold text-gray-700 flex items-center">
          <Store className="mr-2 text-yellow-600" /> Thông tin cửa hàng
        </h4>
        <p className="text-sm text-gray-600 flex items-center">
          🏬 Tên: {purchase.shopData.name}
        </p>
        <p className="text-sm text-gray-600 flex items-center">
          📖 Mô tả: {purchase.shopData.description}
        </p>
        <p className="text-sm text-gray-600 flex items-center">
          🔖 Loại: {purchase.shopData.type}
        </p>
        <p className="text-sm text-gray-600 flex items-center">
          <MapPin className="mr-2 text-gray-500" /> Địa chỉ: {purchase.shopData.detailLocation}, {purchase.shopData.ward}, {purchase.shopData.district}, {purchase.shopData.city}
        </p>
      </div>

       {/* Thông tin thanh toán */}
       <div className="bg-green-50 p-4 rounded-lg shadow-md">
        <h4 className="text-lg font-semibold text-gray-700 flex items-center">
          <CreditCard className="mr-2 text-green-600" /> Thông tin thanh toán
        </h4>
        <p className="text-sm text-gray-600 flex items-center">
          💰 Số tiền: <span className="font-bold text-green-600 ml-2">₫{purchase.payment.amount.toLocaleString()}</span>
        </p>
        <p className="text-sm text-gray-600 flex items-center">
          🏷️ Phương thức: {purchase.payment.method.toUpperCase()}
        </p>
        <p className="text-sm text-gray-600 flex items-center">
          🔴 Trạng thái: <span className={`ml-2 font-semibold ${purchase.payment.status === "Unpaid" ? "text-red-500" : "text-green-500"}`}>
            {purchase.payment.status === "Unpaid" ? "Chưa thanh toán" : "Đã thanh toán"}
          </span>
        </p>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="bg-white p-4 rounded-lg shadow-md mt-2">
        <h4 className="text-lg font-semibold text-gray-700">🛒 Sản phẩm trong đơn hàng</h4>
        {purchase.orderItems.map((item: any) => (
  <div key={item.id} className="border border-gray-300 rounded-lg p-4 shadow-md bg-white mb-4">
    <div className="grid grid-cols-12 gap-4 items-center">
      {/* Hình ảnh sản phẩm */}
      <div className="col-span-2">
        <img
          src={item.productData.images[0]}
          alt={item.productData.name}
          className="w-full h-20 object-cover rounded-lg"
        />
      </div>

      {/* Thông tin sản phẩm */}
      <div className="col-span-5">
        <h5 className="text-lg font-semibold text-gray-800">{item.productData.name}</h5>
        <p className="text-sm text-gray-600">💰 Giá: {item.productData.price.toLocaleString()} VND</p>
        <p className="text-sm text-gray-600">📦 Số lượng: {item.quantity}</p>
        {item.sizeQuantityData && (
          <p className="text-sm text-gray-600">
            🔘 Size: {item.sizeQuantityData.size} | 🎨 Màu: {item.sizeQuantityData.color}
          </p>
        )}
      </div>

      {/* Thông tin khuyến mãi */}
      <div className="col-span-3 bg-blue-50 p-3 rounded-lg">
        <h5 className="text-md font-semibold text-blue-600">🎉 Khuyến mãi</h5>
        <p className="text-sm text-gray-700">🏷️ {item.promotionData?.name || "Không có"}</p>
        <p className="text-sm text-gray-700">💰 Giảm: {item.promotionData?.discountAmount?.toLocaleString() || "0"} VND</p>
      </div>

      {/* Nút đánh giá sản phẩm */}
      {purchase.status === "delivered" && (
        <div className="col-span-2 flex justify-end">
          <button
            onClick={() => handleOpenModal(item)}
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
          >
            ⭐ Đánh giá
          </button>
        </div>
      )}
    </div>
  </div>
))}

      </div>



          {/* Tổng tiền và trạng thái */}
          <div className='flex justify-between items-center mt-4'>
            <div className='flex flex-col'>
              <span className='font-semibold text-lg text-gray-800'>Tổng giá tiền:</span>
              <span className='text-2xl text-orange-500 font-bold'>
                ₫{formatCurrency(purchase.totalMoney)}
              </span>
            </div>
            <div className='flex items-center'>
              <span className='bg-green-200 text-green-800 rounded-full px-3 py-1 text-xs font-medium'>
                {purchase.status === 'delivered' ? 'Đã giao' : 'Chưa giao'}
              </span>
            </div>
          </div>
        


{purchase.status === 'waitForConfirmation' && (
              <button
                onClick={() => handleCancelOrder(purchase.id)}
                className='px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none mt-4'
              >
                Hủy đơn
              </button>
            )}


        </div>
      ))}
    </div>
  </div>
</div>;

      <ModalComponent
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        paymentInfo={paymentInfo}
      />
    </div>
  )
}
