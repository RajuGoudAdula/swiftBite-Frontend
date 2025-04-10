import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchColleges } from '../../store/slices/collegeSlice';
import { fetchCanteensByCollege, addCanteen, updateCanteen, deleteCanteen } from '../../store/slices/canteenSlice';
import ModalPopup from '../../components/common/ModalPopup';
import styles from '../../styles/ManageCanteens.module.css';

const ManageCanteens = () => {
  const dispatch = useDispatch();
  const { colleges, loading: collegesLoading } = useSelector(state => state.college);
  const { canteens = [], loading: canteensLoading } = useSelector(state => state.canteen || {});

  const [selectedCollege, setSelectedCollege] = useState(null);
  const [expandedCollege, setExpandedCollege] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    bankDetails: { accountNumber: '', bankName: '', ifsc: '' },
    menuItems: [],
    orders: [],
    status: 'active',
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    dispatch(fetchColleges());
  }, [dispatch]);

  const handleSelectCollege = (collegeId) => {
    setSelectedCollege(collegeId);
    dispatch(fetchCanteensByCollege(collegeId));
    
    if (isMobile) {
      setExpandedCollege(expandedCollege === collegeId ? null : collegeId);
    }
  };

  const handleOpenModal = (canteen = null) => {
    if (canteen) {
      setFormData({ ...canteen, bankDetails: canteen.bankDetails || { accountNumber: '', bankName: '', ifsc: '' } });
      setEditMode(true);
    } else {
      setFormData({ name: '', email: '', password: '', phone: '', bankDetails: { accountNumber: '', bankName: '', ifsc: '' }, menuItems: [], orders: [], status: 'active' });
      setEditMode(false);
    }
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('bankDetails.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({ ...prev, bankDetails: { ...prev.bankDetails, [key]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    if (!selectedCollege) return;

    if (editMode) {
      dispatch(updateCanteen({ 
        collegeId: selectedCollege, 
        canteenId: formData._id, 
        canteenData: formData 
      }));
    } else {
      dispatch(addCanteen({ 
        collegeId: selectedCollege, 
        canteenData: formData 
      }));
    }

    setModalOpen(false);
  };

  const handleDelete = (canteenId) => {
    if (window.confirm('Are you sure you want to delete this canteen?')) {
      dispatch(deleteCanteen({collegeId: selectedCollege, canteenId}));
    }
  };

  return (
    <div className={isMobile ? styles.mobileContainer : styles.desktopContainer}>
      {!isMobile && (
        <div className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Colleges</h2>
          {collegesLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
            </div>
          ) : (
            <div className={styles.collegeList}>
              {colleges.map(college => (
                <div 
                  key={college._id} 
                  className={`${styles.collegeCard} ${selectedCollege === college._id ? styles.selected : ''}`} 
                  onClick={() => handleSelectCollege(college._id)}
                >
                  <div className={styles.collegeIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3L1 9L12 15L23 9L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5 13V19L12 23L19 19V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className={styles.collegeInfo}>
                    <h3 className={styles.collegeName}>{college.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className={isMobile ? styles.mobileMainContent : styles.desktopMainContent}>
        {isMobile ? (
          <>
            <h2 className={styles.mobileTitle}>Colleges</h2>
            {collegesLoading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
              </div>
            ) : (
              <div className={styles.mobileCollegeList}>
                {colleges.map(college => (
                  <div key={college._id} className={styles.mobileCollegeItem}>
                    <div 
                      className={`${styles.mobileCollegeHeader} ${expandedCollege === college._id ? styles.expanded : ''}`}
                      onClick={() => handleSelectCollege(college._id)}
                    >
                      <div className={styles.mobileCollegeName}>
                        <div className={styles.collegeIcon}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 3L1 9L12 15L23 9L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5 13V19L12 23L19 19V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <h3>{college.name}</h3>
                      </div>
                      <div className={styles.chevron}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    
                    {expandedCollege === college._id && (
                      <div className={styles.mobileCanteenSection}>
                        <div className={styles.mobileCanteenHeader}>
                          <h3>Canteens</h3>
                          <button onClick={() => handleOpenModal()} className={styles.mobileAddButton}>
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8 1V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              <path d="M1 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            Add
                          </button>
                        </div>
                        
                        {canteensLoading ? (
                          <div className={styles.loading}>
                            <div className={styles.spinner}></div>
                          </div>
                        ) : (
                          <div className={styles.mobileCanteenList}>
                            {canteens.map(canteen => (
                              <div key={canteen._id} className={styles.mobileCanteenCard}>
                                <div className={styles.mobileCanteenHeader}>
                                  <h4>{canteen.name}</h4>
                                  <span className={`${styles.statusBadge} ${canteen.status === 'active' ? styles.active : styles.inactive}`}>
                                    {canteen.status}
                                  </span>
                                </div>
                                <div className={styles.mobileCanteenDetails}>
                                  <div className={styles.detailRow}>
                                    <svg className={styles.icon} viewBox="0 0 24 24">
                                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                    </svg>
                                    <span>{canteen.email}</span>
                                  </div>
                                  <div className={styles.detailRow}>
                                    <svg className={styles.icon} viewBox="0 0 24 24">
                                      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                                    </svg>
                                    <span>{canteen.phone}</span>
                                  </div>
                                </div>
                                <div className={styles.mobileCanteenActions}>
                                  <button 
                                    onClick={() => handleOpenModal(canteen)} 
                                    className={styles.editButton}
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(canteen._id)} 
                                    className={styles.deleteButton}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className={styles.header}>
              <h2 className={styles.title}>Canteens</h2>
              {selectedCollege && (
                <button onClick={() => handleOpenModal()} className={styles.addButton}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 1V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M1 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Add Canteen
                </button>
              )}
            </div>
            
            {canteensLoading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
              </div>
            ) : (
              <div className={styles.canteenGrid}>
                {canteens.map(canteen => (
                  <div key={canteen._id} className={styles.canteenCard}>
                    <div className={styles.canteenHeader}>
                      <h3 className={styles.canteenName}>{canteen.name}</h3>
                      <span className={`${styles.statusBadge} ${canteen.status === 'active' ? styles.active : styles.inactive}`}>
                        {canteen.status}
                      </span>
                    </div>
                    <div className={styles.canteenDetails}>
                      <div className={styles.detailRow}>
                      <svg className={styles.icon} viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                        <span>{canteen.email}</span>
                      </div>
                      <div className={styles.detailRow}>
                       <svg className={styles.icon} viewBox="0 0 24 24">
                        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                       </svg>
                        <span>{canteen.phone}</span>
                      </div>
                    </div>
                    <div className={styles.canteenActions}>
                      <button 
                        onClick={() => handleOpenModal(canteen)} 
                        className={styles.editButton}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(canteen._id)} 
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <ModalPopup isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>{editMode ? 'Edit Canteen' : 'Add Canteen'}</h3>
            <div className={styles.formGroup}>
              <label>Canteen Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className={styles.inputField}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                className={styles.inputField}
              />
            </div>
            {!editMode && (
              <div className={styles.formGroup}>
                <label>Password</label>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  className={styles.inputField}
                />
              </div>
            )}
            <div className={styles.formGroup}>
              <label>Phone</label>
              <input 
                type="text" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                className={styles.inputField}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Bank Account Number</label>
              <input 
                type="text" 
                name="bankDetails.accountNumber" 
                value={formData.bankDetails.accountNumber} 
                onChange={handleChange} 
                className={styles.inputField}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Bank Name</label>
              <input 
                type="text" 
                name="bankDetails.bankName" 
                value={formData.bankDetails.bankName} 
                onChange={handleChange} 
                className={styles.inputField}
              />
            </div>
            <div className={styles.formGroup}>
              <label>IFSC Code</label>
              <input 
                type="text" 
                name="bankDetails.ifsc" 
                value={formData.bankDetails.ifsc} 
                onChange={handleChange} 
                className={styles.inputField}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Status</label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange}
                className={styles.selectField}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className={styles.modalActions}>
              <button 
                onClick={handleSubmit} 
                className={styles.primaryButton}
              >
                {editMode ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </ModalPopup>
      </div>
    </div>
  );
};

export default ManageCanteens;