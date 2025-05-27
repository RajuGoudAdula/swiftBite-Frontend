import React, { useState } from 'react';
import styles from '../../styles/CanteenFeedbackForm.module.css';
import { useSelector } from 'react-redux';
import userApi from '../../api/userApi';

const CanteenFeedbackForm = () => {
  const { user } = useSelector((state) => state.auth || {});

  const [formData, setFormData] = useState({
    userName: user?.username || '',
    email: user?.email || '',
    canteenName: user?.canteen?.name + ', ' + user?.college?.name || '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    const userId = user?.id;
    const canteenId = user?.canteen?._id;

    try {
      await userApi.sendCanteenFeedback(userId, canteenId, formData);
      setSuccessMsg('Feedback submitted successfully. Thank you!');
      setFormData((prev) => ({ ...prev, subject: '', message: '' }));
    } catch (error) {
      setErrorMsg('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Canteen Feedback</h2>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label htmlFor="userName">User Name</label>
            <input
              id="userName"
              type="text"
              name="userName"
              value={formData.userName}
              readOnly
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              readOnly
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label htmlFor="canteenName">Canteen Name</label>
            <input
              id="canteenName"
              type="text"
              name="canteenName"
              value={formData.canteenName}
              readOnly
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Enter feedback subject"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className={styles.textareaGroup}>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your feedback here..."
            required
            disabled={loading}
          ></textarea>
        </div>

        {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
        {successMsg && <p className={styles.successMsg}>{successMsg}</p>}

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default CanteenFeedbackForm;
