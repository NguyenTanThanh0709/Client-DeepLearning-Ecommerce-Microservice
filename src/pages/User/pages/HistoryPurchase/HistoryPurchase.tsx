import { useQuery } from '@tanstack/react-query'
import purchaseApi from 'src/apis/purchase.api'
import classNames from 'classnames'
import { createSearchParams, Link } from 'react-router-dom'
import path from 'src/constants/path'
import { OrderItemRequest, OrderRequest } from 'src/constants/contant'
import Modal from 'react-modal';
import { purchasesStatus } from 'src/constants/purchase'
import { useState } from 'react'
import useQueryParams from 'src/hooks/useQueryParams'
import { Purchase, PurchaseListStatus } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import { useNavigate } from 'react-router-dom';
import { PaymentInfo } from 'src/constants/contant'
import { toast } from 'react-toastify'


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


  const onViewDetails = (purchase: OrderRequest) => {
    navigate('/user/purchase/detail', { state: { purchase } });
  };


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
          <div className='sticky top-0 flex rounded-t-sm shadow-sm'>{purchaseTabsLink}</div>
          <div>
          {purchasesInCart?.map((purchase) => (
  <div key={purchase.id} className='mt-6 rounded-lg border border-gray-300 bg-gradient-to-r from-blue-50 to-blue-100 p-6 shadow-lg transition duration-300 hover:shadow-2xl'>
    <div className='flex justify-between items-center mb-4'>
      <div>
        <h3 className='text-xl font-bold text-blue-800'>{`Đơn hàng ID: ${purchase.id}`}</h3>
        <p className='text-md text-blue-600'>{`Trạng thái: ${purchase.status}`}</p>
        <p className='text-sm text-gray-500'>{`Ngày đặt: ${new Date(purchase.orderDate).toLocaleDateString()}`}</p>
      </div>
<div className='flex flex-col space-y-4'>
<button onClick={() => onViewDetails(purchase)} className='bg-blue-400 text-white rounded-full px-6 py-2 text-sm font-semibold transition-transform transform hover:scale-105'>
        Xem chi tiết
      </button>
      <button
  onClick={() => purchase.id !== null && onViewPaymentInfo(purchase.id)}
  className="bg-green-400 text-white rounded-full px-6 py-2 text-sm font-semibold transition-transform transform hover:scale-105"
>
  Xem thông tin thanh toán
</button>


</div>
    </div>

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
  </div>
))}

          </div>
        </div>
      </div>
      <ModalComponent
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        paymentInfo={paymentInfo}
      />
    </div>
  )
}
