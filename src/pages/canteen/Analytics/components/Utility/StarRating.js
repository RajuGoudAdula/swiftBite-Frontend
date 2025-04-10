import React from 'react';

const StarRating = ({ rating }) => {
  return (
    <div style={{ display: 'flex' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            color: rating >= star ? '#ffb400' : '#ddd',
            fontSize: '1.2rem',
            marginRight: '2px'
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;