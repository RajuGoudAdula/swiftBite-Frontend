import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PhoneAuth from "../auth/PhoneAuth";
import ModalPopup from "../../components/common/ModalPopup";
import styles from '../../styles/EditProfile.module.css';
import { fetchColleges, fetchCanteens } from '../../store/slices/collegeSlice';
import { addCollegeCanteen } from '../../store/slices/authSlice';
import { 
  fetchProfile, 
  updateProfileField, 
  sendEmailOtp, 
  verifyEmailOtp, 
  verifyPassword, 
  updatePassword 
} from "../../store/slices/profileSlice";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { userProfile, emailOtpSent } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.auth || {});
  const { colleges = [], canteens = [] } = useSelector((state) => state.college || {});

  // Modal states
  const [activeModal, setActiveModal] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [emailOtpSentForNewEmail, setEmailOtpSentForNewEmail] = useState(false);
  const [otpVerifiedForNewEmail, setOtpVerifiedForNewEmail] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [error, setError] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedCanteen, setSelectedCanteen] = useState("");

  useEffect(() => {
    if (user) {
      dispatch(fetchProfile({ userId: user.id }));
      dispatch(fetchColleges());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (selectedCollege) {
      dispatch(fetchCanteens(selectedCollege));
    }
  }, [selectedCollege, dispatch]);

  const closeModal = () => {
    setActiveModal(null);
    setInputValue("");
    setNewEmail("");
    setOtp("");
    setOtpVerified(false);
    setEmailOtpSentForNewEmail(false);
    setOtpVerifiedForNewEmail(false);
    setCurrentPassword("");
    setNewPassword("");
    setPasswordVerified(false);
    setError("");
    setSelectedCollege("");
    setSelectedCanteen("");
  };

  // Email OTP handling
  const handleSendOtp = (email) => {
    dispatch(sendEmailOtp({ email, userId: user.id }))
      .then(() => {
        if (email === userProfile?.user?.email) {
          // setOtpVerified(true);
          console.log("Email otp ....",emailOtpSent);
        } else {
          setEmailOtpSentForNewEmail(true);
        }
      })
      .catch((err) => setError(err.message));
  };

  const handleVerifyOtp = (email) => {
    dispatch(verifyEmailOtp({ email, otp, userId: user.id }))
      .then((response) => {
        if (response.payload?.success) {
          if (email === userProfile?.user?.email) {
            setOtpVerified(true);
          } else {
            setOtpVerifiedForNewEmail(true);
          }
        }
      })
      .catch((err) => setError(err.message))
      .finally(setOtp(""));
  };

  // Password handling
  const handleVerifyPassword = () => {
    if (!currentPassword) {
      setError("Please enter your current password");
      return;
    }
    
    dispatch(verifyPassword({ userId: user.id, password: currentPassword }))
      .then((response) => {
        if (response.payload?.success) {
          setPasswordVerified(true);
          setError("");
        } else {
          setError("Incorrect password. Please try again.");
        }
      })
      .catch((err) => setError(err.message));
  };

  const handleUpdatePassword = () => {
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    dispatch(updatePassword({ 
      userId: user.id, 
      newPassword, 
      oldPassword: currentPassword 
    }))
      .then(() => {
        alert("Password updated successfully!");
        closeModal();
        navigate('/profile');
      })
      .catch((err) => setError(err.message));
  };

  // College/Canteen handling
  const handleCollegeChange = (e) => {
    setSelectedCollege(e.target.value);
    setSelectedCanteen("");
  };

  const handleCanteenChange = (e) => {
    setSelectedCanteen(e.target.value);
  };

  const handleSaveCollegeCanteen = async () => {
    if (!selectedCollege || !selectedCanteen) {
      setError("Please select both college and canteen");
      return;
    }
    
    try{
      await  dispatch(addCollegeCanteen({
        userId: user.id,
        collegeId: selectedCollege,
        canteenId: selectedCanteen
      }));
      const updatedCollegeCanteen = await dispatch(fetchProfile({ userId: user.id }));
      // Update local storage if needed
      const userDetails = JSON.parse(localStorage.getItem("user"));
      if (userDetails) {
        userDetails.canteen = updatedCollegeCanteen.payload.user.canteen;
        userDetails.college = updatedCollegeCanteen.payload.user.college;
        localStorage.setItem("user", JSON.stringify(userDetails));
      }
      closeModal();
      // window.location.reload();
    }catch(error){
      setError(error.message || "Something went wrong");
    }
  };

  // Save field updates
  const handleSaveUsername = async () => {
    if (!inputValue.trim()) {
      setError("Username cannot be empty");
      return;
    }
  
    try {
      await dispatch(updateProfileField({ 
        field: "name", 
        value: inputValue, 
        userId: user.id 
      }));
  
      // Update local storage if needed
      const userDetails = JSON.parse(localStorage.getItem("user"));
      if (userDetails) {
        userDetails.username = inputValue;
        localStorage.setItem("user", JSON.stringify(userDetails));
      }
  
      await dispatch(fetchProfile({ userId: user.id }));
      closeModal();
  
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };
  

  const handleSaveEmail =async () => {
    if (!otpVerifiedForNewEmail) {
      setError("Please complete the email verification process");
      return;
    }
    try{

      await dispatch(updateProfileField({ 
        field: "email", 
        value: newEmail, 
        userId: user.id 
      }));

      // Update local storage if needed
      const userDetails = JSON.parse(localStorage.getItem("user"));
      if (userDetails) {
        userDetails.email = newEmail;
        localStorage.setItem("user", JSON.stringify(userDetails));
      }

      await dispatch(fetchProfile({ userId: user.id }));
      closeModal();

    }catch(error){
      setError(error.message || "Something went wrong");
    }
    
  };

  const renderUsernameModal = () => (
    <ModalPopup
      isOpen={activeModal === "username"}
      title="Edit Username"
      onClose={closeModal}
      buttons={[
        {
          label: 'Save',
          onClick: handleSaveUsername,
          variant: 'primary',
          disabled: !inputValue.trim()
        },
        {
          label: 'Cancel',
          onClick: closeModal,
          variant: 'secondary'
        }
      ]}
    >
      <input 
        type="text" 
        value={inputValue} 
        onChange={(e) => setInputValue(e.target.value)}
        className={styles.input}
        placeholder="Enter new username"
      />
      {error && <div className={styles.error}>{error}</div>}
    </ModalPopup>
  );

  const renderEmailModal = () => (
    <ModalPopup
      isOpen={activeModal === "email"}
      title="Edit Email"
      onClose={closeModal}
      buttons={getEmailModalButtons()}
    >
      {renderEmailModalContent()}
      {error && <div className={styles.error}>{error}</div>}
    </ModalPopup>
  );

  const getEmailModalButtons = () => {
    if (!otpVerified) {
      return emailOtpSent ? [
        {
          label: 'Verify OTP',
          onClick: () => handleVerifyOtp(userProfile?.user?.email),
          variant: 'primary',
          disabled: !otp
        }
      ] : [
        {
          label: 'Send OTP',
          onClick: () => handleSendOtp(userProfile?.user?.email),
          variant: 'primary'
        }
      ];
    } else if (!emailOtpSentForNewEmail) {
      return [
        {
          label: 'Send OTP to New Email',
          onClick: () => handleSendOtp(newEmail),
          variant: 'primary',
          disabled: !newEmail
        }
      ];
    } else if (!otpVerifiedForNewEmail) {
      return [
        {
          label: 'Verify New OTP',
          onClick: () => handleVerifyOtp(newEmail),
          variant: 'primary',
          disabled: !otp
        }
      ];
    } else {
      return [
        {
          label: 'Save Email',
          onClick: handleSaveEmail,
          variant: 'primary'
        },
        {
          label: 'Cancel',
          onClick: closeModal,
          variant: 'secondary'
        }
      ];
    }
  };

  const renderEmailModalContent = () => {
    if (!otpVerified) {
      return (
        <>
          <p>Verify your current email first</p>
          {emailOtpSent && (
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className={styles.input}
            />
          )}
        </>
      );
    } else if (!emailOtpSentForNewEmail) {
      return (
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="Enter new email"
          className={styles.input}
        />
      );
    } else if (!otpVerifiedForNewEmail) {
      return (
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter new email OTP"
          className={styles.input}
        />
      );
    }else if(otpVerifiedForNewEmail){
      return(
        <p>OTP verified successfully.Click on save to update email.</p>
      )
    }
    return null;
  };

  const renderPhoneModal = () => (
    <ModalPopup
      isOpen={activeModal === "phone"}
      title={userProfile?.user?.phone ? "Update Phone" : "Add Phone"}
      onClose={closeModal}
      closeOnOverlayClick={false}
    >
      <PhoneAuth 
        onSave={() => {
          dispatch(fetchProfile({ userId: user.id }));
          closeModal();
        }} 
        onCancel={closeModal} 
      />
    </ModalPopup>
  );

  const renderPasswordModal = () => (
    <ModalPopup
      isOpen={activeModal === "password"}
      title="Change Password"
      onClose={closeModal}
      buttons={getPasswordModalButtons()}
    >
      {!passwordVerified ? (
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current password"
          className={styles.input}
        />
      ) : (
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
          className={styles.input}
        />
      )}
      {error && <div className={styles.error}>{error}</div>}
    </ModalPopup>
  );

  const getPasswordModalButtons = () => {
    if (!passwordVerified) {
      return [
        {
          label: 'Verify',
          onClick: handleVerifyPassword,
          variant: 'primary',
          disabled: !currentPassword
        }
      ];
    } else {
      return [
        {
          label: 'Update Password',
          onClick: handleUpdatePassword,
          variant: 'primary',
          disabled: !newPassword
        },
        {
          label: 'Cancel',
          onClick: closeModal,
          variant: 'secondary'
        }
      ];
    }
  };

  const renderCollegeCanteenModal = () => (
    <ModalPopup
      isOpen={activeModal === "college-canteen"}
      title="Select College & Canteen"
      onClose={closeModal}
      buttons={[
        {
          label: 'Save',
          onClick: handleSaveCollegeCanteen,
          variant: 'primary',
          disabled: !selectedCollege || !selectedCanteen
        },
        {
          label: 'Cancel',
          onClick: closeModal,
          variant: 'secondary'
        }
      ]}
    >
      <div className={styles.formGroup}>
        <label>College:</label>
        <select
          value={selectedCollege}
          onChange={handleCollegeChange}
          className={styles.select}
        >
          <option value="">Select College</option>
          {colleges.map(college => (
            <option key={college._id} value={college._id}>
              {college.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCollege && (
        <div className={styles.formGroup}>
          <label>Canteen:</label>
          <select
            value={selectedCanteen}
            onChange={handleCanteenChange}
            className={styles.select}
          >
            <option value="">Select Canteen</option>
            {canteens.map(canteen => (
              <option key={canteen._id} value={canteen._id}>
                {canteen.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </ModalPopup>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Edit Profile</h1>
      </div>
      
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Account Information</h2>
        </div>
        
        {/* Username */}
        <div className={styles.field}>
          <div className={styles.fieldLabel}>
            <svg className={styles.icon} viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span>Username</span>
          </div>
          <div className={styles.fieldValue}>
            <span>{userProfile?.user?.name || "Not set"}</span>
            <button 
              className={styles.editButton} 
              onClick={() => setActiveModal("username")}
            >
              Edit
            </button>
          </div>
        </div>

        {/* Email */}
        <div className={styles.field}>
          <div className={styles.fieldLabel}>
            <svg className={styles.icon} viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <span>Email</span>
          </div>
          <div className={styles.fieldValue}>
            <span>{userProfile?.user?.email || "Not set"}</span>
            <button 
              className={styles.editButton} 
              onClick={() => setActiveModal("email")}
            >
              Edit
            </button>
          </div>
        </div>

        {/* Phone */}
        <div className={styles.field}>
          <div className={styles.fieldLabel}>
            <svg className={styles.icon} viewBox="0 0 24 24">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
            </svg>
            <span>Phone</span>
          </div>
          <div className={styles.fieldValue}>
            <span>{userProfile?.user?.phone || "Not set"}</span>
            <button 
              className={styles.editButton} 
              onClick={() => setActiveModal("phone")}
            >
              {userProfile?.user?.phone ? "Edit" : "Add"}
            </button>
          </div>
        </div>

        {/* College and Canteen */}
        <div className={styles.field}>
          <div className={styles.fieldLabel}>
            <svg className={styles.icon} viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span>Location</span>
          </div>
          <div className={styles.fieldValue}>
            <div className={styles.locationInfo}>
              <p><strong>College:</strong> {userProfile?.user?.college?.name || "Not selected"}</p>
              <p><strong>Canteen:</strong> {userProfile?.user?.canteen?.name || "Not selected"}</p>
            </div>
            <button 
              className={styles.editButton} 
              onClick={() => setActiveModal("college-canteen")}
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Security</h2>
        </div>
        
        {/* Password */}
        <div className={styles.field}>
          <div className={styles.fieldLabel}>
            <svg className={styles.icon} viewBox="0 0 24 24">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
            <span>Password</span>
          </div>
          <div className={styles.fieldValue}>
            <span>********</span>
            <button 
              className={styles.editButton} 
              onClick={() => setActiveModal("password")}
            >
              Change
            </button>
          </div>
        </div>
      </div>

      {/* Render all modals */}
      {renderUsernameModal()}
      {renderEmailModal()}
      {renderPhoneModal()}
      {renderPasswordModal()}
      {renderCollegeCanteenModal()}
    </div>
  );
};

export default EditProfile;