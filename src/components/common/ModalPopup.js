import React from 'react';
import Modal from 'react-modal';
import styles from '../../styles/ModalPopup.module.css';

const ModalPopup = ({ 
  isOpen = false, 
  title = '', 
  children, 
  buttons = [],
  onClose,
  closeOnOverlayClick = true
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={closeOnOverlayClick}
      ariaHideApp={false}
      className={styles.modal}
      overlayClassName={styles.overlay}
      role="dialog"
    >
      <div className={styles.modalHeader}>
        <h2 className={styles.modalTitle}>{title}</h2>
        <button 
          onClick={onClose} 
          className={styles.closeButton}
          aria-label="Close modal"
        >
          &times;
        </button>
      </div>
      
      <div className={styles.modalBody}>
        {children}
      </div>
      
      {buttons.length > 0 && (
        <div className={styles.modalFooter}>
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={button.onClick}
              className={`${styles.button} ${styles[button.variant || 'secondary']}`}
              disabled={button.disabled}
            >
              {button.label}
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default ModalPopup;