import React, { useState } from 'react';
import axios from 'axios';
import './AddMenuItem.css';

const AddMenuItem = ({ onMenuUpdate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [ingredients, setIngredients] = useState('');
  const [allergens, setAllergens] = useState('');
  const [spiceLevel, setSpiceLevel] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [carbohydrates, setCarbohydrates] = useState('');
  const [fiber, setFiber] = useState('');
  const [availabilityStart, setAvailabilityStart] = useState('');
  const [availabilityEnd, setAvailabilityEnd] = useState('');
  const [offerType, setOfferType] = useState('');
  const [isOfferOn, setIsOfferOn] = useState(false);
  const [discount, setDiscount] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [tags, setTags] = useState('');

  const handleOfferChange = () => {
    setIsOfferOn(!isOfferOn);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('User not authenticated. Please log in.');
        return;
      }

      await axios.post(
        'http://127.0.0.1:5000/api/menu/add',
        {
          name,
          description,
          price,
          image,
          category,
          isAvailable,
          isFeatured,
          isPopular,
          ingredients: ingredients.split(','),
          allergens: allergens.split(','),
          spiceLevel,
          prepTime,
          nutritionalInfo: {
            calories,
            protein,
            fat,
            carbohydrates,
            fiber,
          },
          availability: {
            start: availabilityStart,
            end: availabilityEnd,
          },
          specialOffers: [{
            offerType,
            discount,
            validUntil,
          }],
          discountedPrice,
          tags: tags.split(','),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Menu item added successfully');
      onMenuUpdate(); // Notify parent to re-fetch the menu
      // Reset the form after submission
      setName('');
      setDescription('');
      setPrice('');
      setImage('');
      setCategory('');
      setIsAvailable(true);
      setIsFeatured(false);
      setIsPopular(false);
      setIngredients('');
      setAllergens('');
      setSpiceLevel('');
      setPrepTime('');
      setCalories('');
      setProtein('');
      setFat('');
      setCarbohydrates('');
      setFiber('');
      setAvailabilityStart('');
      setAvailabilityEnd('');
      setOfferType('');
      setDiscount('');
      setValidUntil('');
      setDiscountedPrice('');
      setTags('');
    } catch (error) {
      console.error('Error adding menu item:', error);
      alert('Failed to add menu item');
    }
  };

  return (
    <div className="add-menu-item apple-style">
      <form onSubmit={handleSubmit} className="form-container">
        <div className="inputs">
          {/* Name and Description */}
          <h3>Menu Item Information</h3>
          <input type="text" placeholder="Enter the name of the item" value={name} onChange={(e) => setName(e.target.value)} required className="apple-input" />
          <textarea placeholder="Enter a detailed description of the item" value={description} onChange={(e) => setDescription(e.target.value)} required className="apple-textarea" />
          
          {/* Price and Image URL */}
          <h3>Pricing and Image</h3>
          <input type="number" placeholder="Enter the price of the item" value={price} onChange={(e) => setPrice(e.target.value)} required className="apple-input" />
          <input type="text" placeholder="Enter the image URL for the item" value={image} onChange={(e) => setImage(e.target.value)} className="apple-input" />

          {/* Category */}
          <h3>Category</h3>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required className="apple-select">
            <option value="">Select Category</option>
            <option value="Main Course">Main Course</option>
            <option value="Side Dish">Side Dish</option>
            <option value="Dessert">Dessert</option>
            <option value="Beverage">Beverage</option>
            <option value="Snacks">Snacks</option>
          </select>

          {/* Availability and Featured */}
          <h3>Availability and Popularity</h3>
          <label>
            <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />
            Available
          </label>
          <label>
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
            Featured
          </label>
          <label>
            <input type="checkbox" checked={isPopular} onChange={(e) => setIsPopular(e.target.checked)} />
            Popular
          </label>

          {/* Ingredients and Allergens */}
          <h3>Ingredients and Allergens</h3>
          <input type="text" placeholder="List ingredients (comma-separated)" value={ingredients} onChange={(e) => setIngredients(e.target.value)} className="apple-input" />
          <input type="text" placeholder="List allergens (comma-separated)" value={allergens} onChange={(e) => setAllergens(e.target.value)} className="apple-input" />

          {/* Spice Level and Prep Time */}
          <h3>Spice Level and Preparation</h3>
          <select value={spiceLevel} onChange={(e) => setSpiceLevel(e.target.value)} className="apple-select">
            <option value="">Select Spice Level</option>
            <option value="Mild">Mild</option>
            <option value="Medium">Medium</option>
            <option value="Hot">Hot</option>
            <option value="Very Hot">Very Hot</option>
          </select>
          <input type="number" placeholder="Enter prep time (in minutes)" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} className="apple-input" />

          {/* Nutritional Information */}
          <h3>Nutritional Information</h3>
          <input type="number" placeholder="Calories" value={calories} onChange={(e) => setCalories(e.target.value)} className="apple-input" />
          <input type="number" placeholder="Protein" value={protein} onChange={(e) => setProtein(e.target.value)} className="apple-input" />
          <input type="number" placeholder="Fat" value={fat} onChange={(e) => setFat(e.target.value)} className="apple-input" />
          <input type="number" placeholder="Carbohydrates" value={carbohydrates} onChange={(e) => setCarbohydrates(e.target.value)} className="apple-input" />
          <input type="number" placeholder="Fiber" value={fiber} onChange={(e) => setFiber(e.target.value)} className="apple-input" />

          {/* Availability Dates */}
          <h3>Availability Dates</h3>
          <input type="datetime-local" placeholder="Available From" value={availabilityStart} onChange={(e) => setAvailabilityStart(e.target.value)} className="apple-input" />
          <input type="datetime-local" placeholder="Available Until" value={availabilityEnd} onChange={(e) => setAvailabilityEnd(e.target.value)} className="apple-input" />

          {/* Special Offers */}
          <h3>Special Offers</h3>
          <label>
          <input
            type="checkbox"
            checked={isOfferOn}
            onChange={handleOfferChange}
          />
          Enable Offer
        </label>
          <input type="text" placeholder="Offer Type" disabled={!isOfferOn} value={offerType} onChange={(e) => setOfferType(e.target.value)} className="apple-input" />
          <input type="number" placeholder="Discount" disabled={!isOfferOn} value={discount} onChange={(e) => setDiscount(e.target.value)} className="apple-input" />
          <input type="date" placeholder="Offer Valid Until" disabled={!isOfferOn} value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className="apple-input" />

          {/* Discounted Price */}
          <h3>Discounted Price</h3>
          <input type="number" placeholder="Discounted Price" value={discountedPrice} onChange={(e) => setDiscountedPrice(e.target.value)} className="apple-input" />

          {/* Tags */}
          <h3>Tags for filtering</h3>
          <input type="text" placeholder="Enter tags (comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)} className="apple-input" />

          {/* Submit Button */}
          <button type="submit" className="apple-button">Add Item</button>
        </div>

        {/* Image Preview */}
        <div className="image-preview">
          {image && <img src={image} alt="Preview" className="apple-image" />}
        </div>
      </form>
    </div>
  );
};

export default AddMenuItem;
