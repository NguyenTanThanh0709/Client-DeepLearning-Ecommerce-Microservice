import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Dummy data for revenue (replace with actual data fetched from API)
const revenueData = [
  { date: '2024-07-01', product: 'Product A', revenue: 100 },
  { date: '2024-07-02', product: 'Product B', revenue: 150 },
  { date: '2024-07-03', product: 'Product C', revenue: 200 },
  // Add more revenue data as needed
];

const Revenue: React.FC = () => {
  // State to track selected options (product, time frame)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Function to handle filtering by product
  const handleProductFilter = (product: string | null) => {
    setSelectedProduct(product);
    // Implement logic to filter data by selected product
    console.log(`Filter by product: ${product}`);
  };

  // Function to handle filtering by date
  const handleDateFilter = (date: Date | null) => {
    setSelectedDate(date);
    // Implement logic to filter data by selected date
    console.log(`Filter by date: ${date}`);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Dashboard Doanh Thu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-md shadow-md">
          <h3 className="text-lg font-semibold mb-2">Doanh thu theo sản phẩm</h3>
          {/* Dropdown to select product */}
          <div className="mb-2">
            <label htmlFor="productSelect" className="block text-sm font-medium text-gray-700 mb-1">Chọn sản phẩm:</label>
            <select
              id="productSelect"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={selectedProduct || ''}
              onChange={(e) => handleProductFilter(e.target.value !== '' ? e.target.value : null)}
            >
              <option value="">Tất cả sản phẩm</option>
              {/* Replace with actual product options */}
              <option value="Product A">Product A</option>
              <option value="Product B">Product B</option>
              <option value="Product C">Product C</option>
            </select>
          </div>
          {/* Placeholder for revenue chart */}
          <div style={{ height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-4 rounded-md shadow-md">
          <h3 className="text-lg font-semibold mb-2">Doanh thu theo ngày</h3>
          {/* DatePicker to select date */}
          <div className="mb-2">
            <label htmlFor="datePicker" className="block text-sm font-medium text-gray-700 mb-1">Chọn ngày:</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => handleDateFilter(date)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              id="datePicker"
              placeholderText="Chọn ngày"
              dateFormat="dd/MM/yyyy" // Customize date format if needed
            />
          </div>
          {/* Placeholder for revenue chart */}
          <div style={{ height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#82ca9d" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
