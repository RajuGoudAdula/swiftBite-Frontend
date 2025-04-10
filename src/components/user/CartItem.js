import React from 'react';
import CartItemControls from './CartItemControls';
import { FaTrashAlt } from 'react-icons/fa';

const CartItem = ({ item, handleQuantityChange, handleRemoveItem }) => {
  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item-image" />
      <div className="cart-item-content">
        <div className="cart-item-details">
          <h3 className="cart-item-name">{item.name}</h3>
          <p className="cart-item-price">Rs.{item.price}</p>
        </div>
        {/* ✅ Quantity and Remove Button */}
        <CartItemControls 
          item={item}
          handleQuantityChange={handleQuantityChange}
          handleRemoveItem={handleRemoveItem}
        />
      </div>
    </div>
  );
};

export default CartItem;
