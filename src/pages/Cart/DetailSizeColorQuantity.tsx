import React from 'react';
import { Purchase } from 'src/types/purchase.type';

interface DetailSizeColorQuantityProps {
  purchase: Purchase;
}

const DetailSizeColorQuantity: React.FC<DetailSizeColorQuantityProps> = ({ purchase }) => {
  const { product, id_size_quantity_color } = purchase;

  const sizeQuantity = product.sizeQuantities.find(sizeQuantity => sizeQuantity.id === id_size_quantity_color);

  return (
    <div>
      {sizeQuantity ? (
        <div>
          <span>Màu: {sizeQuantity.color}</span> | 
          <span>Size: {sizeQuantity.size}</span> | 
          <span>Số lượng: {sizeQuantity.quantity} (hiện trong kho)</span>
        </div>
      ) : (
        <span>số lượng trong kho {purchase.product.quantity}</span>
      )}
      
    </div>
  );
};

export default DetailSizeColorQuantity;
