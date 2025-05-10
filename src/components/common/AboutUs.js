// AboutUs.jsx
import styles from '../../styles/AboutUs.module.css';

const AboutUs = () => {
  return (
    <div className={styles.container}>
        <div className={styles.insideContainer}>
            <h1 className={styles.heading}>About SwiftBite</h1>
            <p>
                SwiftBite is a smart food ordering platform designed for college students and canteens.
                We help students order food in advance and collect it on time without waiting in queues.
            </p>
            <p>
                Our mission is to streamline the campus dining experience, reduce wait times, and improve canteen efficiency.
                Whether you're a student, a canteen vendor, or an administrator, SwiftBite makes food ordering simple and fast.
            </p>
        </div>
    </div>
  );
};

export default AboutUs;
