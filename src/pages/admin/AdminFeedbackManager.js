import React, { useEffect, useState } from 'react';
import styles from '../../styles/AdminFeedbackManager.module.css';
import adminApi from '../../api/adminApi';

const AdminFeedbackManager = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [responses, setResponses] = useState({});
  const [editMode, setEditMode] = useState({}); // Tracks which response is being edited

  useEffect(() => {
    fetchAllFeedbacks();
  }, []);

  const fetchAllFeedbacks = async () => {
    try {
      const res = await adminApi.getAllFeedbacks();
      setFeedbacks(res.data);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
    }
  };

  const handleResponseChange = (id, type, value) => {
    setResponses((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [type]: value,
      },
    }));
  };

  const sendResponse = async (feedbackId, type) => {
    try {
      const message = responses[feedbackId]?.[type];
      if (!message) return alert('Response message is empty');

      await adminApi.sendFeedbackResponse(feedbackId, type, message);
      alert(`${type === 'user' ? 'User' : 'Canteen'} response ${editMode[feedbackId]?.[type] ? 'updated' : 'sent'} successfully`);
      fetchAllFeedbacks();

      setEditMode((prev) => ({
        ...prev,
        [feedbackId]: {
          ...prev[feedbackId],
          [type]: false,
        },
      }));
    } catch (err) {
      console.error('Error sending response:', err);
    }
  };

  const startEditing = (feedbackId, type, existingMessage) => {
    setResponses((prev) => ({
      ...prev,
      [feedbackId]: {
        ...prev[feedbackId],
        [type]: existingMessage,
      },
    }));

    setEditMode((prev) => ({
      ...prev,
      [feedbackId]: {
        ...prev[feedbackId],
        [type]: true,
      },
    }));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>User Feedback Management</h2>

      {feedbacks.length === 0 ? (
        <p className={styles.empty}>No feedbacks submitted yet.</p>
      ) : (
        feedbacks.map((fb) => (
          <div key={fb._id} className={styles.card}>
            <div className={styles.info}>
              <p><strong>User:</strong> {fb.userName} ({fb.email})</p>
              <p><strong>Canteen:</strong> {fb.canteenName}</p>
              <p><strong>Subject:</strong> {fb.subject}</p>
              <p><strong>Message:</strong> {fb.message}</p>
            </div>

            {/* User Response */}
            <div className={styles.responseGroup}>
              <label>User Response</label>
              {fb.userResponseAdmin && !editMode[fb._id]?.user ? (
                <>
                  <p className={styles.previous}><strong>Previous:</strong> {fb.userResponseAdmin}</p>
                  <button onClick={() => startEditing(fb._id, 'user', fb.userResponseAdmin)}>Edit</button>
                </>
              ) : (
                <>
                  <textarea
                    rows="2"
                    value={responses[fb._id]?.user || ''}
                    onChange={(e) => handleResponseChange(fb._id, 'user', e.target.value)}
                    placeholder="Enter response for user"
                  />
                  <button onClick={() => sendResponse(fb._id, 'user')}>
                    {editMode[fb._id]?.user ? 'Update User Response' : 'Send to User'}
                  </button>
                </>
              )}
            </div>

            {/* Canteen Response */}
            <div className={styles.responseGroup}>
              <label>Canteen Response</label>
              {fb.canteenResponseAdmin && !editMode[fb._id]?.canteen ? (
                <>
                  <p className={styles.previous}><strong>Previous:</strong> {fb.canteenResponseAdmin}</p>
                  <button onClick={() => startEditing(fb._id, 'canteen', fb.canteenResponseAdmin)}>Edit</button>
                </>
              ) : (
                <>
                  <textarea
                    rows="2"
                    value={responses[fb._id]?.canteen || ''}
                    onChange={(e) => handleResponseChange(fb._id, 'canteen', e.target.value)}
                    placeholder="Enter response for canteen"
                  />
                  <button onClick={() => sendResponse(fb._id, 'canteen')}>
                    {editMode[fb._id]?.canteen ? 'Update Canteen Response' : 'Send to Canteen'}
                  </button>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminFeedbackManager;
