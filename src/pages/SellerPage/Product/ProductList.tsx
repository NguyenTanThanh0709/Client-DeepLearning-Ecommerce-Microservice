import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from 'src/utils/utils';
import { useQuery, useMutation } from '@tanstack/react-query';
import productApi from 'src/apis/product.api';
import classNames from 'classnames';
import { productStatus } from 'src/constants/productList';
import path from 'src/constants/path';
import { createSearchParams, Link } from 'react-router-dom';
import useQueryParams from 'src/hooks/useQueryParams';
import { Product } from 'src/types/product.type';
import { toast } from 'react-toastify';

const productTabs = [
  { status: productStatus.all, name: 'Tất cả' },
  { status: productStatus.active, name: 'Hoạt động' },
  { status: productStatus.inactive, name: 'Ẩn' },
  { status: productStatus.baned, name: 'Vi phạm' },
];

export default function ProductList() {
  const queryParams: { status?: string } = useQueryParams();
  const status = Number(queryParams.status) || productStatus.all;
  const navigate = useNavigate();

  const productTabsLink = productTabs.map((tab) => (
    <Link
      key={tab.status}
      to={{
        pathname: path.productlist,
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

  const id = localStorage.getItem('shopId');
  const idShop = id !== null ? id : '0';

  const { data: products, isLoading, error, refetch } = useQuery<Product[], Error>(
    ['products', idShop],
    () => productApi.getProductByIdShop(idShop)
  );

  // Mutation để cập nhật trạng thái sản phẩm
  const mutation = useMutation(
    ({ id, isPublic }: { id: string; isPublic: boolean }) => {
      const status = isPublic ? 0 : 1; // 0: ẩn, 1: hiện
      return productApi.updateStatusProduct(id, status);
    },
    {
      onSuccess: () => {
        toast.success('Cập nhật trạng thái thành công!');
        refetch();
      },
      onError: (error) => {
        toast.error('Cập nhật trạng thái thất bại!');
      },
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading products:</div>;
  }

  // Hàm xử lý chuyển trang và trạng thái công khai
  const handleToggleVisibility = (id: string, isPublic: boolean) => {
    mutation.mutate({ id, isPublic });
  };

  return (
    <div className='m-4'>
      <div className='flex justify-between bg-slate-200 rounded-lg p-4'>
        <div>
          <h1 className='my-2'>SẢN PHẨM</h1>
        </div>
        <div>
          <button className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 mx-2 px-4 rounded">
            Công cụ xử lý hàng loạt
          </button>
          <button onClick={() => navigate('/seller/product/0')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 mx-2 px-4 rounded">
            + Thêm sản phẩm
          </button>
        </div>
      </div>
      <div className='overflow-x-auto my-2'>
        <div className='min-w-[700px]'>
          <div className='sticky top-0 flex rounded-t-sm shadow-sm'>{productTabsLink}</div>
          <div className='grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow'>
            <div className='col-span-6'>
              <div className='flex items-center'>
                <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                  <input
                    type='checkbox'
                    className='h-5 w-5 accent-orange'
                    // checked={isAllChecked}
                    // onChange={handleCheckAll}
                  />
                </div>
                <div className='flex-grow text-black'>Sản phẩm</div>
              </div>
            </div>
            <div className='col-span-6'>
              <div className='grid grid-cols-5 text-center'>
                <div className='col-span-2'>Đơn giá</div>
                <div className='col-span-1'>Số lượng</div>
                <div className='col-span-1'>Trạng thái</div>
                <div className='col-span-1'>Thao tác</div>
              </div>
            </div>
          </div>

          {/* DANH SÁCH SẢN PHẨM */}
          {products?.map((product) => (
            <div key={product.id} className='mb-5 grid grid-cols-12 items-center rounded-sm border border-gray-200 bg-white py-5 px-4 text-center text-sm text-gray-500 first:mt-0'>
              <div className='col-span-6'>
                <div className='flex'>
                  <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                    <input
                      type='checkbox'
                      className='h-5 w-5 accent-orange'
                    />
                  </div>
                  <div className='flex-grow'>
                    <div className='flex'>
                      <div className='h-20 w-20 flex-shrink-0'>
                        <img alt={product.name} src={product.image} />
                      </div>
                      <div className='flex-grow px-2 pt-1 pb-2'>
                        <div className='text-left line-clamp-2'>
                          {product.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-span-6'>
                <div className='grid grid-cols-5 items-center'>
                  <div className='col-span-2'>
                    <div className='flex items-center justify-center'>
                      <span className='text-gray-300 line-through'>
                        ₫{formatCurrency(product.price)}
                      </span>
                      <span className='ml-3'>₫{formatCurrency(product.priceBeforeDiscount)}</span>
                    </div>
                  </div>
                  <div className='col-span-1'>
                    <div>{product.quantity}</div>
                  </div>
                  <div className='col-span-1'>
                    <span className='text-orange'>
                      {product.public ? 'Hiện' : 'Ẩn'}
                    </span>
                  </div>
                  <div className='col-span-1'>
                    <button
                      onClick={() => handleToggleVisibility(product.id.toString(), product.public)}
                      className='text-black transition-colors m-2 hover:text-orange'
                    >
                      {product.public ? 'Ẩn' : 'Hiện'}
                    </button>
                    <button
                      onClick={() => navigate(`/seller/product/${product.id}`)}
                      className='text-black transition-colors m-2 hover:text-slate-300'
                    >
                      Chỉnh sửa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* END DANH SÁCH SẢN PHẨM */}
        </div>
      </div>
    </div>
  );
}
