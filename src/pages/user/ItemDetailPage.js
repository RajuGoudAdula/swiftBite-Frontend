import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaPepperHot, FaClock, FaFire, FaLeaf, FaCarrot, FaDrumstickBite, FaSeedling , FaStar, FaRegStar, FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import userApi from "../../api/userApi";
import styles from "../../styles/ItemDetailPage.module.css";
import { addToast } from "../../store/slices/toastSlice";

const ItemDetailPage = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await userApi.getItemDetails(itemId);
        console.log(response.data)
        setItem(response.data);
      } catch (err) {
        setError("Failed to fetch item details");
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [itemId]);

  const getSpiceIcons = (level) => {
    const spiceLevels = {
      "Mild": 1,
      "Medium": 2,
      "Hot": 3,
      "Very Hot": 4,
    };

    const spiceCount = spiceLevels[level] || 0;

    return Array.from({ length: spiceCount }).map((_, index) => (
      <FaPepperHot key={index} className={styles.spiceIcon} />
    ));
  };

  const renderRating = (rating) => {
    return (
      <div className={styles.ratingStars}>
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? 
            <FaStar key={star} className={styles.starFilled} /> : 
            <FaRegStar key={star} className={styles.starEmpty} />
        ))}
      </div>
    );
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      dispatch(addToast({
              id: Date.now(),
              type: 'warning',
              message: 'Please login to add items to your cart',
              duration: 3000,
            })).then(()=>{
              navigate("/login");
            });
      return;
    }

    dispatch(addToCart({
      userId: user.id,
      data :{
        itemId: item.item._id,
        quantity: 1,
      }
    })).then(()=>{
      dispatch(addToast({
              id: Date.now(),
              type: 'success',
              message: `${item.item.name} added to cart`,
              duration: 3000,
            }));
    }).then(()=>{
      navigate("/cart");
    });

  };

  const handleLike = async (productId, reviewId) => {
    if (!isAuthenticated) {
      dispatch(addToast({
        id: Date.now(),
        type: 'warning',
        message: `Please login to add items to your cart`,
        duration: 3000,
      })).then(()=>{
        navigate("/login");
      });
      return;
    }

    try {
      const response = await userApi.likeReview(productId, reviewId, user.id);

      setItem((prevItem) => ({
        ...prevItem,
        reviews: prevItem.reviews.map((review) =>
          review._id === reviewId
            ? {
                ...review,
                likes: response.data.likes,
                dislikes: response.data.userDisliked ? review.dislikes - 1 : review.dislikes,
                userLiked: true,
                userDisliked: false,
              }
            : review
        ),
      }));
    } catch (err) {
      dispatch(addToast({
        id: Date.now(),
        type: 'error',
        message: `Failed to like the review.`,
        duration: 3000,
      }))
    }
  };

  const handleDislike = async (productId, reviewId) => {
    if (!isAuthenticated) {
      dispatch(addToast({
        id: Date.now(),
        type: 'warning',
        message: 'Please login to add items to your cart',
        duration: 3000,
      })).then(()=>{
        navigate("/login");
      });
      return;
    }

    try {
      const response = await userApi.disLikeReview(productId, reviewId, user.id);

      setItem((prevItem) => ({
        ...prevItem,
        reviews: prevItem.reviews.map((review) =>
          review._id === reviewId
            ? {
                ...review,
                dislikes: response.data.dislikes,
                likes: response.data.userLiked ? review.likes - 1 : review.likes,
                userLiked: false,
                userDisliked: true,
              }
            : review
        ),
      }));
    } catch (err) {
      dispatch(addToast({
        id: Date.now(),
        type: 'error',
        message: 'Failed to dislike the review.',
        duration: 3000,
      }));
    }
  };

  function formatDate(isoDateString) {
    const date = new Date(isoDateString);
  
    const options = {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    };
  
    return date.toLocaleDateString('en-GB', options); 
  }

  if (loading) return <p className={styles.loading}>Loading item details...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!item) return <p className={styles.notFound}>No item found.</p>;

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero}>
        {/* <div className={styles.heroContent}> */}
          <div className={styles.imageWrapper}>
            <img 
              src={item.product.image} 
              alt={item.product.name} 
              className={styles.productImage} 
            />
          </div>
          
          <div className={styles.productMeta}>
            <div>
              <div className={`${styles.availabilityTag} ${item.item.isAvailable ? styles.inStock : styles.outOfStock}`}>
                {item.item.isAvailable ? 'In Stock' : 'Out of Stock'}
              </div>
              
              <h1 className={styles.productTitle}>{item.product.name}</h1>
              <p className={styles.netWeight}>1 {item.product.unit} . {item.product.netWeight}</p>
              <div className={styles.priceContainer}>
                <span className={styles.currentPrice}>₹{item.item.price}</span>
                {item.item.offers.length > 0 && (
                  <span className={styles.originalPrice}>₹{item.item.price + item.item.offers[0].discount}</span>
                )}
              </div>
              
              {item.item.offers.length > 0 && (
                <div className={styles.offerTag}>
                  <FaFire className={styles.offerIcon} />
                  <span>Save ₹{item.item.offers[0].discount} ({item.item.offers[0].offerType})</span>
                </div>
              )}
              
              <div className={styles.deliveryInfo}>
                <FaClock className={styles.deliveryIcon} />
                <span>Prepared in {item.item.preparationTime} mins</span>
              </div>
              
              {item.product.tags.includes("Spicy") && (
                <div className={styles.spiceIndicator}>
                  <div className={styles.spiceIcons}>
                    {getSpiceIcons("Hot")}
                  </div>
                  <span>Spicy</span>
                </div>
              )}
              <div className={styles.desktopAddToCartSection}>
              <button 
                className={styles.addToCart}
                onClick={handleAddToCart}
                disabled={!item.item.isAvailable}
              >
                Add to Bag
              </button>
              </div>
            </div>
            <div>
            <div className={styles.mobileAddToCartSection}>
              <button 
                className={styles.addToCart}
                onClick={handleAddToCart}
                disabled={!item.item.isAvailable}
              >
                Add to Cart
              </button>
              </div>
            </div>
          </div>
        {/* </div> */}
      </div>

      {/* Product Details */}
      <div className={styles.detailsSection}>
        <h2 className={styles.sectionTitle}>About This Dish</h2>
        <p className={styles.productDescription}>{item.product.description}</p>
      </div>

      {/* Tags
      <div className={styles.detailsSection}>
        <h2 className={styles.sectionTitle}>Tags</h2>
        <div className={styles.tagsContainer}>
          {item.product.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div> */}

      {/* Nutrition */}
      {item.product.nutritionalInfo && (
        <div className={styles.detailsSection}>
          <h2 className={styles.sectionTitle}>Nutritional Information</h2>
          <div className={styles.nutritionGrid}>
            {Object.entries(item.product.nutritionalInfo).map(([key, value]) => (
              <div key={key} className={styles.nutritionItem}>
                <span className={styles.nutritionValue}>{value}g</span>
                <span className={styles.nutritionLabel}>{key}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ingredients */}
      {item.product.ingredients.length > 0 && (
        <div className={styles.detailsSection}>
          <h2 className={styles.sectionTitle}>Ingredients</h2>
          <div className={styles.ingredientsGrid}>
            {item.product.ingredients.map((ingredient, index) => (
              <div key={index} className={styles.ingredientItem}>
                {ingredient === 'Rice' && <FaLeaf className={styles.ingredientIcon} />}
                {ingredient === 'Chicken' && <FaDrumstickBite className={styles.ingredientIcon} />}
                {ingredient === 'Onions' && <FaCarrot className={styles.ingredientIcon} />}
                {ingredient === 'Ghee' && <FaSeedling  className={styles.ingredientIcon} />}
                {!['Rice', 'Chicken', 'Onions', 'Ghee'].includes(ingredient) && 
                  <FaLeaf className={styles.ingredientIcon} />}
                <span>{ingredient}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Allergens */}
      {item.product.allergens.length > 0 && item.product.allergens[0] !== '' && (
        <div className={styles.detailsSection}>
          <h2 className={styles.sectionTitle}>Allergens</h2>
          <div className={styles.tagsContainer}>
            {item.product.allergens.map((allergen, index) => (
              <span key={index} className={`${styles.tag} ${styles.allergenTag}`}>
                {allergen}
              </span>
            ))}
          </div>
        </div>
      )}


      {/* Reviews */}
      <div className={styles.detailsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Customer Reviews</h2>
          {item.reviews.length > 0 && (
            <div className={styles.ratingSummary}>
              {renderRating(
                Math.round(
                  item.reviews.reduce((acc, review) => acc + review.rating, 0) / 
                  item.reviews.length
                )
              )}
              <span>({item.reviews.length} reviews)</span>
            </div>
          )}
        </div>
        
        {item.reviews.length > 0 ? (
          <div className={styles.reviewsGrid}>
            {item.reviews.map((review) => (
              <div key={review._id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <span className={styles.reviewer}><FaUserCircle size={45} color="#007AFF" /></span>
                  <div className={styles.reviewDetails}>
                    <span className={styles.reviewerName}>{review.user.name}</span>
                    <span className={styles.reviewRating}>
                      {renderRating(review.rating)}
                    </span>
                  </div>
                </div>

                <div className={styles.reviewSection}>
                  <span className={styles.reviewText}>{review.review}</span>
                  <span className={styles.reviewDate}>{formatDate(review.createdAt)}</span>
                </div>
                
                
                {review.canteenResponse.text && (
                  <div className={styles.canteenResponse}>
                    <div className={styles.responseLabel}>Canteen Response:</div>
                    <span className={styles.canteenResponseText}>{review.canteenResponse.text}</span>
                    <span className={styles.reviewDate}>{formatDate(review?.canteenResponse?.respondedAt)}</span>
                  </div>
                )}
                 <div className={styles.reviewActions}>
                    <button 
                      className={`${styles.actionButton} ${review.userLiked ? styles.active : ''}`}
                      onClick={() => handleLike(item.product._id, review._id)}
                    >
                      <span>👍</span> {review.likes}
                    </button>
                    <button 
                      className={`${styles.actionButton} ${review.userDisliked ? styles.active : ''}`}
                      onClick={() => handleDislike(item.product._id, review._id)}
                    >
                      <span>👎</span> {review.dislikes}
                    </button>
                  </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noReviews}>No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
};

export default ItemDetailPage;