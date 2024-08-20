import React from 'react'

export default function Shipping() {
  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Thêm Đơn Vị Vận Chuyển</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-md shadow-md">
          <h3 className="text-sm opacity-50 font-semibold mb-2">Các đơn vị vận chuyển khác được ỨNG DỤNG hỗ trợ</h3>
          <h3 className="text-sm opacity-50 font-semibold mb-2">Hiện tại đơn vị vận chuyển khi khác hàng mua chỉ đang hỗ trợ do ỨNG DỤNG QUY ĐỊNH về đơn vị vẫn chuyển</h3>
        </div>
      </div>
    </div>
  )
}
