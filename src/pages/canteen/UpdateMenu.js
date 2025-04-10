import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./UpdateMenu.css"; // Add styles for modal popup

const UpdateMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountedPrice: "",
    image: "",
    category: "Main Course",
    ingredients: "",
    allergens: "",
    isAvailable: true,
    isFeatured: false,
    isPopular: false,
    spiceLevel: "Mild",
  });

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/menu");
        console.log(response.data)
        setMenuItems(response.data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };
    fetchMenuItems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await axios.put(`http://127.0.0.1:5000/api/menu/item/${editItem._id}`, formData);
      } else {
        await axios.post("http://127.0.0.1:5000/api/menu", formData);
      }
      setShowModal(false);
      setEditItem(null);
      window.location.reload();
    } catch (error) {
      console.error("Error saving menu item:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/menu/item/${id}`);
      setMenuItems(menuItems.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

  const openModal = (item = null) => {
    setEditItem(item);
    setFormData(
      item || {
        name: "",
        description: "",
        price: "",
        discountedPrice: "",
        image: "",
        category: "Main Course",
        ingredients: "",
        allergens: "",
        isAvailable: true,
        isFeatured: false,
        isPopular: false,
        spiceLevel: "Mild",
      }
    );
    setShowModal(true);
  };

  return (
    <div className="updatemenu-container">
      <div className="updatemenu-heading">
        <h2>Current Menu</h2>
        <button onClick={() => openModal()} className="add-new-item">Add New Item</button>
      </div>

      <div className="menu-items">
    {menuItems.map(item => (
      <div key={item._id} className="menu-item" >
        {/* Display Special Offer if Active */}
        {item.specialOffers && item.specialOffers.some(offer => offer.isActive) && (
          <div className="special-offer">
            {/* Loop through and display active offers */}
            {item.specialOffers.filter(offer => offer.isActive).map(offer => (
              <p key={offer._id}>{offer.offerType}</p>
            ))}
          </div>
        )}

        <div className="image-container">
          <img src={item.image} alt={item.name} className="menu-item-image" />
          {item.isPopular && (
            <div className="popularity-star">
              <span role="img" aria-label="star">⭐</span>
            </div>
          )}
        </div>

        <div className='menu-item-detail'>
          <div className='memu-item-info'>
            <div className="menu-item-name">
              <h3>{item.name}</h3>
            </div>
            <div className="price-info">
              {/* Display discounted price if available */}
              <p className="menu-item-price">
                Rs. { item.price}
              </p>
            </div>
          </div>
          <div >
      
          </div>
        </div>
        <div className="edit-delete-buttons">
        <button onClick={() => openModal(item)} className="edit-item">
          <FaEdit style={{ color: "blue" }} />
        </button>
        <button onClick={() => handleDelete(item._id)} className="delete-item">
          <FaTrash style={{ color: "red" }}/>
        </button>
        </div>
      </div>
    ))}
  </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editItem ? "Edit Item" : "Add New Item"}</h2>
            <form onSubmit={handleSubmit}>
              <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" required />
              <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" required />
              <input name="price" type="number" value={formData.price} onChange={handleInputChange} placeholder="Price" required />
              <input name="image" value={formData.image} onChange={handleInputChange} placeholder="Image URL" />
              <select name="category" value={formData.category} onChange={handleInputChange}>
                <option>Main Course</option>
                <option>Side Dish</option>
                <option>Dessert</option>
                <option>Beverage</option>
                <option>Snacks</option>
              </select>
              <select name="spiceLevel" value={formData.spiceLevel} onChange={handleInputChange}>
                <option value="Mild">Mild</option>
                <option value="Medium">Medium</option>
                <option value="Spicy">Spicy</option>
              </select>

              <input name="ingredients" value={formData.ingredients} onChange={handleInputChange} placeholder="Ingredients" />
              <input name="allergens" value={formData.allergens} onChange={handleInputChange} placeholder="Allergens" />
              <label>
                <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleInputChange} /> Available
              </label>
              <label>
                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleInputChange} /> Featured
              </label>
              <label>
                <input type="checkbox" name="isPopular" checked={formData.isPopular} onChange={handleInputChange} /> Popular
              </label>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateMenu;
