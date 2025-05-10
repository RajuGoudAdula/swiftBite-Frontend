import { useState } from 'react';
import styles from '../../styles/ContactForm.module.css';
import { useSelector } from 'react-redux';
import userApi from '../../api/userApi';

const StudentContactForm = () => {
  const { user } = useSelector((state) => state.auth || {});
  const [name, setName] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      userId: user?.id,
      userName: name,
      userEmail: email,
      subject: subject.trim(),
      message: message.trim(),
      userRole: user?.role,
    };

    try {
      setLoading(true);
      const response = await userApi.sendContactMessage(data);
      if (response?.data?.success) {
        setSuccessMessage("Thanks for reaching out! 🎉 Your message has been received by the SwiftBite team. We'll get back to you as soon as possible — usually within 24 hours.");
        setSubject('');
        setMessage('');
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.insideContainer}>
        <h2>Contact SwiftBite Support</h2>
        <p className={styles.subtitle}>
          Have a question or issue? We're here to help!
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input type="text" placeholder="Full Name" required value={name} disabled />
          <input type="email" placeholder="Email" required value={email} disabled />
          <input
            type="text"
            placeholder="Subject"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <textarea
            placeholder="Your Message"
            rows="5"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? 'Sending...' : 'Submit'}
          </button>
        </form>

        {successMessage && (
          <div className={styles.successMessage}>
            <p>{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className={styles.errorMessage}>
            <p>{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentContactForm;
