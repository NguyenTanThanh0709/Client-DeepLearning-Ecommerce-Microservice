import React ,{useEffect}from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import productApi from 'src/apis/product.api';
import { ProductRequest } from 'src/constants/contant';

interface FormBasicProps {
  formData: FormInputs;
  onFormDataChange: (newData: Partial<ProductRequest>) => void;
  isUpdate: boolean;
  idProduct: string;

}
interface SizeQuantity {
  id: number | null;
  size: string;
  color: string;
  quantity: number;
}

interface FormInputs {
  price: number;
  priceBeforeDiscount: number;
  quantity: number;
  sizeQuantities: SizeQuantity[] | null;
}

const FormPurchase: React.FC<FormBasicProps> = ({ formData, onFormDataChange, isUpdate, idProduct }) => {
  const { register, control, handleSubmit, watch, formState: { errors }, setValue } = useForm<FormInputs>({
    defaultValues: {
      sizeQuantities: [{ id: null, size: '', color: '', quantity: 0 }],
      quantity: 0,
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sizeQuantities'
  });

  const sizeQuantities = watch('sizeQuantities');
  const hasSize = sizeQuantities && sizeQuantities.length > 0;

  const handleSave = () => {
    const data = watch(); // Lấy dữ liệu từ form
    if (hasSize) {
      // Tính tổng số lượng từ sizeQuantities
      data.quantity = sizeQuantities.reduce((total, item) => total + Number(item.quantity), 0);
    } else {
      data.sizeQuantities = []; // Đặt thành một mảng rỗng nếu không có size
    }
    onFormDataChange(data as Partial<ProductRequest>); // Cast về Partial<ProductRequest>
  };
// Populate form fields when isUpdate is true
useEffect(() => {
  if (isUpdate) {
    setValue('price', formData.price);
    setValue('priceBeforeDiscount', formData.priceBeforeDiscount);
    setValue('quantity', formData.quantity);
    
    if (formData.sizeQuantities) {
      // Clear existing fields and set the new values
      remove(); // Remove existing size quantities
      formData.sizeQuantities.forEach(sizeQuantity => {
        append(sizeQuantity); // Append each size quantity to the field array
      });
    } else {
      remove(); // If no sizeQuantities, ensure it's empty
    }
  }
}, [isUpdate, formData, setValue, append, remove]);


const handleUpdate = async (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault(); // Ngăn chặn hành vi submit của form
  const data = watch(); // Lấy dữ liệu từ form
  if (hasSize) {
    // Tính tổng số lượng từ sizeQuantities
    data.quantity = sizeQuantities.reduce((total, item) => total + Number(item.quantity), 0);
  } else {
    data.sizeQuantities = []; // Đặt thành một mảng rỗng nếu không có size
  }
  console.log(data);
  try {
    await productApi.updateProductSell(idProduct, data);
    toast.success('Product updated successfully!');
  } catch (error) {
    console.error('Error updating product:', error);
    toast.error('Error updating product.');
  }

};



const handleRemove = async (index: number, id: number | null) => {
  console.log('remove sizeQuantity with id:', id);
  if (id) {
    try {
      await productApi.deleteSizeQuantity(id); // Call API to delete SizeQuantity by ID
      toast.success('SizeQuantity removed successfully!');
    } catch (error) {
      toast.error('Error removing SizeQuantity.');
    }
  }
  remove(index); // Remove from the form array
};

  return (
    <div className="m-2 p-2 border-spacing-44 border-red-300 border">
      <h1>THÔNG TIN BÁN HÀNG</h1>

      <div>
        <form  className="p-4 space-y-4">
          <div>
            <label className="block text-gray-700">Giá</label>
            <input
              type="number"
              {...register('price', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.price && <span className="text-red-500">This field is required</span>}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Sản phẩm có size?</label>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={hasSize ? true : false}
                onChange={() => {
                  if (hasSize) {
                    remove();
                  } else {
                    append({ id: Date.now(), size: '', color: '', quantity: 0 });
                  }
                }}
                className="mr-2"
              />
              <span>Có</span>
            </div>
          </div>

          {hasSize ? (
            <div>
              <label className="block text-gray-700 mb-2">Thông tin Size, Màu và Số lượng</label>
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                  <div>
                    <label className="block text-gray-700">Size</label>
                    <input
                      type="text"
                      {...register(`sizeQuantities.${index}.size`, { required: true })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                    {errors.sizeQuantities?.[index]?.size && <span className="text-red-500">This field is required</span>}
                  </div>

                  <div>
                    <label className="block text-gray-700">Màu</label>
                    <input
                      type="text"
                      {...register(`sizeQuantities.${index}.color`, { required: true })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                    {errors.sizeQuantities?.[index]?.color && <span className="text-red-500">This field is required</span>}
                  </div>

                  <div>
                    <label className="block text-gray-700">Số lượng</label>
                    <input
                      type="number"
                      {...register(`sizeQuantities.${index}.quantity`, { required: true, min: 1 })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                    {errors.sizeQuantities?.[index]?.quantity && <span className="text-red-500">This field is required</span>}
                  </div>

                  <div className="md:col-span-3 flex justify-end">
                    <button type="button"onClick={() => handleRemove(index,sizeQuantities?.[index]?.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => append({ id: null, size: '', color: '', quantity: 0 })}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add Size
              </button>
            </div>
          ) : (
            <div>
              <label className="block text-gray-700">Số lượng</label>
              <input
                type="number"
                {...register('quantity', { required: true, min: 1 })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              {errors.quantity && <span className="text-red-500">This field is required</span>}
            </div>
          )}

          <div className="flex justify-end">
          {!isUpdate ? (
            <button type="button" onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Ấn Lưu trước khi chuyển
            </button>
          ) : (
            <button type="button" onClick={handleUpdate} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Cập nhật sản phẩm
            </button>
          )}
          </div>
        </form>
      </div>
    </div>
  );
}
export default FormPurchase;