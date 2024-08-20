import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useQuery, useMutation } from '@tanstack/react-query';
import productApi from 'src/apis/product.api';
import { useNavigate } from 'react-router-dom';
import { Promotion } from 'src/types/product.type';


const PromotionList: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filteredPromotions, setFilteredPromotions] = useState<Promotion[]>([]);
  const navigate = useNavigate();



  const id = localStorage.getItem('shopId');
  const idShop = id !== null ? id : '0';
  const { data: promotions = [], isLoading, error, refetch } = useQuery<Promotion[], Error>(
    ['promotions', idShop],
    () => productApi.getPromotionsByIdShop(idShop)
  );

  useEffect(() => {
    // Set filtered promotions to initial promotions on load
    setFilteredPromotions(promotions);
  }, [promotions]);

  const handleDateFilter = () => {
    // Filter promotions based on selectedDate
    const filteredPromotions = promotions?.filter(promotion => {
      if (!selectedDate) return true; // Return all if no date selected
  
      const promotionStartDate = new Date(promotion.startDate);
      const promotionEndDate = new Date(promotion.endDate);
  
      return (
        promotionStartDate <= selectedDate && promotionEndDate >= selectedDate
      );
    });
  
    console.log('Filtered promotions:', filteredPromotions);
    setFilteredPromotions(filteredPromotions);
  };

  const handleDateFilter1 = () => {
    // Filter promotions based on selectedDate
    setSelectedDate(null);  
    setFilteredPromotions(promotions);
  };
  

  const handleEdit = (id: string) =>{

  }

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Danh sách chương trình khuyến mãi</h2>
      <div className="flex space-x-4 mb-4">
      <div>
          <label htmlFor="datePicker" className="block text-sm font-medium text-gray-700">
            Chọn ngày
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            selectsStart
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            id="datePicker"
            placeholderText="Chọn ngày"
            dateFormat="dd/MM/yyyy" // Customize date format if needed
          />
        </div>

        <button
          onClick={handleDateFilter}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
        >
          Lọc
        </button>

        <button
          onClick={handleDateFilter1}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
        >
          Reset
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredPromotions?.map(promotion => (
          <div key={promotion.id} className="border border-gray-200 rounded-md p-4 shadow-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{promotion.name}</h3>
              <button
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                onClick={() => navigate(`/seller-promiton/${promotion.id}`)}
              >
                Chỉnh sửa
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Ngày bắt đầu:</span> {promotion.startDate}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Ngày kết thúc:</span> {promotion.endDate}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Mô tả:</span> {promotion.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromotionList;
