import React, { useState } from 'react';
import styles from '../../../../../styles/Analytics.module.css';

const ResponseForm = ({ 
  reviewId, 
  onSubmit, 
  onCancel,
  initialValue = '' 
}) => {
  const [response, setResponse] = useState(initialValue);

  const handleSubmit = () => {
    onSubmit(reviewId, response);
  };

  return (
    <div className={styles.responseForm}>
      <textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder="Type your response here..."
        className={styles.responseInput}
      />
      <div className={styles.responseButtons}>
        <button 
          onClick={handleSubmit}
          className={styles.submitButton}
        >
          Submit
        </button>
        <button 
          onClick={onCancel}
          className={styles.cancelButton}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ResponseForm;