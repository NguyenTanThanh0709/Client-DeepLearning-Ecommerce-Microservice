import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import productApi from 'src/apis/product.api'
import purchaseApi from 'src/apis/purchase.api'
import { toast } from 'react-toastify'
import ProductRating from 'src/components/ProductRating'
import QuantityController from 'src/components/QuantityController'
import { purchasesStatus } from 'src/constants/purchase'
import { Product as ProductType, ProductListConfig } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle, getIdFromNameId, rateSale } from 'src/utils/utils'
import Product from '../ProductList/components/Product'
import path from 'src/constants/path'
import { Helmet } from 'react-helmet-async'
import { convert } from 'html-to-text'
import { Head } from 'src/components/head'
import { ProductReview } from 'src/constants/contant'

export default function ProductDetail() {
  const queryClient = useQueryClient()
  const [buyCount, setBuyCount] = useState(1)
  const { nameId } = useParams()
  const id = getIdFromNameId(nameId as string)
  const { data: productDetailData } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductDetail(id as string)
  })
  const [currentIndexImages, setCurrentIndexImages] = useState([0, 5])
  const [activeImage, setActiveImage] = useState('')
  const product = productDetailData?.data.data
  const shortDescription = product?.shortDescription.split('_') || [];

  const imageRef = useRef<HTMLImageElement>(null)
  const currentImages = useMemo(
    () => (product ? product.images.slice(...currentIndexImages) : []),
    [product, currentIndexImages]
  )
  const queryConfig: ProductListConfig = { limit: '20', page: '1', category: product?.category.id.toString() }

  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig)
    },
    staleTime: 3 * 60 * 1000,
    enabled: Boolean(product)
  })
  const idu = localStorage.getItem('id');
  const userId = idu !== null ? idu : "0";

// Define the type for the addToCart mutation payload
type AddToCartPayload = {
  idProduct: string;
  idSizeQuantity: string;
  quantity: number;
};

// Define the type for the mutation function
const addToCartMutation = useMutation<any, unknown, AddToCartPayload>(
  (data) => purchaseApi.addToCart(userId, data),
  {
    onSuccess: (data) => {
      toast.success(data.data.message, { autoClose: 1000 });
      queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] });
    },
    onError: (error) => {
      toast.error('Failed to add to cart. Please try again.', { autoClose: 1000 });
    }
  }
);

const [productList, setProductList] = useState<ProductType[]>([]);

// First mutation to get product IDs
const getProductIdsMutation = useMutation((id: string) => productApi.getProductRecommentSystem(id), {
  onSuccess: async (productIds) => {
    // Handle success of first API call
    try {
      const productIds1 = productIds.data; // Extracting the string[] from AxiosResponse
      const productsResponse = await productApi.getListProductRecommentSystem(productIds1);
      setProductList(productsResponse.data);
    } catch (error) {
      console.error('Error fetching product list:', error);
    }
  },
  onError: (error) => {
    console.error('Error fetching product IDs:', error);
  }
});

