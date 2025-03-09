import React, {useEffect} from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import productApi from 'src/apis/product.api';
import { ProductRequest } from 'src/constants/contant';

interface FormBasicProps {
  formData: FormInputs;
  onFormDataChange: (newData: Partial<ProductRequest>) => void;
  isUpdate: boolean;
  idProduct: string

}

interface FormInputs {
  weight: number;
  height: number;
  length: number;
  width: number;
}

const FormShipping: React.FC<FormBasicProps> = ({ formData, onFormDataChange, isUpdate ,idProduct}) => {

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormInputs>();
  const formValues = watch();
  useEffect(() => {
    if (isUpdate) {

      setValue('weight', formData.weight);
      setValue('height', formData.height);
      setValue('length', formData.length);
      setValue('width', formData.width);
    }
  }, [formData]);

  const handleSave = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Ngăn chặn hành vi submit của form


    const formData = {
      weight: formValues.weight,
      height: formValues.height,
      length: formValues.length,
      width: formValues.width,
    };
    onFormDataChange(formData);
  };


  const handleUpdate = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Ngăn chặn hành vi submit của form
    const formData = {
      weight: formValues.weight,
      height: formValues.height,
      length: formValues.length,
      width: formValues.width,
    };
    console.log(formData);
    try {
      await productApi.updateProductShip(idProduct, formData);
      toast.success('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error updating product.');
    }

  };



  return (
    <div className="m-2 p-2 border-spacing-44 border-red-300 border">
        <h1>THÔNG TIN VẬN CHUYỂN</h1>
        <form  className="p-4 space-y-4">
      <div>
        <label className="block text-gray-700">Thông tin cân nặng sau khi đóng gói (kg)</label>
        <input
          type="number"
          step="0.01"
          {...register('weight', { required: true })}
          defaultValue={1}

          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.weight && <span className="text-red-500">This field is required</span>}
      </div>

      <div>
        <label className="block text-gray-700">Thông tin thể tích (cao x dài x rộng) (cm)</label>
        <div className="flex space-x-2">
          <input
            type="number"
            step="0.01"
            placeholder="Cao"
            {...register('height', { required: true })}
            defaultValue={1}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Dài"
            {...register('length', { required: true })}
            defaultValue={1}

            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Rộng"
            {...register('width', { required: true })}
            defaultValue={1}

            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        {(errors.height || errors.length || errors.width) && <span className="text-red-500">All fields are required</span>}
      </div>

      <div className="flex justify-end">
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
  )
}
export default FormShipping;