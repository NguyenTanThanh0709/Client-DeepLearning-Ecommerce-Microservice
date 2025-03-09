import React , {useEffect}from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ProductRequest } from 'src/constants/contant';
import productApi from 'src/apis/product.api';
import { toast } from 'react-toastify';


interface FormBasicProps {
  formData: FormData;
  onFormDataChange: (newData: Partial<ProductRequest>) => void;
  isUpdate: boolean;
  idProduct: string;

}
interface FormInputs {
  brand: string;
  manufacturer: string;
  material: string;
  ingredients: string;
  productionAddress: string;
  productionDate: string;
  expirationDate: string;
  warrantyInfo: string;
}

interface FormData {
  shortDescription: string;
}

const FormDetail: React.FC<FormBasicProps> = ({ formData, onFormDataChange, isUpdate , idProduct}) => {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormInputs>();
  const formValues = watch();

 // Hàm xử lý lưu dữ liệu
 const handleSave = () => {
  const concatenatedData = Object.values(formValues).join('_');
  const formData: FormData = {
    shortDescription: concatenatedData,
  };

  onFormDataChange(formData); // Gọi hàm onFormDataChange với dữ liệu mới
};

const handleUpdate = async (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault(); // Ngăn chặn hành vi submit của form
  const concatenatedData = Object.values(formValues).join('_');
  const formData: FormData = {
    shortDescription: concatenatedData,
  };
  console.log(formData);
  try {
    await productApi.updateProductDetail(idProduct, formData);
    toast.success('Product updated successfully!');
  } catch (error) {
    console.error('Error updating product:', error);
    toast.error('Error updating product.');
  }


};


// Populate form fields when isUpdate is true
useEffect(() => {
  if (isUpdate) {
    let formList = formData.shortDescription.split('_');
    setValue('brand', formList[0]);
    setValue('manufacturer', formList[1]);
    setValue('material', formList[2]);
    setValue('ingredients', formList[3]);
    setValue('productionAddress', formList[4]);
    setValue('productionDate', formList[5]);
    setValue('expirationDate', formList[6]);
    setValue('warrantyInfo', formList[7]);
  }
}, [isUpdate, formData, setValue]);

  return (
    <div className="m-2 p-2 border-spacing-44 border-red-300 border">
      <h1>THÔNG TIN CHI TIẾT</h1>
      <div>
        <form  className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">THƯƠNG HIỆU</label>
            <input
              type="text"
              {...register('brand', { required: true })}
              defaultValue="Thương hiệu ..."

              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.brand && <span className="text-red-500">This field is required</span>}
          </div>

          <div>
            <label className="block text-gray-700">NHÀ SẢN XUẤT</label>
            <input
              type="text"
              {...register('manufacturer', { required: true })}
              defaultValue="Nhà sản xuất ..."

              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.manufacturer && <span className="text-red-500">This field is required</span>}
          </div>

          <div>
            <label className="block text-gray-700">CHẤT LIỆU</label>
            <input
              type="text"
              {...register('material', { required: true })}
              defaultValue="Chất liệu ..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.material && <span className="text-red-500">This field is required</span>}
          </div>

          <div>
            <label className="block text-gray-700">THÀNH PHẦN</label>
            <input
              type="text"
              {...register('ingredients', { required: true })}
              defaultValue="Thành phần ..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.ingredients && <span className="text-red-500">This field is required</span>}
          </div>

          <div>
            <label className="block text-gray-700">ĐỊA CHỈ CHỊU TRÁCH NHIỆM SẢN XUẤT</label>
            <input
              type="text"
              {...register('productionAddress', { required: true })}
              defaultValue="Địa chỉ chịu trách nhiệm sản xuất ..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.productionAddress && <span className="text-red-500">This field is required</span>}
          </div>

          <div>
            <label className="block text-gray-700">NGÀY SẢN XUẤT</label>
            <input
              type="date"
              {...register('productionDate', { required: true })}
              defaultValue={new Date().toISOString().split('T')[0]}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.productionDate && <span className="text-red-500">This field is required</span>}
          </div>

          <div>
            <label className="block text-gray-700">HẠN SỬ DỤNG</label>
            <input
              type="date"
              {...register('expirationDate', { required: true })}
              defaultValue={new Date().toISOString().split('T')[0]}

              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.expirationDate && <span className="text-red-500">This field is required</span>}
          </div>

          <div>
            <label className="block text-gray-700">THÔNG TIN BẢO HÀNH</label>
            <input
              type="text"
              {...register('warrantyInfo', { required: true })}
              defaultValue="Thông tin bảo hành ..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.warrantyInfo && <span className="text-red-500">This field is required</span>}
          </div>

          <div className="md:col-span-2 flex justify-end">
          {!isUpdate ? (
            <button type="button" onClick={handleSave} className="bg-blue-500 hover:bg-orange-700 text-orange font-bold py-2 px-4 rounded">
              Ấn Lưu trước khi chuyển
            </button>
          ) : (
            <button type="button" onClick={handleUpdate} className="bg-green-500 hover:bg-green-700 text-orange font-bold py-2 px-4 rounded">
              Cập nhật sản phẩm
            </button>
          )}
          </div>
        </form>
      </div>
    </div>
  );
}
export default FormDetail;