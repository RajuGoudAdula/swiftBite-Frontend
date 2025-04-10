import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../store/slices/productSlice";
import ModalPopup from "../../components/common/ModalPopup";
import styles from "../../styles/ManageProducts.module.css";

const ManageProducts = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    category: "",
    ingredients: "",
    allergens: "",
    tags: "",
    unit: "",              // ✅ Added
    netWeight: "",         // ✅ Added
    nutritionalInfo: {
      calories: "",
      protein: "",
      fat: "",
      carbohydrates: "",
      fiber: "",
    },
  });

  const unitToWeightUnits = {
    plate: ["grams", "kilograms"],
    bottle: ["ml", "liters"],
    pack: ["grams", "kilograms"],
    box: ["grams", "kilograms"],
    glass: ["ml", "liters"],
    cup: ["ml", "liters"],
    bowl: ["ml", "liters"],
  };
  
  

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("nutritionalInfo.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        nutritionalInfo: { ...prev.nutritionalInfo, [key]: value },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      ingredients: formData.ingredients.split(",").map((i) => i.trim()),
      allergens: formData.allergens.split(",").map((a) => a.trim()),
      tags: formData.tags.split(",").map((t) => t.trim()),
      nutritionalInfo: {
        calories: Number(formData.nutritionalInfo.calories),
        protein: Number(formData.nutritionalInfo.protein),
        fat: Number(formData.nutritionalInfo.fat),
        carbohydrates: Number(formData.nutritionalInfo.carbohydrates),
        fiber: Number(formData.nutritionalInfo.fiber),
      },
    };
    if (formData._id) {
      dispatch(updateProduct({ productId: formData._id, productData: formattedData }));
      setIsEditModalOpen(false);
    } else {
      dispatch(addProduct(formattedData));
      setIsAddModalOpen(false);
    }
    resetForm();
  };

  const handleEdit = (product) => {
    setFormData({
      ...product,
      ingredients: product.ingredients.join(", "),
      allergens: product.allergens.join(", "),
      tags: product.tags.join(", "),
      unit: product.unit || "",          // ✅ Added
      netWeight: product.netWeight || "",// ✅ Added
      nutritionalInfo: {
        calories: product.nutritionalInfo.calories || "",
        protein: product.nutritionalInfo.protein || "",
        fat: product.nutritionalInfo.fat || "",
        carbohydrates: product.nutritionalInfo.carbohydrates || "",
        fiber: product.nutritionalInfo.fiber || "",
      },
    });
    setIsEditModalOpen(true);
  };
  

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
      category: "",
      ingredients: "",
      allergens: "",
      tags: "",
      unit: "",            // ✅ Added
      netWeight: "",       // ✅ Added
      nutritionalInfo: {
        calories: "",
        protein: "",
        fat: "",
        carbohydrates: "",
        fiber: "",
      },
      _id: undefined,
    });
  };
  

  const openViewModal = (product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Manage Products</h2>
        <button className={styles.addButton} onClick={openAddModal}>
          Add New Product
        </button>
      </div>
      
      {loading && <p className={styles.loading}>Loading...</p>}
      {error && <p className={styles.error}>Error: {error}</p>}

      {/* PRODUCT CARDS */}
      <div className={styles.cardContainer}>
        {products.map((product) => (
          <div key={product._id} className={styles.card}>
            <img src={product.image} alt={product.name} className={styles.cardImage} />
            <div className={styles.cardContent}>
              <div>
              <h3 className={styles.cardTitle}>{product.name}</h3>
              <p className={styles.cardCategory}>{product.category}</p>
              </div>
              <div className={styles.cardActions}>
                <button className={styles.viewButton} onClick={() => openViewModal(product)}>
                  View
                </button>
                <button className={styles.editButton} onClick={() => handleEdit(product)}>
                  Edit
                </button>
                <button className={styles.deleteButton} onClick={() => handleDelete(product._id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* VIEW PRODUCT MODAL */}
      <ModalPopup
        isOpen={isViewModalOpen}
        title={selectedProduct?.name || "Product Details"}
        onClose={() => setIsViewModalOpen(false)}
      >
        {selectedProduct && (
          <div className={styles.modalContent}>
            <img src={selectedProduct.image} alt={selectedProduct.name} className={styles.modalImage} />
            <p><strong>Description:</strong> {selectedProduct.description}</p>
            <p><strong>Unit:</strong> {selectedProduct.unit}</p>
            <p><strong>Net Weight:</strong> {selectedProduct.netWeight}</p>
            <p><strong>Category:</strong> {selectedProduct.category}</p>
            <p><strong>Ingredients:</strong> {selectedProduct.ingredients.join(", ")}</p>
            <p><strong>Allergens:</strong> {selectedProduct.allergens.join(", ")}</p>
            <p><strong>Tags:</strong> {selectedProduct.tags.join(", ")}</p>
            <p><strong>Nutritional Info:</strong></p>
            <ul>
              <li>Calories: {selectedProduct.nutritionalInfo.calories}g</li>
              <li>Protein: {selectedProduct.nutritionalInfo.protein}g</li>
              <li>Fat: {selectedProduct.nutritionalInfo.fat}g</li>
              <li>Carbs: {selectedProduct.nutritionalInfo.carbohydrates}g</li>
              <li>Fiber: {selectedProduct.nutritionalInfo.fiber}g</li>
            </ul>
          </div>
        )}
      </ModalPopup>

      {/* ADD PRODUCT MODAL */}
      <ModalPopup
        isOpen={isAddModalOpen}
        title="Add New Product"
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleSubmit}
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Name:</label>
            <input className={styles.input} name="name" placeholder="E.g., Burger" value={formData.name} onChange={handleChange} required />
          </div>

          <div className={styles.inputGroup}>
            <label>Image URL:</label>
            <input className={styles.input} name="image" placeholder="E.g., https://example.com/burger.jpg" value={formData.image} onChange={handleChange} required />
          </div>

          {formData.image && <img src={formData.image} alt="Preview" className={styles.previewImage} />}

          <div className={styles.inputGroup}>
            <label>Description:</label>
            <textarea className={styles.input} name="description" placeholder="E.g., A delicious grilled burger with cheese" value={formData.description} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label>Unit:</label>
              <select
                className={styles.input}
                name="unit"
                value={formData.unit}
                onChange={handleChange}
              >
                <option value="">Select unit</option>
                <option value="plate">Plate</option>
                <option value="bottle">Bottle</option>
                <option value="pack">Pack</option>
                <option value="box">Box</option>
                <option value="glass">Glass</option>
                <option value="cup">Cup</option>
                <option value="bowl">Bowl</option>
              </select>
          </div>

          <div className={styles.inputGroup}>
              <label>Net Weight:</label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="number"
                  className={styles.input}
                  placeholder="E.g., 250"
                  value={formData.netWeight.replace(/[^\d.]/g, "")} // extract numeric part
                  onChange={(e) => {
                    const weightValue = e.target.value;
                    const currentUnit =
                      formData.netWeight.match(/[a-zA-Z]+/)?.[0] || ""; // extract existing unit
                    setFormData((prev) => ({
                      ...prev,
                      netWeight: weightValue + currentUnit,
                    }));
                  }}
                  style={{ flex: 1 , width:"50%" }}
                />
                <select
                  className={styles.input}
                  value={formData.netWeight.match(/[a-zA-Z]+/)?.[0] || ""}
                  onChange={(e) => {
                    const selectedUnit = e.target.value;
                    const numericValue = formData.netWeight.replace(/[^\d.]/g, "");
                    setFormData((prev) => ({
                      ...prev,
                      netWeight: numericValue + selectedUnit,
                    }));
                  }}
                  style={{ flex: 1 ,width:"50%" }}
                >
                  <option value="">Select Unit</option>
                  {(unitToWeightUnits[formData.unit] || []).map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          <div className={styles.inputGroup}>
            <label>Category:</label>
            <select className={styles.input} name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              <option value="Main Course">Main Course</option>
              <option value="Side Dish">Side Dish</option>
              <option value="Dessert">Dessert</option>
              <option value="Beverage">Beverage</option>
              <option value="Snacks">Snacks</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Ingredients (comma-separated):</label>
            <input className={styles.input} name="ingredients" placeholder="E.g., Bread, Meat, Cheese" value={formData.ingredients} onChange={handleChange} />
          </div>

          <div className={styles.inputGroup}>
            <label>Allergens (comma-separated):</label>
            <input className={styles.input} name="allergens" placeholder="E.g., Nuts, Dairy" value={formData.allergens} onChange={handleChange} />
          </div>

          <div className={styles.inputGroup}>
            <label>Tags (comma-separated):</label>
            <input className={styles.input} name="tags" placeholder="E.g., Vegan, Spicy" value={formData.tags} onChange={handleChange} />
          </div>

          {["calories", "protein", "fat", "carbohydrates", "fiber"].map((key) => (
            <div className={styles.inputGroup} key={key}>
              <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
              <input type="number" className={styles.input} name={`nutritionalInfo.${key}`} placeholder={`E.g., ${key === "calories" ? "250" : "10"}`} value={formData.nutritionalInfo[key]} onChange={handleChange} />
            </div>
          ))}

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.button}>Add Product</button>
          </div>
        </form>
      </ModalPopup>

      {/* EDIT PRODUCT MODAL */}
      <ModalPopup
        isOpen={isEditModalOpen}
        title="Edit Product"
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleSubmit}
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Name:</label>
            <input className={styles.input} name="name" placeholder="E.g., Burger" value={formData.name} onChange={handleChange} required />
          </div>

          <div className={styles.inputGroup}>
            <label>Image URL:</label>
            <input className={styles.input} name="image" placeholder="E.g., https://example.com/burger.jpg" value={formData.image} onChange={handleChange} required />
          </div>

          {formData.image && <img src={formData.image} alt="Preview" className={styles.previewImage} />}

          <div className={styles.inputGroup}>
            <label>Description:</label>
            <textarea className={styles.input} name="description" placeholder="E.g., A delicious grilled burger with cheese" value={formData.description} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label>Unit:</label>
              <select
                className={styles.input}
                name="unit"
                value={formData.unit}
                onChange={handleChange}
              >
                <option value="">Select unit</option>
                <option value="plate">Plate</option>
                <option value="bottle">Bottle</option>
                <option value="pack">Pack</option>
                <option value="box">Box</option>
                <option value="glass">Glass</option>
                <option value="cup">Cup</option>
                <option value="bowl">Bowl</option>
              </select>
          </div>

          <div className={styles.inputGroup}>
              <label>Net Weight:</label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="number"
                  className={styles.input}
                  placeholder="E.g., 250"
                  value={formData.netWeight.replace(/[^\d.]/g, "")} // extract numeric part
                  onChange={(e) => {
                    const weightValue = e.target.value;
                    const currentUnit =
                      formData.netWeight.match(/[a-zA-Z]+/)?.[0] || ""; // extract existing unit
                    setFormData((prev) => ({
                      ...prev,
                      netWeight: weightValue + currentUnit,
                    }));
                  }}
                  style={{ flex: 1 , width : "50%"}}
                />
                <select
                  className={styles.input}
                  value={formData.netWeight.match(/[a-zA-Z]+/)?.[0] || ""}
                  onChange={(e) => {
                    const selectedUnit = e.target.value;
                    const numericValue = formData.netWeight.replace(/[^\d.]/g, "");
                    setFormData((prev) => ({
                      ...prev,
                      netWeight: numericValue + selectedUnit,
                    }));
                  }}
                  style={{ flex: 1 , width : "50%" }}
                >
                  <option value="">Select Unit</option>
                  {(unitToWeightUnits[formData.unit] || []).map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
          </div>
          <div className={styles.inputGroup}>
            <label>Category:</label>
            <select className={styles.input} name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              <option value="Main Course">Main Course</option>
              <option value="Side Dish">Side Dish</option>
              <option value="Dessert">Dessert</option>
              <option value="Beverage">Beverage</option>
              <option value="Snacks">Snacks</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Ingredients (comma-separated):</label>
            <input className={styles.input} name="ingredients" placeholder="E.g., Bread, Meat, Cheese" value={formData.ingredients} onChange={handleChange} />
          </div>

          <div className={styles.inputGroup}>
            <label>Allergens (comma-separated):</label>
            <input className={styles.input} name="allergens" placeholder="E.g., Nuts, Dairy" value={formData.allergens} onChange={handleChange} />
          </div>

          <div className={styles.inputGroup}>
            <label>Tags (comma-separated):</label>
            <input className={styles.input} name="tags" placeholder="E.g., Vegan, Spicy" value={formData.tags} onChange={handleChange} />
          </div>

          {["calories", "protein", "fat", "carbohydrates", "fiber"].map((key) => (
            <div className={styles.inputGroup} key={key}>
              <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
              <input type="number" className={styles.input} name={`nutritionalInfo.${key}`} placeholder={`E.g., ${key === "calories" ? "250" : "10"}`} value={formData.nutritionalInfo[key]} onChange={handleChange} />
            </div>
          ))}

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.button}>Update Product</button>
          </div>
        </form>
      </ModalPopup>
    </div>
  );
};

export default ManageProducts;