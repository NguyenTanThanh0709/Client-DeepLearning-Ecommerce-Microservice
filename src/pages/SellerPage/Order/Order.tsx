import React, { useState } from 'react';
import { OrderItemRequest, OrderRequest } from 'src/constants/contant'
import path from 'src/constants/path';
import { createSearchParams, Link, useNavigate } from 'react-router-dom';
import { purchasesStatus } from 'src/constants/purchase';
import useQueryParams from 'src/hooks/useQueryParams';
import { Purchase, PurchaseListStatus } from 'src/types/purchase.type';
import { useMutation, useQuery } from '@tanstack/react-query';

import purchaseApi from 'src/apis/purchase.api';
import { formatCurrency } from 'src/utils/utils';
import classNames from 'classnames';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';

const purchaseTabs = [
  { status: purchasesStatus.waitForConfirmation, name: 'Chờ xác nhận' },
  { status: purchasesStatus.waitForGetting, name: 'Chờ lấy hàng' },
  { status: purchasesStatus.inProgress, name: 'Đang giao' },
  { status: purchasesStatus.delivered, name: 'Đã giao' },
  { status: purchasesStatus.cancelled, name: 'Đã hủy' },
  { status: purchasesStatus.refund, name: 'Hoàn tiền' },
  { status: purchasesStatus.indelevered, name: 'Giao không thành công' }
];

export default function Order() {
  const navigate = useNavigate();
  const queryParams = useQueryParams();
  const status = queryParams.status || purchasesStatus.waitForConfirmation;

  const id = localStorage.getItem('shopId');
  const userId = id !== null ? id : '0'; // Keep it as a string since API might expect a string
  
  const { data: purchasesInCartData } = useQuery({
    queryKey: ['orders', { status }],
    queryFn: () => purchaseApi.getOrderShop(userId, status as PurchaseListStatus) // Pass userId as the first parameter
  });

  const purchasesInCart = purchasesInCartData?.data;

  const today = new Date();
  const [startDate, setStartDate] = useState<Date | null>(today);
  const [endDate, setEndDate] = useState<Date | null>(today);
  const [searchDate, setSearchDate] = useState<[Date | null, Date | null] | null>(null);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleSearch = () => {
    setSearchDate([startDate, endDate]);
    // Thực hiện tìm kiếm hoặc xử lý khác tại đây với searchDate
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

  const handleCancelOrder = (purchase: OrderRequest) => {
    const orderId = purchase.id?.toString() || '0';
    const newStatus = 'cancelled';
    console.log(orderId, newStatus);
    mutation.mutate({ id: orderId, status: newStatus });
  };


  const handleCancelOrder1 = (purchase: OrderRequest) => {
    const orderId = purchase.id?.toString() || '0';
    const newStatus = 'waitForGetting';
    console.log(orderId, newStatus);
    mutation.mutate({ id: orderId, status: newStatus });
  };

  const purchaseTabsLink = purchaseTabs.map((tab) => (
    <Link
      key={tab.status}
      to={{
        pathname: path.order,
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
    navigate('/seller/order/detail', { state: { purchase } });
  };


  return (
    <div className='overflow-x-auto my-2'>
      <div className='flex justify-between bg-slate-200 rounded-lg p-4'>
        <div>
          <h1 className='text-xl font-bold'>QUẢN LÝ ĐƠN HÀNG</h1>
        </div>
      </div>

      <div className='my-4 flex items-center'>
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          isClearable
          placeholderText='Chọn khoảng thời gian'
          className='p-2 border rounded-md'
        />
        <button
          onClick={handleSearch}
          className='ml-2 p-2 bg-blue-500 text-white rounded-md'
        >
          Tìm
        </button>
      </div>

      <div className='overflow-x-auto'>
        <div className='min-w-[700px]'>
          <div className='sticky top-0 flex rounded-t-sm shadow-sm'>{purchaseTabsLink}</div>
        </div>
      </div>

      <div className='grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow'>
        <div className='col-span-6'>
          <div className='flex items-center'>
            <div className='flex flex-shrink-0 items-center justify-center pr-3'>
              <input
                type='checkbox'
                className='h-5 w-5 accent-orange'
              />
            </div>
            <div className='flex-grow text-black'>Sản phẩm</div>
          </div>
        </div>
        <div className='col-span-6'>
          <div className='grid grid-cols-5 text-center'>
            <div className='col-span-2'>Tổng tiền</div>
            <div className='col-span-1'>Số lượng</div>
            <div className='col-span-1'>Trạng thái</div>
            <div className='col-span-1'>Thao tác</div>
          </div>
        </div>
      </div>

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
                <button className='bg-green-400 text-white rounded-full px-6 py-2 text-sm font-semibold transition-transform transform hover:scale-105'>
                  Xem thông tin thanh toán
                </button>

              </div>
            </div>

            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-6 flex items-center'>
                <div className='flex-shrink-0 pr-3'>
                  <img src="https://blog.dktcdn.net/files/ban-hang-order.png" alt="" className='h-16 w-16 object-cover rounded' />
                </div>

              </div>
              <div className='col-span-2 flex items-center justify-center text-lg font-bold'>
                ₫{formatCurrency(purchase.totalMoney)}
              </div>
              <div className='col-span-1 flex items-center justify-center'>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${purchase.status === 'delivered' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                  {purchase.status === 'delivered' ? 'Đã giao' : 'Chưa giao'}
                </span>
              </div>
              <div className='col-span-2 flex items-center justify-center space-x-2'>
                <button onClick={() => onViewDetails(purchase)} className='bg-blue-500 text-white rounded px-4 py-2 text-sm font-semibold transition-transform transform hover:scale-105'>
                  Xem chi tiết
                </button>
                {purchase.status === 'waitForConfirmation' && (
                <button onClick={() => handleCancelOrder(purchase)} className='bg-red-500 text-white rounded px-4 py-2 text-sm font-semibold transition-transform transform hover:scale-105'>
                  Hủy đơn
                </button>
                 )}

                {purchase.status === 'waitForConfirmation' && (
                <button onClick={() => handleCancelOrder1(purchase)} className='bg-red-500 text-white rounded px-4 py-2 text-sm font-semibold transition-transform transform hover:scale-105'>
                  Xác nhận đơn hàng
                </button>
                 )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
