import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../../store/slices/menuSlice";
import { fetchProducts } from "../../store/slices/productSlice";
import ModalPopup from "../../components/common/ModalPopup";
import styles from "../../styles/ManageMenu.module.css";

const ManageMenu = () => {
  const dispatch = useDispatch();
  const { items: menu = [], loading: menuLoading, error: menuError } = useSelector((state) => state.menu) || {};
  const { products = [], loading: productLoading } = useSelector((state) => state.products) || {};
  const { user } = useSelector((state) => state.auth);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [updatedFields, setUpdatedFields] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchMenuItems());
  }, [dispatch]);

  const handleAddItem = () => {
    if (selectedProduct === "") {
      alert("Please select a product.");
      return;
    }
    const product = products.find((p) => p._id === selectedProduct);
    if (product) {
      dispatch(
        addMenuItem({
          canteenId: user.canteen._id,
          productId: product._id,
          name: product.name,
          price: 0,
          stock: 0,
          preparationTime: 10,
          deliveryTime: 20,
          isAvailable: true,
          offers: [],
          availability: { startTime: "", endTime: "" },
        })
      );
    }
    setSelectedProduct("");
  };

  const handleEditClick = (item) => {
    setEditingItem(item._id);
    setUpdatedFields({
      price: item.price,
      stock: item.stock,
      isAvailable: item.isAvailable,
      preparationTime: item.preparationTime,
      deliveryTime: item.deliveryTime,
      offers: item.offers || [],
      availability: item.availability || { startTime: "", endTime: "" },
    });
    setIsModalOpen(true);
  };

  const handleUpdateItem = () => {
    dispatch(updateMenuItem({ id: editingItem, data: updatedFields }));
    console.log(updatedFields);
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleOfferChange = (index, field, value) => {
    const updatedOffers = [...updatedFields.offers];
    updatedOffers[index] = { ...updatedOffers[index], [field]: value };
    setUpdatedFields({ ...updatedFields, offers: updatedOffers });
  };

  const handleAddOffer = () => {
    setUpdatedFields({
      ...updatedFields,
      offers: [...updatedFields.offers, { offerType: "", discount: 0, validUntil: "" }],
    });
  };

  const handleRemoveOffer = (index) => {
    const updatedOffers = updatedFields.offers.filter((_, i) => i !== index);
    setUpdatedFields({ ...updatedFields, offers: updatedOffers });
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A"; // Handle cases where the date is missing
    const options = { 
      year: "numeric", 
      month: "short", 
      day: "numeric", 
      hour: "2-digit", 
      minute: "2-digit" 
    };
    return new Date(isoDate).toLocaleDateString("en-US", options);
  };
  

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Manage Menu</h1>
      {productLoading ? (
        <p>Loading products...</p>
      ) : (
        <div className={styles.addItem}>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className={styles.select}
          >
            <option value="">Select Product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name} 
              </option>
            ))}
          </select>
          <button onClick={handleAddItem} disabled={!selectedProduct} className={styles.button}>
            Add to Menu
          </button>
        </div>
      )}

      {menuLoading ? (
        <p>Loading menu...</p>
      ) : menuError ? (
        <p>{menuError}</p>
      ) : (
        <div className={styles.menuList}>
          {menu.length > 0 ? (
            menu.map((item) => {
              const product = products.find((p) => p._id === item.productId) || {};
              return (
                <div key={product._id} className={styles.menuItem}>
                  <img src={product.image} alt={product.name} className={styles.image} />
                  <h2>{product.name}</h2>

                  <p>
                    <strong>Price:</strong> ₹{item.price}
                  </p>
                  <p>
                    <strong>Stock:</strong> {item.stock}
                  </p>
                  <p>
                    <strong>Availability:</strong> {item.availability?.startTime} - {item.availability?.endTime}
                  </p>
                  <p>
                    <strong>Preparation Time:</strong> {item.preparationTime} mins
                  </p>
                  <p>
                    <strong>Delivery Time:</strong> {item.deliveryTime} mins
                  </p>
                  <p>
                    <strong>Total Orders:</strong> {item.totalOrders}
                  </p>
                  <p>
                    <strong>Total Revenue:</strong> ₹{item.totalRevenue}
                  </p>
                  <p>
                    <strong>Created At:</strong> {formatDate(item.createdAt)}
                  </p>
                  <p>
                    <strong>Last Updated:</strong> {formatDate(item.updatedAt)}
                  </p>
                  <p>
                    <strong>Available Now:</strong> {item.isAvailable ? "✅ Yes" : "❌ No"}
                  </p>

                  <h3>Offers</h3>
                  {item.offers?.length > 0 ? (
                    <ul>
                      {item.offers.map((offer, index) => (
                        <li key={index}>
                          <strong>{offer.offerType}</strong> - {offer.discount}% off (Valid till{" "}
                          {formatDate(offer.validUntil)}) {offer.isActive ? " ✅ Active" : " ❌ Inactive"}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No offers available</p>
                  )}

                  <div className={styles.actionButtons}>
                    <button onClick={() => handleEditClick(item)} className={styles.button}>
                      Edit
                    </button>
                    <button onClick={() => dispatch(deleteMenuItem(item._id))} className={styles.deleteButton}>
                      Delete
                    </button>
                  </div>
              </div>
              );
            })
          ) : (
            <p>No menu items available</p>
          )}
        </div>
      )}

      {/* Modal for Editing Menu Item */}
      <ModalPopup isOpen={isModalOpen} title="Edit Menu Item" onClose={() => setIsModalOpen(false)}>
        {editingItem && (
          <>
            <div className={styles.inputGroup}>
              <label>Price (₹)</label>
              <input
                type="number"
                value={updatedFields.price}
                onChange={(e) => setUpdatedFields({ ...updatedFields, price: e.target.value })}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Stock</label>
              <input
                type="number"
                value={updatedFields.stock}
                onChange={(e) => setUpdatedFields({ ...updatedFields, stock: e.target.value })}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Is Available</label>
              <input
                type="boolean"
                value={updatedFields.isAvailable}
                onChange={(e) =>
                  setUpdatedFields({ ...updatedFields, isAvailable: e.target.value })
                }
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Preparation Time (mins)</label>
              <input
                type="number"
                value={updatedFields.preparationTime}
                onChange={(e) =>
                  setUpdatedFields({ ...updatedFields, preparationTime: e.target.value })
                }
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Delivery Time (mins)</label>
              <input
                type="number"
                value={updatedFields.deliveryTime}
                onChange={(e) =>
                  setUpdatedFields({ ...updatedFields, deliveryTime: e.target.value })
                }
              />
            </div>

            <h3>Availability</h3>
            <div className={styles.inputGroup}>
              <label>Start Time</label>
              <input
                type="time"
                value={updatedFields.availability.startTime}
                onChange={(e) =>
                  setUpdatedFields({
                    ...updatedFields,
                    availability: { ...updatedFields.availability, startTime: e.target.value },
                  })
                }
              />
              <label>End Time</label>
              <input
                type="time"
                value={updatedFields.availability.endTime}
                onChange={(e) =>
                  setUpdatedFields({
                    ...updatedFields,
                    availability: { ...updatedFields.availability, endTime: e.target.value },
                  })
                }
              />


            <h3>Offers</h3>
            {updatedFields.offers.length > 0 ? (
              updatedFields.offers.map((offer, index) => (
                <div key={index} className={styles.inputGroup}>
                  <label>Offer Type</label>
                  <input
                    type="text"
                    value={offer.offerType}
                    onChange={(e) => handleOfferChange(index, "offerType", e.target.value)}
                  />

                  <label>Discount (%)</label>
                  <input
                    type="number"
                    value={offer.discount}
                    onChange={(e) => handleOfferChange(index, "discount", e.target.value)}
                  />

                  <label>Valid Until</label>
                  <input
                    type="date"
                    value={offer.validUntil}
                    onChange={(e) => handleOfferChange(index, "validUntil", e.target.value)}
                  />

                  <button onClick={() => handleRemoveOffer(index)} className={styles.deleteButton}>
                    Remove Offer
                  </button>
                </div>
              ))
            ) : (
              <p>No offers added yet</p>
            )}

            <button onClick={handleAddOffer} className={styles.button}>
              Add Offer
            </button>


            </div>

            <button onClick={handleUpdateItem} className={styles.button}>
              Update
            </button>
          </>
        )}
      </ModalPopup>
    </div>
  );
};

export default ManageMenu;
