import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import productApi from 'src/apis/product.api';
import { Product } from 'src/types/product.type';
import { PromotionRequest } from 'src/constants/contant';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';




const Promotion: React.FC = () => {
  const [programName, setProgramName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState(true);
  const [discountAmount, setDiscountAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  
  const id = localStorage.getItem('shopId');
  const idShop = id !== null ? id : '0';
  
  const { data: products, isLoading, error, refetch } = useQuery<Product[], Error>(
    ['products', idShop],
    () => productApi.getProductByIdShop(idShop)
  );
  
  
  const mutation = useMutation(productApi.addPromotion, {
    onSuccess: () => {
      toast.success("Thêm khuyến mãi thành công");
    },
    onError: (error) => {
      toast.error("Thêm khuyến mãi không thành công");
    }
  });
  
  const [isUpdate, setIsUpdate] = useState(false);
  const { promotionId } = useParams<{ promotionId: string }>();
const promotionId1 = promotionId ?? ''; // Use an empty string if promotionId is undefined


  const { data: promotion } = useQuery({
    queryKey: ['promotion', promotionId1],
    queryFn: () => productApi.getPromotion(promotionId1 as string),
    enabled: promotionId1 !== undefined, // Fetch khi id có giá trị khác undefined
    onSuccess: (data) => {
      setIsUpdate(true); // Set to true if you're updating an existing product
      setProgramName(data.data.name);
      setStartDate(new Date(data.data.startDate).toISOString().split('T')[0]);
      setEndDate(new Date(data.data.endDate).toISOString().split('T')[0]);
      setCode(data.data.code);
      setStatus(data.data.status === 'active');
      setDiscountAmount(data.data.discountAmount.toString());
      setDescription(data.data.description);
      let selectedProducts = data.data.products.map(product => product.id.toString());
      setSelectedProducts(selectedProducts);
  
    }
  });
  
  
  

  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const promotionData: PromotionRequest = {
      id: null,
      name: programName,
      startDate,
      endDate,
      code,
      status: status ? 'active' : 'inactive',
      description,
      discountAmount: Number(discountAmount),
      idShop: Number(idShop),
      idProducts: selectedProducts,
  };

  console.log(promotionData);

  if(selectedProducts.length === 0) {
    toast.error("Vui lòng chọn sản phẩm");
    return;
  }
  try {
    if (isUpdate) {
      // Update existing promotion
      await productApi.updatePromotion(promotionId1, promotionData);
      toast.success('Cập nhật khuyến mãi thành công!');
    } else {
      // Add new promotion
      mutation.mutate(promotionData);
    }
  } catch (error) {
    console.error('Error saving promotion:', error);
    toast.error('Có lỗi xảy ra khi lưu khuyến mãi.');
  }


}

  // Function to handle product checkbox selection
  const handleProductSelect = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="programName" className="block text-sm font-medium text-gray-700">
            Tên chương trình
          </label>
          <input
            type="text"
            id="programName"
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Ngày bắt đầu
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            Ngày kết thúc
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            Mã (Code)
          </label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="discountAmount" className="block text-sm font-medium text-gray-700">
            Số tiền giảm
          </label>
          <input
            type="number"
            id="discountAmount"
            value={discountAmount}
            onChange={(e) => setDiscountAmount(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Mô tả chương trình
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            List sản phẩm áp dụng
          </label>
          <div className="mt-2 space-y-2">
            {products?.map(product => (
              <div key={product.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`product_${product.id}`}
                  checked={selectedProducts.includes(product.id.toString())}
                  onChange={() => handleProductSelect(product.id.toString())}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <div className="ml-2 flex items-center">
                  <img src={product.image} alt={product.name} className="h-10 w-10 object-cover rounded-full" />
                  <label htmlFor={`product_${product.id}`} className="ml-2 text-sm text-gray-700">
                    {product.name}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
};

export default Promotion;
