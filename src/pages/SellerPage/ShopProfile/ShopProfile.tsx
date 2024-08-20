import { u } from 'msw/lib/glossary-de6278a9';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ShopApi from 'src/apis/shop.api';
import { Shop } from 'src/constants/contant';

interface ShopFormProps {}

const ShopProfile: React.FC<ShopFormProps> = () => {


  useEffect(() => {
    const fetchShopProfile = async () => {
      const id = localStorage.getItem('id');
      if (!id) return; // Kiểm tra xem ID có tồn tại không

      try {
        const response = await ShopApi.getShop(id);
        const shopData = response.data; // Giả sử response.data chứa thông tin cửa hàng
        setFormData({
          id: shopData.id,
          name: shopData.name,
          description: shopData.description,
          type: shopData.type,
          city: shopData.city,
          district: shopData.district,
          ward: shopData.ward,
          detailLocation: shopData.detailLocation
        });
      } catch (error) {
        console.error("Error fetching shop profile:", error);
      }
    };

    fetchShopProfile();
  }, []);

  const [formData, setFormData] = useState<Shop>({
    id: 0,
    name: '',
    description: '',
    type: '',
    city: '',
    district: '',
    ward: '',
    detailLocation: ''
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('TÍNH NĂNG NÀY CHƯA PHÁT TRIỂN TRONG DỰ ÁN NÀY!');
    toast.success('VUI LÒNG LIÊN HỆ VỚI CHÚNG TÔI ĐỂ ĐƯỢC HỖ TRỢ!');
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Shop Information</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="shopName" className="block text-sm font-medium text-gray-700">
            Shop Name
          </label>
          <input
            type="text"
            name="shopName"
            id="shopName"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="shopAvatar" className="block text-sm font-medium text-gray-700">
            Shop Avatar
          </label>
          <input
            type="text"
            name="shopAvatar"
            id="shopAvatar"
            value="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWBpWCt8mEim-vwUaNaijfL_YnH-r0fhzgDA&s"
            onChange={handleChange}
            placeholder="Enter image URL"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
       <div className="mt-4">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWBpWCt8mEim-vwUaNaijfL_YnH-r0fhzgDA&s"
                alt="Shop Avatar"
                className="w-32 h-32 object-cover rounded-full mx-auto shadow-md"
              />
            </div>
        </div>
        <div>
          <label htmlFor="shopDescription" className="block text-sm font-medium text-gray-700">
            Shop Description
          </label>
          <textarea
            name="shopDescription"
            id="shopDescription"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>
        <div>
          <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
            Business Type
          </label>
          <input
            type="text"
            name="businessType"
            id="businessType"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700">
            Business Registration Address
          </label>
          <input
            type="text"
            name="businessAddress"
            id="businessAddress"
            value={`${formData.city}, ${formData.district}, ${formData.ward}, ${formData.detailLocation}`}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShopProfile;
