import React, { useState } from 'react';
import { formatCurrency, generateNameId } from 'src/utils/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import purchaseApi from 'src/apis/purchase.api';
import { OrderItemRequest, OrderRequest } from 'src/constants/contant';
import { OrderItem } from 'src/types/order.type';
import { Link } from 'react-router-dom';
import path from 'src/constants/path';
import { toast } from 'react-toastify';
import productApi from 'src/apis/product.api';
export default function DetailOrderU1() {
  const location = useLocation();
  const { purchase } = location.state as { purchase: OrderRequest };
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReviewItem, setCurrentReviewItem] = useState<OrderItem | null>(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(1);

  // Fetch order details using useQuery
  const { refetch } = useQuery(
    ['orderDetails', purchase.id],
    () => purchaseApi.getOrderDetailItem(purchase.orderItems),
    {
      onSuccess: (response) => {
        setOrderItems(response.data);
      },
      onError: (error) => {
        console.error('Failed to fetch order items:', error);
      },
    }
  );

  const mutation = useMutation({
    mutationFn: (data: { id: string; status: string }) => {
      return purchaseApi.updateOrderStatus(data.id, data.status);
    },
    onSuccess: (data) => {
      toast.success('Order status updated successfully', { autoClose: 2000 });
      refetch();
      purchase.status = 'ô'
    },
    onError: (error) => {
      toast.error('Failed to update order status', { autoClose: 2000 });
    },
  });

  const handleCancelOrder = () => {
    const orderId = purchase.id?.toString() || '0';
    const newStatus = 'cancelled';
    mutation.mutate({ id: orderId, status: newStatus });
  };

  const handleOpenModal = (item: OrderItem) => {
    setCurrentReviewItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentReviewItem(null);
    setComment('');
    setRating(1);
  };

  


  const handleSubmitReview = () => {
    const idCustomer = localStorage.getItem('id');
    if (!idCustomer) {
      toast.error('User not logged in', { autoClose: 2000 });
      return;
    }

    const data = {
      idCustomer,
      productId: currentReviewItem?.product.id || '',
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

  return (
    <div className='m-6'>
      {/* Existing code... */}

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
                className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700'
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      )}

      <h3 className='text-xl font-semibold text-gray-800 mt-8 mb-4'>Chi tiết sản phẩm</h3>
      <div className='space-y-4'>
        {orderItems.map((item) => (
          <div key={item.id} className='p-4 border rounded-lg shadow-sm bg-gray-50'>
            <div className='flex'>
              <Link
                className='h-20 w-20 flex-shrink-0 '
                to={`${path.home}${generateNameId({
                  name: item.product.name,
                  id: item.product.id.toString()
                })}`}
              >
                <img src={item.product.image} alt={item.product.name} className='w-24 h-24 object-cover rounded-lg' />
              </Link>
              <div className='ml-4 flex-grow p-6 bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300'>
                <h4 className='text-2xl font-bold text-blue-800 mb-3'>{item.product.name}</h4>
                <p className='text-base text-gray-700 mb-2'><span className='font-semibold'>Mô tả:</span> {item.product.description}</p>
                <p className='text-base text-gray-700 mb-2'><span className='font-semibold'>Danh mục:</span> {item.product.category.name}</p>
                <p className='text-lg font-semibold text-blue-600 mb-2'>Giá: ₫{formatCurrency(item.product.price)}</p>
                <p className='text-base text-gray-700 mb-2'><span className='font-semibold'>Số lượng:</span> {item.quantity}</p>
                <p className='text-base text-gray-700 mb-2'>
                  <span className='font-semibold'>Màu:</span> {item.product.sizeQuantities.find(sq => sq.id === item.idSizeQuantity)?.color || 'N/A'}
                </p>
                <p className='text-base text-gray-700 mb-2'>
                  <span className='font-semibold'>Kích cỡ:</span> {item.product.sizeQuantities.find(sq => sq.id === item.idSizeQuantity)?.size || 'N/A'}
                </p>
                {item.promotion && (
                  <p className='text-base text-red-600 mb-2'>
                    <span className='font-semibold'>Khuyến mãi:</span> {item.promotion.name} - <span className='font-bold'>Giảm giá: ₫{formatCurrency(item.promotion.discountAmount)}</span>
                  </p>
                )}
                <p className='text-base text-gray-700'>
                  <span className='font-semibold'>Ghi chú:</span> {item.note || 'Không có ghi chú'}
                </p>
              </div>
            </div>
            <div className='flex space-x-4 mt-4'>
              {item.product.images.map((img, index) => (
                <img key={index} src={img} alt={`Product image ${index + 1}`} className='w-16 h-16 object-cover rounded-lg' />
              ))}
            </div>
            {purchase.status === 'delivered' && (
              <button
                onClick={() => handleOpenModal(item)}
                className='px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none mt-4'
              >
                Đánh giá sản phẩm
              </button>
            )}

{purchase.status === 'waitForConfirmation' && (
              <button
                onClick={() => handleCancelOrder()}
                className='px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none mt-4'
              >
                Hủy đơn
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
