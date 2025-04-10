import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchColleges, addCollege, updateCollege, deleteCollege } from '../../store/slices/collegeSlice';
import ModalPopup from '../../components/common/ModalPopup';
import styles from '../../styles/ManageColleges.module.css';
// import { PlusIcon } from '@heroicons/react/24/solid'; // Import the plus icon

const ManageColleges = () => {
  const dispatch = useDispatch();
  const { colleges, loading, error } = useSelector(state => state.college);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    status: 'active'
  });

  useEffect(() => {
    dispatch(fetchColleges());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenModal = (college = null) => {
    if (college) {
      setFormData(college);
      setEditMode(true);
    } else {
      setFormData({
        name: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        status: 'active'
      });
      setEditMode(false);
    }
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (editMode) {
      dispatch(updateCollege({ collegeData: formData }));
    } else {
      dispatch(addCollege(formData));
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this college?')) {
      dispatch(deleteCollege(id));
    }
  };

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Manage Colleges</h2>
      
      <div className={styles.collegeList}>
        {colleges.map(college => (
          <div key={college._id} className={styles.collegeCard}>
            <div className={styles.collegeInfo}>
              <h3 className={styles.collegeName}>{college.name}</h3>
              <p className={styles.collegeAddress}>{college.address}, {college.city}, {college.state} {college.zip}</p>
              <span className={`${styles.statusBadge} ${college.status === 'active' ? styles.active : styles.inactive}`}>
                {college.status}
              </span>
            </div>
            <div className={styles.actionButtons}>
              <button 
                onClick={() => handleOpenModal(college)} 
                className={styles.editButton}
                aria-label="Edit college"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(college._id)} 
                className={styles.deleteButton}
                aria-label="Delete college"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => handleOpenModal()} 
        className={styles.fab}
        aria-label="Add new college"
      >
        <div >
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 100 100" fill="none">
                <rect x="20" y="48" width="60" height="4" rx="2" fill="#7BD3EA" />
                <rect x="48" y="20" width="4" height="60" rx="2" fill="#7BD3EA" />
          </svg>
        </div>
      </button>

      {/* Modal Form */}
      <ModalPopup
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editMode ? 'Edit College' : 'Add College'}
        onConfirm={handleSubmit}
      >
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>College Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.formInput}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={styles.formInput}
            required
          />
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={styles.formInput}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={styles.formInput}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Zip Code</label>
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              className={styles.formInput}
              required
            />
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={styles.formInput}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button 
                onClick={() => handleSubmit()} 
                className={styles.editButton}
                aria-label="Edit college"
              >
                Add
              </button>
      </ModalPopup>
    </div>
  );
};

export default ManageColleges;