import React from 'react';
import Payment from '../../pages/user/Payment';

const CartTotal = ({ totalAmount, userId, cartItems }) => {
  return (
    <div className="amount">
      <h3 className="cart-total">Total Amount: Rs.{totalAmount}</h3>
      <Payment 
        totalAmount={totalAmount} 
        userId={userId} 
        cartItems={cartItems} 
      />
    </div>
  );
};

export default CartTotal;