useEffect(() => {
  const id = localStorage.getItem('id');
  if (id) {
    getProductIdsMutation.mutate(id);
  }
}, []);

  
  const navigate = useNavigate()
  const [review, setReview] = useState<ProductReview[] | []>([])
  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImage(product.images[0])
    }
    const fetchReviews = async () => {
      try {
        const data = await productApi.getReview(product?.id.toString() as string);
        setReview(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    if(product){
      fetchReviews();
    }

  }, [product])

  const next = () => {
    if (currentIndexImages[1] < (product as ProductType).images.length) {
      setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }

  const prev = () => {
    if (currentIndexImages[0] > 0) {
      setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }

  const chooseActive = (img: string) => {
    setActiveImage(img)
  }

  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const image = imageRef.current as HTMLImageElement
    const { naturalHeight, naturalWidth } = image
    // Cách 1: Lấy offsetX, offsetY đơn giản khi chúng ta đã xử lý được bubble event
    // const { offsetX, offsetY } = event.nativeEvent

    // Cách 2: Lấy offsetX, offsetY khi chúng ta không xử lý được bubble event
    const offsetX = event.pageX - (rect.x + window.scrollX)
    const offsetY = event.pageY - (rect.y + window.scrollY)

    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }

  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute('style')
  }

  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }


  const [selectedSizeQuantity, setSelectedSizeQuantity] = useState<number | null>(null)
  const handleSizeQuantityChange = (sizeQuantity: number) => {
    setSelectedSizeQuantity(sizeQuantity)
  }





  const addToCart = () => {

    if(product?.sizeQuantities.length != 0){
      if(selectedSizeQuantity === null){
        toast.warning('Please select a size and quantity', { autoClose: 1000 })
        return
      }
    }


    addToCartMutation.mutate(
      { quantity: buyCount, idProduct: product?.id.toString() as string , idSizeQuantity: selectedSizeQuantity?.toString() as string},
      {
        onSuccess: (data) => {
          toast.success(data.data.message, { autoClose: 1000 })
          queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
        }
      }
    )
  }

  const buyNow = async () => {
    if(product?.sizeQuantities.length != 0){
      if(selectedSizeQuantity === null){
        toast.warning('Please select a size and quantity', { autoClose: 1000 })
        return
      }
    }


    const res = await addToCartMutation.mutateAsync({ quantity: buyCount, idProduct: product?.id.toString() as string , idSizeQuantity: selectedSizeQuantity?.toString() as string })
    const purchase = res.data.data
    navigate(path.cart, {
      state: {
        purchaseId: purchase._id
      }
    })
  }

  if (!product) return null





  return (
    <div className='bg-gray-200 py-6'>
      {/* <Helmet>
        <title>{product.name} | Shopee Clone</title>
        <meta
          name='description'
          content={convert(product.description, {
            limits: {
              maxInputLength: 150
            }
          })}
        />
      </Helmet> */}
      <Head title={product.name} description={product.description} />
      <div className='container'>
        <div className='bg-white p-4 shadow'>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5'>
              <div
                className='relative w-full cursor-zoom-in overflow-hidden pt-[100%] shadow'
                onMouseMove={handleZoom}
                onMouseLeave={handleRemoveZoom}
              >
                <img
                  src={activeImage}
                  alt={product.name}
                  className='absolute top-0 left-0 h-full w-full bg-white object-cover'
                  ref={imageRef}
                />
              </div>
              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                <button
                  className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={prev}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-5 w-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                  </svg>
                </button>
                {currentImages.map((img) => {
                  const isActive = img === activeImage
                  return (
                    <div className='relative w-full pt-[100%]' key={img} onMouseEnter={() => chooseActive(img)}>
                      <img
                        src={img}
                        alt={product.name}
                        className='absolute top-0 left-0 h-full w-full cursor-pointer bg-white object-cover'
                      />
                      {isActive && <div className='absolute inset-0 border-2 border-orange' />}
                    </div>
                  )
                })}
                <button
                  className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={next}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-5 w-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
              </div>
            </div>
            <div className='col-span-7'>
              <h1 className='text-xl font-medium uppercase'>{product.name}</h1>
              <div className='mt-8 flex items-center'>
                <div className='flex items-center'>
                  <span className='mr-1 border-b border-b-orange text-orange'>{product.rating}</span>
                  <ProductRating
                    rating={product.rating}
                    activeClassname='fill-orange text-orange h-4 w-4'
                    nonActiveClassname='fill-gray-300 text-gray-300 h-4 w-4'
                  />
                </div>
                <div className='mx-4 h-4 w-[1px] bg-gray-300'></div>
                <div>
                  <span>{formatNumberToSocialStyle(product.sold)}</span>
                  <span className='ml-1 text-gray-500'>Đã bán</span>
                </div>
              </div>
              <div className='mt-8 flex items-center bg-gray-50 px-5 py-4'>
                <div className='text-gray-500 line-through'>₫{formatCurrency(product.priceBeforeDiscount)}</div>
                <div className='ml-3 text-3xl font-medium text-orange'>₫{formatCurrency(product.price)}</div>
                <div className='ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white'>
                  {rateSale(product.priceBeforeDiscount, product.price)} giảm
                </div>
              </div>




              {product.sizeQuantities && product.sizeQuantities.length > 0 ? (
                <div className='mt-8'>
                  {product.sizeQuantities.map((sizeQuantity) => (
                    <div key={sizeQuantity.id} className='flex items-center'>
                       <input
                        type='radio'
                        name='sizeQuantity'
                        value={sizeQuantity.id}
                        checked={selectedSizeQuantity === sizeQuantity.id}
                        onChange={() => handleSizeQuantityChange(sizeQuantity.id)}
                      />
                      <div className='ml-6 text-sm text-gray-500'>Màu: {sizeQuantity.color}</div>
                      <div className='ml-6 text-sm text-gray-500'>Size: {sizeQuantity.size}</div>
                      <div className='ml-6 text-sm text-gray-500'>{sizeQuantity.quantity} sản phẩm có sẵn</div>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className='mt-8 flex items-center'>
                <div className='capitalize text-gray-500'>Số lượng</div>
                <QuantityController
                  onDecrease={handleBuyCount}
                  onIncrease={handleBuyCount}
                  onType={handleBuyCount}
                  value={buyCount}
                  max={product.quantity}
                />
                <div className='ml-6 text-sm text-gray-500'>{product.quantity} sản phẩm có sẵn</div>
              </div>







              <div className='mt-8 flex items-center'>
                <button
                  onClick={addToCart}
                  className='flex h-12 items-center justify-center rounded-sm border border-orange bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-orange/5'
                >
                  <svg
                    enableBackground='new 0 0 15 15'
                    viewBox='0 0 15 15'
                    x={0}
                    y={0}
                    className='mr-[10px] h-5 w-5 fill-current stroke-orange text-orange'
                  >
                    <g>
                      <g>
                        <polyline
                          fill='none'
                          points='.5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeMiterlimit={10}
                        />
                        <circle cx={6} cy='13.5' r={1} stroke='none' />
                        <circle cx='11.5' cy='13.5' r={1} stroke='none' />
                      </g>
                      <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1='7.5' x2='10.5' y1={7} y2={7} />
                      <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1={9} x2={9} y1='8.5' y2='5.5' />
                    </g>
                  </svg>
                  Thêm vào giỏ hàng
                </button>
                <button
                  onClick={buyNow}
                  className='fkex ml-4 h-12 min-w-[5rem] items-center justify-center rounded-sm bg-orange px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90'
                >
                  Mua ngay
                </button>
              </div>
              <div>



              <div className="bg-gradient-to-b from-gray-100 to-gray-300 py-6">
  <div className="container">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="rounded-t-lg bg-orange-100 p-4 text-lg font-semibold text-orange-700 capitalize">Thông tin sản phẩm</div>
      <div className="mx-4 mt-6 mb-4 text-sm leading-loose">
        <div className="grid grid-cols-2 gap-6">
          {[
            { label: 'Thương hiệu', value: shortDescription[0] || 'N/A' },
            { label: 'Nhà sản xuất', value: shortDescription[1] || 'N/A' },
            { label: 'Chất liệu', value: shortDescription[2] || 'N/A' },
            { label: 'Thành phần', value: shortDescription[3] || 'N/A' },
            { label: 'Địa chỉ sản xuất', value: shortDescription[4] || 'N/A' },
            { label: 'Ngày sản xuất', value: shortDescription[5] || 'N/A' },
            { label: 'Ngày hết hạn', value: shortDescription[6] || 'N/A' },
            { label: 'Thông tin bảo hành', value: shortDescription[7] || 'N/A' },
          ].map((item, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg shadow-sm transition-transform transform hover:scale-105">
              <strong className="text-gray-800">{item.label}:</strong> 
              <span className="text-gray-600"> {item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</div>


                
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-8'>
        <div className='container'>
          <div className=' bg-white p-4 shadow'>
            <div className='rounded bg-gray-50 p-4 text-lg capitalize text-slate-700'>Mô tả sản phẩm</div>
            <div className='mx-4 mt-12 mb-4 text-sm leading-loose'>
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(product.description)
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className='mt-8'>
        <div className='container'>
          <div className='uppercase text-gray-400'>CÓ THỂ BẠN CŨNG THÍCH</div>
          {productList && (
            <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
              {productList.map((product) => (
                <div className='col-span-1' key={product.id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='container'>
          <div className='uppercase text-gray-400'>Review sản phẩm</div>
          {review.length === 0 ? (
                <p className="text-gray-500">Chưa có đánh giá nào.</p>
            ) : (
                <ul className="space-y-4">
                    {review.map((review1) => (
                        <li key={review1.id} className="border p-4 rounded-lg shadow">
                            <div className="flex justify-between mb-2">
                                <div className="font-bold">Khách hàng ID: {review1.idCustomer}</div>
                                <div className="text-yellow-500">{`⭐️ ${review1.rating}`}</div>
                            </div>
                            <p className="text-gray-700">{review1.comment}</p>
                            <p className="text-gray-500 text-sm">{new Date(review1.createdAt).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
      </div>
    </div>
  )
}
