import styles from '../../styles/SwiftBiteLoader.module.css';
import Lottie from 'lottie-react';
import animationData from "../../animations/Loader.json";

const SwiftBiteLoader = ({info}) => {
  return (
    <div className={styles.container}>
        <div className={styles.loader}>
        <div className={styles.animationWrapper}>
            <Lottie animationData={animationData} loop={true} style={{maxWidth:"500px" ,maxHeight:"500px" ,width:"250px",minWidth:"25%"}}/>
        </div>
        <p className={styles.loaderText}>{info}</p>
        </div>
    </div>
  );
};

export default SwiftBiteLoader;
