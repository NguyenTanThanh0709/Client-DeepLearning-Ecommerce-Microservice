import React, {useState} from 'react'
import FormPurchase from './FormPurchase'
import FormShipping from './FormShipping'
import { toast } from 'react-toastify'
import FormBasic from './FormBasic'
import FormDetail from './FormDetail'
import {  ProductRequest } from 'src/constants/contant';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import productApi from 'src/apis/product.api'
import { useParams } from 'react-router-dom';
import { Product } from 'src/types/product.type'
const initialFormData: ProductRequest = {
  id: undefined, // or a default value if needed
  images: [],
  name: '',
  description: '',
  categoryId: 0, // Default category ID (replace with a valid ID if needed)
  image: '',
  shortDescription: '',
  length: 0,
  width: 0,
  height: 0, // Consider renaming to height if needed
  weight: 0,
  price: 0,
  priceBeforeDiscount: 0,
  quantity: 0,
  sizeQuantities: [],
  idShop: parseInt(localStorage.getItem("shopId") || "0", 10),
 // Default shop ID (replace with a valid ID if needed)
};
interface SizeQuantity {
  id: number | null;
  size: string;
  color: string;
  quantity: number;
}

interface FormInputsBasic {
  images: string[];
  name: string;
  description: string;
  categoryId: number;
  image: string;
}

interface FormInputsDetail {
  shortDescription: string;
}



interface FormInputsPurchase {
  price: number;
  priceBeforeDiscount: number;
  quantity: number;
  sizeQuantities: SizeQuantity[] | null;
}

interface FormInputsShipping {
  weight: number;
  height: number;
  length: number;
  width: number;
}

