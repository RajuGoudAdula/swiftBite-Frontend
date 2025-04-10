import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } from '../../store/slices/menuSlice';

const CanteenMenu = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(state => state.menu);
  const [newItem, setNewItem] = useState({
    productId: '',
    price: '',
    stock: '',
    preparationTime: '',
    deliveryTime: '',
  });

  useEffect(() => {
    dispatch(fetchMenuItems());
  }, [dispatch]);

  const handleAdd = () => {
    dispatch(addMenuItem(newItem));
    setNewItem({
      productId: '',
      price: '',
      stock: '',
      preparationTime: '',
      deliveryTime: '',
    });
  };

  const handleDelete = (id) => {
    dispatch(deleteMenuItem(id));
  };

  if (loading) return <h2>Loading Menu...</h2>;

  return (
    <div>
      <h2>Canteen Menu</h2>
      <input type="text" placeholder="Product ID" value={newItem.productId} onChange={(e) => setNewItem({ ...newItem, productId: e.target.value })} />
      <input type="number" placeholder="Price" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} />
      <input type="number" placeholder="Stock" value={newItem.stock} onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })} />
      <button onClick={handleAdd}>Add Item</button>

      <ul>
        {items.map(item => (
          <li key={item._id}>
            {item.name} - ₹{item.price} - {item.stock} in stock
            <button onClick={() => handleDelete(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CanteenMenu;
