// PrivacyPolicy.jsx
import styles from '../../styles/AboutUs.module.css';

const PrivacyPolicy = () => {
  return (
    <div className={styles.container}>
        <div className={styles.insideContainer}>
            <h1 className={styles.heading}>Privacy Policy</h1>
            <p>
                At SwiftBite, your privacy is important to us. We collect minimal personal data such as your name, email, and
                order history to improve our services.
            </p>
            <p>
                We do not share or sell your information with third parties. All transactions are encrypted, and your data is
                stored securely.
            </p>
            <p>
                By using SwiftBite, you consent to our data practices. For any questions, please contact us at support@swiftbite.app.
            </p>
        </div>
    </div>
  );
};

export default PrivacyPolicy;