export default function FormProduct() {
  const [formDataProduct, setFormDataProduct] = useState<ProductRequest>(initialFormData);
  const [formDataBasic, setFormDataBasic] = useState<FormInputsBasic>({
    images: [],
    name: '',
    description: '',
    categoryId: 0,
    image: '',
  });
  const [formDataDetail, setFormDataDetail] = useState<FormInputsDetail>({
    shortDescription: '',
  });
  const [formDataPurchase, setFormDataPurchase] = useState<FormInputsPurchase>({
    price: 0,
    priceBeforeDiscount: 0,
    quantity: 0,
    sizeQuantities: [{ id: null, size: '', color: '', quantity: 0 }],
  });
  const [formDataShipping, setFormDataShipping] = useState<FormInputsShipping>({
    weight: 0,
    height: 0,
    length: 0,
    width: 0,
  });
  const [isUpdate, setIsUpdate] = useState(false);
  const { id } = useParams(); // Lấy id từ URL
  // Sử dụng id để fetch thông tin sản phẩm hoặc thực hiện các hành động khác
// Fetch product details when id is available
const { data: productDetailData } = useQuery({
  queryKey: ['product', id],
  queryFn: () => productApi.getProductDetail(id as string),
  enabled: id !== undefined, // Fetch khi id có giá trị khác undefined
  onSuccess: (data) => {
    setIsUpdate(true); // Set to true if you're updating an existing product
    setFormDataBasic({
      images: data.data.data.images,
      name: data.data.data.name,
      description: data.data.data.description,
      categoryId: data.data.data.category.id,
      image: data.data.data.image,
    });

    setFormDataDetail({
      shortDescription: data.data.data.shortDescription,
    });

    setFormDataPurchase({
      price: data.data.data.price,
      priceBeforeDiscount: data.data.data.priceBeforeDiscount,
      quantity: data.data.data.quantity,
      sizeQuantities: data.data.data.sizeQuantities || [{ id: null, size: '', color: '', quantity: 0 }],
    });

    setFormDataShipping({
      weight: data.data.data.weight,
      height: data.data.data.height,
      length: data.data.data.length,
      width: data.data.data.width,
    });
  }
});







  const validateFormData = (data: ProductRequest) => {
    console.log(data);  
    data.idShop = parseInt(localStorage.getItem("shopId") || "0", 10);

    // Kiểm tra tên sản phẩm
    // if (!data.name || data.name.trim() === '') {
    //   console.error("Product name is required.");
    //   return false;
    // }
  
    // // Kiểm tra mô tả sản phẩm
    // if (!data.description || data.description.trim() === '') {
    //   console.error("Product description is required.");
    //   return false;
    // }
  
    // // Kiểm tra danh mục sản phẩm
    // if (data.categoryId <= 0) {
    //   console.error("Valid category ID is required.");
    //   return false;
    // }
  
    // Kiểm tra giá sản phẩm
    if (data.price <= 0) {
      console.error("Product price must be greater than 0.");
      return false;
    }
  
    // Kiểm tra giá trước khi giảm giá
    if (data.priceBeforeDiscount < 0) {
      console.error("Price before discount cannot be negative.");
      return false;
    }
  
    // Kiểm tra số lượng sản phẩm
    if (data.quantity < 0) {
      console.error("Product quantity cannot be negative.");
      return false;
    }
  
    // Kiểm tra kích thước sản phẩm
    if (data.length <= 0 || data.width <= 0 || data.height <= 0) {
      console.error("Length, width, and height must be greater than 0.");
      return false;
    }
  
    // Kiểm tra trọng lượng sản phẩm
    if (data.weight <= 0) {
      console.error("Product weight must be greater than 0.");
      return false;
    }
  
    // Kiểm tra ID shop
    if (!data.idShop) {
      console.error("Shop ID is required.");
      return false;
    }
  
    return true; // Nếu tất cả đều hợp lệ
  };
  

  // Function to handle updates to formDataProduct
  const handleFormDataChange = (newData: Partial<ProductRequest>) => {
    setFormDataProduct((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  const mutation = useMutation(productApi.addProduct, {
    onSuccess: () => {
      toast.success("Thêm sản phẩm thành công");
    },
    onError: (error) => {
      toast.error("Thêm sản phẩm không thành công");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    console.log(formDataProduct);  
    
    const isValid = validateFormData(formDataProduct);

    if (isValid) {
      // Thực hiện hành động khác như gửi dữ liệu đến API
      mutation.mutate(formDataProduct);
      

      
    } else {
      console.error("Form data is invalid");
      // Bạn có thể hiển thị thông báo lỗi hoặc thực hiện hành động khác ở đây
      toast.error('Vui lòng điền đầy đủ thông tin.');

    }
  };


  return (
    <form onSubmit={handleSubmit} className='overflow-x-auto my-2'>
    <div className='flex justify-between bg-slate-200 rounded-lg p-4'>
      <div>
        <h1 className='my-2'>THÔNG TIN SẢN PHẨM</h1>
      </div>
    </div>
    <div>
      {/* START THÔNG TIN CƠ BẢN */}
      <FormBasic  formData={formDataBasic} onFormDataChange={handleFormDataChange} isUpdate={isUpdate} idProduct = {id ? id : '0'}/>
      {/* END THÔNG TIN CƠ BẢN */}

      {/* START THÔNG TIN CHI TIẾT */}
      <FormDetail formData={formDataDetail} onFormDataChange={handleFormDataChange} isUpdate={isUpdate} idProduct =  {id ? id : '0'}/>
      {/* END THÔNG TIN CHI TIẾT */}

      {/* START THÔNG TIN BÁN HÀNG */}
      <FormPurchase formData={formDataPurchase} onFormDataChange={handleFormDataChange} isUpdate={isUpdate} idProduct =  {id ? id : '0'}/>
      {/* END THÔNG TIN BÁN HÀNG */}

      {/* START THÔNG TIN VẬN CHUYỂN */}
      <FormShipping formData={formDataShipping} onFormDataChange={handleFormDataChange} isUpdate={isUpdate} idProduct =  {id ? id : '0'}/>
      {/* END THÔNG TIN VẬN CHUYỂN */}

      {id == "0" && (
          <div className="flex justify-start ml-2">
            <button type="submit" className="bg-red-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Lưu sản phẩm
            </button>
          </div>
        )}
    </div>
  </form>
  )
}
