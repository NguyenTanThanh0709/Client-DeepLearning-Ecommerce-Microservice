import React from 'react'


const orders = [
  {
    productImage: 'https://via.placeholder.com/150',
    productName: 'Product 1',
    price: 100000,
    quantity: 2,
  },
  {
    productImage: 'https://via.placeholder.com/150',
    productName: 'Product 2',
    price: 200000,
    quantity: 1,
  },
  // Thêm các đơn hàng khác ở đây
];

interface Order {
  productImage: string;
  productName: string;
  price: number;
  quantity: number;
}


export default function DetailOrder() {
  const shippingCost = 30000; // Ví dụ tiền ship
  const discount = 50000; // Ví dụ tiền khuyến mãi

  const totalProductCost = orders.reduce((total, order) => total + order.price * order.quantity, 0);
  const totalPayable = totalProductCost + shippingCost - discount;
  return (
    <div className='m-4'>
      <div className='flex justify-between my-2 bg-slate-200 rounded-lg  p-4'>
        <div className='flex'>
          <svg className='w-8 ' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path className='text-red-500' fill-rule="evenodd" d="M5,2 L5,3 L3,3 L3,14 L13,14 L13,3 L11,3 L11,2 L13,2 C13.5522847,2 14,2.44771525 14,3 L14,14 C14,14.5522847 13.5522847,15 13,15 L3,15 C2.44771525,15 2,14.5522847 2,14 L2,3 C2,2.44771525 2.44771525,2 3,2 L5,2 Z M6,2 L6,3 L10,3 L10,2 L6,2 Z M6,1 L10,1 C10.5522847,1 11,1.44771525 11,2 L11,3 C11,3.55228475 10.5522847,4 10,4 L6,4 C5.44771525,4 5,3.55228475 5,3 L5,2 C5,1.44771525 5.44771525,1 6,1 Z M5.5,6 L10.5,6 C10.7761424,6 11,6.22385763 11,6.5 C11,6.77614237 10.7761424,7 10.5,7 L5.5,7 C5.22385763,7 5,6.77614237 5,6.5 C5,6.22385763 5.22385763,6 5.5,6 Z M5.5,9 L10.5,9 C10.7761424,9 11,9.22385763 11,9.5 C11,9.77614237 10.7761424,10 10.5,10 L5.5,10 C5.22385763,10 5,9.77614237 5,9.5 C5,9.22385763 5.22385763,9 5.5,9 Z"></path></svg>
          <h1 className='my-2 text-red-500 mt-5 fw-bold font-black' >Trạng thái đơn hàng</h1>
        </div>
      <div>
      <p className='text-green-500'>Chờ xác nhận</p>
      <p className='text-gray-400'>Hiểu bởi người mua</p>
      <p className='text-gray-400'>Lý do hủy</p>
      </div>
      </div>

      <div className='my-2 bg-slate-200 rounded-lg  p-4'>
        <div className='flex-col my-2'>
        <div className='flex'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className='w-7'><path d="M23.3 11.5h-1.8l.5-1.7c.2-.6-.2-1.3-.8-1.5-.6-.2-1.3.2-1.5.8l-.7 2.4h-3.6l.6-1.7c.2-.6-.2-1.3-.8-1.5s-1.3.2-1.5.8l-.7 2.4h-3c-.7 0-1.2.5-1.2 1.2s.5 1.2 1.2 1.2h2.2l-1 3.3H8.7c-.7 0-1.2.5-1.2 1.2s.5 1.2 1.2 1.2h1.7l-.7 2.3c-.2.6.2 1.3.8 1.5.1 0 .2.1.4.1.5 0 1-.3 1.1-.8l.9-3h3.6l-.7 2.3c-.2.6.2 1.3.8 1.5.1 0 .2.1.4.1.5 0 1-.3 1.1-.8l.9-3h3c.7 0 1.2-.5 1.2-1.2s-.5-1.2-1.2-1.2h-2.3l1-3.3h2.5c.7 0 1.2-.5 1.2-1.2s-.4-1.4-1.1-1.4zm-6 5.7h-3.6l1-3.3h3.6l-1 3.3zM11.4 2.1c0 .6-.4 1-1 1H6.8c-2 0-3.6 1.6-3.6 3.6V10c0 .6-.4 1-1 1s-1-.4-1-1V6.8c0-3.1 2.5-5.6 5.6-5.6h3.6c.6-.1 1 .4 1 .9zm9.5 26.4h4.3c2 0 3.6-1.6 3.6-3.6v-3.4c0-.6.4-1 1-1s1 .4 1 1v3.4c0 3.1-2.5 5.6-5.6 5.6h-4.3m0 0c-.6 0-1-.4-1-1s.4-1 1-1"></path></svg>
          <h1 className=' text-red-500 mt-4 fw-bold font-black' >Mã đơn hàng</h1>
        </div>
          <p className='mx-8'>1</p>
        </div>
        <div className='flex-col my-2'>
        <div className='flex'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className='w-7'><path d="M17.7 29.2H22c.6 0 1 .4 1 1s-.4 1-1 1H10c-.6 0-1-.4-1-1s.4-1 1-1h4.3C11.3 25.4 5 17.1 5 12.4 5 6.2 9.9 1.2 16 1.2s11 5 11 11.2c0 4.7-6.3 13-9.3 16.8zM16 3.2c-5 0-9 4.2-9 9.4s9 15.6 9 15.6 9-10.4 9-15.6c0-5.2-4-9.4-9-9.4zm-5 9c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5-5-2.3-5-5zm8 0c0-1.7-1.3-3-3-3s-3 1.3-3 3 1.3 3 3 3 3-1.4 3-3z"></path></svg>
          <h1 className=' text-red-500 mt-4 fw-bold font-black' >Thông tin nhận hàng</h1>
        </div>
          <p className='mx-8'>43 thôn liên cơ, hòa đông, krong pak, daklak</p>
          <p className='mx-8'>0333657671</p>
        </div>

      <div>

      </div>
      </div>


      <div className='my-2 bg-slate-200 rounded-lg  p-4'>

      <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Danh sách đơn hàng</h1>
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      {orders.map((order, index) => (
        <div className="flex items-center p-4 border-b border-gray-200">
        <img src={order.productImage} alt={order.productName} className="w-20 h-20 object-cover" />
        <div className="ml-4">
          <h3 className="text-lg font-semibold">{order.productName}</h3>
          <p className="text-gray-500">Giá: {order.price.toLocaleString()} VND</p>
          <p className="text-gray-500">Số lượng: {order.quantity}</p>
          <p className="font-bold">Thành tiền: {(order.price*order.quantity).toLocaleString()} VND</p>
        </div>
      </div>
      ))}
    </div>
        </div>

      </div>
      <div className='my-2 bg-slate-200 rounded-lg p-4'>
        <h2 className='text-xl font-semibold mb-4'>Tóm tắt đơn hàng</h2>
        <p className='mb-2'>Tổng tiền sản phẩm: {totalProductCost.toLocaleString()} VND</p>
        <p className='mb-2'>Phí vận chuyển: {shippingCost.toLocaleString()} VND</p>
        <p className='mb-2'>Giảm giá: {discount.toLocaleString()} VND</p>
        <p className='font-bold text-lg'>Tổng tiền thanh toán: {totalPayable.toLocaleString()} VND</p>
      </div>
    </div>
  )
}
