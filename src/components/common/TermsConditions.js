// TermsConditions.jsx
import styles from '../../styles/AboutUs.module.css';

const TermsConditions = () => {
  return (
    <div className={styles.container}>
        <div  className={styles.insideContainer}>
            <h1 className={styles.heading}>Terms & Conditions</h1>
            <p>
                By using SwiftBite, you agree to follow our platform’s guidelines. Orders once placed cannot be canceled after
                food preparation begins.
            </p>
            <p>
                Canteens are responsible for fulfilling orders on time. Users are responsible for collecting their food as per the pickup time.
            </p>
            <p>
                Misuse of the platform may lead to suspension. We reserve the right to change our terms at any time.
            </p>
        </div>
    </div>
  );
};

export default TermsConditions;
