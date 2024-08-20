import React from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query';

import purchaseApi from 'src/apis/purchase.api'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import { toast } from 'react-toastify'


export default function OrderDelivered() {

    const { data: purchasesInCartData } = useQuery({
        queryKey: ['orders', { status }],
        queryFn: () => purchaseApi.getOrderStatus('inProgress') // Pass userId as the first parameter
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
    
      const handleIndelivery = (id:number, status: string, total:number) => {
        const orderId = id?.toString() || '0';
        mutation.mutate({ id: orderId, status: status });

        if(status === 'delivered'){
          toast.success('Đơn hàng đã được giao thành công', { autoClose: 2000 });
          const paymentData = {
            orderId: id,
            paymentDate: new Date(),
            status: 'completed',
            method: 'COD', 
            amount: total,
          };
          purchaseApi.addpayment(paymentData).then(() => {
            toast.success('Payment recorded successfully', { autoClose: 2000 });
          }).catch(() => {
            toast.error('Failed to record payment', { autoClose: 2000 });
          });
        }
        else{
          toast.error('Đơn hàng đã được hủy', { autoClose: 2000 });
        }
      };



  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link to="/" className="text-3xl font-bold mb-6 text-center text-pink-600">
        Trang chủ
      </Link>
      <br />
      <Link to="/shipper" className="text-3xl font-bold mb-6 text-center text-pink-600">
        CLick Danh sách đơn cần lấy
      </Link>
      <br />

      <br />
      <br />

    
      {purchasesInCart?.map((purchase) => (
  <div key={purchase.id} className='mt-6 rounded-lg border border-gray-300 bg-gradient-to-r from-blue-50 to-blue-100 p-6 shadow-lg transition duration-300 hover:shadow-2xl'>
    <div className='flex justify-between items-center mb-4'>
      <div>
        <h3 className='text-xl font-bold text-blue-800'>{`Đơn hàng ID: ${purchase.id}`}</h3>
        <p className='text-md text-blue-600'>{`Trạng thái: ${purchase.status}`}</p>
        <p className='text-sm text-gray-500'>{`Ngày đặt: ${new Date(purchase.orderDate).toLocaleDateString()}`}</p>
      </div>
<div className='flex flex-col space-y-4'>
<button  onClick={() => handleIndelivery(purchase.id, 'delivered', purchase.totalMoney)}  className='bg-blue-400 text-white rounded-full px-6 py-2 text-sm font-semibold transition-transform transform hover:scale-105'>
        Đã giao và thanh toán
      </button>
      <button
 onClick={() => handleIndelivery(purchase.id, 'indelevered', purchase.totalMoney)}
  className="bg-green-400 text-white rounded-full px-6 py-2 text-sm font-semibold transition-transform transform hover:scale-105"
>

  Không thể giao hàng
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
          {purchase.status}
        </span>
      </div>
    </div>
  </div>
))}


    </div>
  )
}
