import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket } from '@fortawesome/free-solid-svg-icons';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import userApi from 'src/apis/user.api';
import { Purchase } from 'src/types/purchase.type';
import { useState, useEffect } from 'react';
import { OrderItemRequest, OrderRequest } from 'src/constants/contant';
import { Promotion } from 'src/types/product.type';
import { toast } from 'react-toastify';
import productApi from 'src/apis/product.api';
import purchaseApi from 'src/apis/purchase.api';
import { useNavigate } from 'react-router-dom';

interface MomoPaymentResponse {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  responseTime: number;
  message: string;
  resultCode: number;
  payUrl: string;
  shortLink: string;
}

export default function Payment() {
  const navigate = useNavigate();

  const location = useLocation();
  const { checkedPurchases } = location.state;
  // console.log(checkedPurchases);

  const id = localStorage.getItem('id');
  const userId = id !== null ? parseInt(id) : 0;

  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => userApi.getProfile(userId),
    enabled: !!userId
  });
  
  const profile = profileData?.data.data;
  // console.log(profile);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const[totalmoneyProduct, setTotalMoneyProduct] = useState<number>(0);
  const[totalmoneyShipping, setTotalMoneyShipping] = useState<number>(10000);
  const[totalmoney, setTotalMoney] = useState<number>(0);
  const [notes, setNotes] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    let productTotal = 0;
    checkedPurchases.forEach((purchase: Purchase) => {
      productTotal += purchase.price * purchase.buy_count;
    });
    setTotalMoneyProduct(productTotal);
    setTotalMoney(productTotal + totalmoneyShipping);
  }, [checkedPurchases, totalmoneyShipping]);


  const handleNoteChange = (index: number, note: string) => {
    setNotes(prevNotes => ({ ...prevNotes, [index]: note }));
  };

  
  const createOrderData = (): OrderRequest => {
    const orderItems: OrderItemRequest[] = checkedPurchases.map((purchase: Purchase,  index: number) => ({
      id: null,
      productId: purchase.product.id,
      idSizeQuantity: purchase.id_size_quantity_color, // assuming this field holds the size quantity ID
      promotionId: appliedPromotions[purchase.product.id] || 0, // cho phép null nếu là các sản phẩm k có promotion
      quantity: purchase.buy_count,
      note: notes[index] || '' // include the note for each item
    }));

    return {
      id: null, // generate or provide a valid order ID
      customerId: userId,
      shopId: checkedPurchases[0].product.idShop, // provide the correct shop ID
      totalMoney: totalmoney,
      status: 'waitForConfirmation', // initial order status
      orderItems: orderItems,
      orderDate: new Date().toISOString() // current date and time
    };
  };


  const mutationmomo = useMutation<MomoPaymentResponse, any, { id: string; totalMoney: number }>(
    purchaseApi.paymentMomo, 
    {
      onSuccess: (data) => {
        toast.success('Thanh toán MoMo bắt đầu');
        console.log('Payment URL:', data.payUrl);
        window.location.href = data.payUrl; 
      },
      onError: (error) => {
        toast.error('Thanh toán MoMo không thành công');
        console.error('Error:', error);
      },
    }
  );

  const mutation = useMutation(purchaseApi.addOrder, {
    onSuccess: (data:string) => {
      toast.success("Đặt Hàng sản phẩm thành công");  
      // thực hiện call api tiếp trong này có được không
          // Submit the orderData to your backend or handle it as needed
      if(paymentMethod == 'cod'){
        toast.success("Thanh toán sản phẩm khi nhận hàng")
        navigate('/user/purchase');
      }else{

        const paymentData = { id: data, totalMoney: totalmoney }; // Thay thế bằng dữ liệu thực tế
        console.log('Payment Data:', paymentData);
        mutationmomo.mutate(paymentData);

      }
    },
    onError: (error) => {
      toast.error("Đặt Hàng sản phẩm không thành công");
    }
  });

  const handleOrderSubmit = () => {

    const orderData = createOrderData();
    console.log('Order Data:', orderData);
    if(profile?.city == null || profile?.district == null || profile?.ward == null){
      toast.warning("Vui lòng cập nhật địa chỉ của bạn trước khi đặt hàng")
      return
    }
    if(profile?.city == '' || profile?.district == '' || profile?.ward == ''){
      toast.warning("Vui lòng cập nhật địa chỉ của bạn trước khi đặt hàng")
      return
    }
    mutation.mutate(orderData);

  };


  const [showModal, setShowModal] = useState<boolean>(false);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const handleVoucherClick = async (idproduct: string) => {
    if(appliedPromotions[Number(idproduct)] !== undefined){
      toast.warning("Chỉ áp dụng 1 lần!")
      return
    }
    setSelectedProductId(parseInt(idproduct));
    try {

        // Update existing promotion
        const data = await productApi.getPromotionByProductActive(idproduct);
        console.log(data);
        setPromotions(data);
        toast.success('Hãy chọn khuyến mãi bạn mong muốn!');

    } catch (error) {
      console.error('Error saving promotion:', error);
      toast.error('Có lỗi xảy ra với chương trình khuyến mãi.');
    }
    setShowModal(true);

  };
  const handleAppCode = (id: number, productId: number) => {
    const promotion = promotions.find(promotion => promotion.id === id);
  
    if (promotion) {
      // Apply the discount to the total money
      setTotalMoney(prevTotalMoney => prevTotalMoney - promotion.discountAmount);
      setAppliedPromotions(prev => ({ ...prev, [productId]: promotion.id })); // Store the applied promotion
      toast.success(`Áp dụng khuyến mãi: ${promotion.name}, giảm ${promotion.discountAmount}đ!`);
    } else {
      // Handle case where the promotion is not found
      toast.error("Khuyến mãi không hợp lệ.");
    }
    setShowModal(false);
  };
  
  const [appliedPromotions, setAppliedPromotions] = useState<{ [key: number]: number | null }>({});
  const [selectedProductId, setSelectedProductId] = useState<number | 0>(0);

  return (
<div className='bg-gray-100 py-16'>

      <div className='container mx-auto px-4'>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <div className='flex items-center mb-4'>
            <FontAwesomeIcon className='text-red-500 mr-2' icon={faLocationDot} />
            <span className='text-red-500 text-xl font-semibold'>Địa chỉ nhận hàng</span>
          </div>
          <div className='mb-4'>
            <div className='text-lg font-bold'>{profile?.email}</div>
            <div className='text-lg font-bold'>{profile?.phone}</div>
          </div>
          <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-9'>
              <div className='flex flex-wrap'>
                <p className='text-lg mx-2'>Tỉnh {profile?.city} -</p>
                <p className='text-lg mx-2'>Huyện {profile?.district} -</p>
                <p className='text-lg mx-2'>Xã {profile?.ward} -</p>
                <p className='text-lg mx-2'>Địa điểm {profile?.detailLocation}</p>
              </div>
            </div>
            <div className='col-span-3 flex justify-end'>
              <p className='p-2 border border-amber-500 text-amber-500 rounded'>Mặc định</p>
            </div>
          </div>
        </div>
      </div>


      <div className='m-14'>
      {checkedPurchases.map((product: Purchase, index: number) => (
          <div key={index} className='p-2 mt-4 text-lg' style={{ background: '#fff' }}>

            <div className="grid grid-cols-9 flex " >
              <div className="col-span-6">Sản Phẩm</div>
              <div className="col-span-1">Đơn giá</div>
              <div className="col-span-1">Số lượng</div>
              <div className="col-span-1">Thành tiền</div>
            </div>

            <div className='mt-2 font-black text-lg text-red-500'>
              <p>Sản phẩm yêu thích</p>
            </div>

            <div className="grid grid-cols-9 flex " >
              <div className="col-span-6 flex items-center">
                <img className="Yzo0tI" alt="product image" src={product.product.image} width="40" height="40" />
                <p>{product.product.name}</p>

              </div>
              <div className="col-span-1">{product.price}</div>
              <div className="col-span-1">{product.buy_count}</div>
              <div className="col-span-1">{product.price * product.buy_count}</div>
            </div>

            <div className='grid grid-cols-2 flex mt-4 pt-4' style={{ borderTop: '1px solid black' }}>
              <div className='col-span-1 flex justify-between'>
                {/* <p>Màu sản phẩm: {product.color} - Size sản phẩm(mã-tên): {product.size}</p> */}
                <p className=' text-green-500'>Yêu cầu ngay</p>
              </div>
              <div className='col-span-1 mx-2 flex justify-between'>
                <div> <FontAwesomeIcon icon={faTicket} className='text-red-500'/> Voucher của Shop</div>
                <div className='text-red-300 '>Số tiền giảm của shop</div>
                <button className='text-green-300 cursor-pointer' 
                 onClick={() => handleVoucherClick(product.product.id.toString())} 
 
                
                > Chọn Voucher</button>

              </div>

            </div>

            <div className='grid grid-cols-2 flex mt-4 pt-4' style={{ borderTop: '1px solid black' }}>
              <div className='col-span-1 flex justify-between'>
                <span>lời nhắn:</span>
                <input
                  type="text"
                  style={{ width: '620px' }}
                  className='border'
                  value={notes[index] || ''}
                  onChange={(e) => handleNoteChange(index, e.target.value)}
                  placeholder="Lời Nhắn cho shop"
                />
              </div>
              <div className='col-span-1 mx-2 flex justify-between' >
                <span>Đơn vị vẩn chuyển:</span>
                <span>SHIPPING BỞI SHOP</span>
                <span>Chọn phương thức vận chuyển để xem phí</span>
              </div>

            </div>


          </div>
        ))}
      

      </div>

      <div className='m-14'>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-bold mb-4'>Chọn phương thức thanh toán</h2>
            <div className='flex items-center mb-4'>
              <img src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/paymentfe/cb78f1ca161d1694.png" alt="COD" className='w-12 h-12 mr-2' />
              <input
                type="radio"
                id="cod"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value as 'cod' | 'online')}
                className='mr-2'
              />
              <label htmlFor="cod" className='text-lg'>Thanh toán khi nhận hàng</label>
            </div>
            <div className='flex items-center'>
              <img src="https://www.pngall.com/wp-content/uploads/5/Online-Payment-Transparent.png" alt="Online Payment" className='w-12 h-12 mr-2' />
              <input
                type="radio"
                id="online"
                name="paymentMethod"
                value="online"
                checked={paymentMethod === 'online'}
                onChange={(e) => setPaymentMethod(e.target.value as 'cod' | 'online')}
                className='mr-2'
              />
              <label htmlFor="online" className='text-lg'>Thanh toán online</label>
            </div>
          </div>
      </div>


      <div className='p-2 mx-14 text-lg bg-white rounded-lg shadow-md'>
          <div className='mt-4'>Tổng Tiền Hàng: {totalmoneyProduct}₫</div>
          <div className='mt-4'>Tổng Shipping: {totalmoneyShipping}₫</div>
          <div className='mt-4'>Tổng Thanh Toán: {totalmoney}₫</div>
          <div className='flex justify-end mt-4'>
            <button onClick={handleOrderSubmit} className='bg-red-500 text-white font-bold py-2 px-4 rounded'>
              Đặt Hàng
            </button>
          </div>
        </div>






        {showModal && (
  <div className='fixed top-1/4 left-0 w-full   bg-opacity-75 flex items-center justify-center'>
    <div className='bg-red-200 p-6 rounded-lg shadow-lg w-11/12 md:w-1/2'>
      <h2 className='text-xl font-bold mb-4 text-center'>Chọn Voucher</h2>
      <div className='my-2 space-y-4'>
        {promotions && promotions.map((promotion) => (
          <div key={promotion.id} className='p-4 bg-slate-100 rounded-lg shadow hover:bg-slate-200 transition duration-200'>
            <p className='font-semibold text-lg'>{promotion.name}</p>
            <p className='text-gray-600'>{promotion.description}</p>
            <p className='text-sm text-gray-500'>Hạn sử dụng: {new Date(promotion.endDate).toLocaleDateString()}</p>
            <p className='font-bold text-lg text-green-600'>Số tiền giảm: {promotion.discountAmount}đ</p>
            <button 
              onClick={() => handleAppCode(promotion.id, selectedProductId )} 
              type='button' 
              className={`mt-2 ${appliedPromotions[selectedProductId] ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500'} text-white font-bold py-2 px-4 rounded transition duration-200 hover:bg-green-600`}
              disabled={appliedPromotions[selectedProductId] !== undefined} // Disable if already applied
            >
              {appliedPromotions[selectedProductId] ? 'Đã áp dụng' : 'Áp dụng'}
            </button>

          </div>
        ))}
      </div>
      <button className='mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded w-full transition duration-200 hover:bg-red-600' onClick={() => setShowModal(false)}>
        Đóng
      </button>
    </div>
  </div>
)}



</div>
  );
}
