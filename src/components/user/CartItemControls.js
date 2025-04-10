import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';

const CartItemControls = ({ item, handleQuantityChange, handleRemoveItem }) => {
  return (
    <div className="cart-item-controls">
      <div className="cart-item-quantity">
        <button
          onClick={() => handleQuantityChange(item.itemId, -1)}
          className="quantity-btn"
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span>{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.itemId, 1)}
          className="quantity-btn"
        >
          +
        </button>
      </div>
      <button
        onClick={() => handleRemoveItem(item.itemId)}
        className="cart-item-remove-button"
      >
        <FaTrashAlt />
      </button>
    </div>
  );
};

export default CartItemControls;
