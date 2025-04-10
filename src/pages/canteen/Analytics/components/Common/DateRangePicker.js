// src/pages/canteen/Analytics/components/Common/DateRangePicker.js
import { FiCalendar, FiFilter } from 'react-icons/fi';
import styles from '../../../../../styles/Analytics.module.css';

const DateRangePicker = ({ startDate, endDate, setStartDate, setEndDate }) => (
  <div className={styles.dateInputContainer}>
    <FiCalendar className={styles.dateIcon} />
    <input 
      type="date" 
      value={startDate} 
      onChange={(e) => setStartDate(e.target.value)} 
      className={styles.dateInput} 
    />
    <span>to</span>
    <input 
      type="date" 
      value={endDate} 
      onChange={(e) => setEndDate(e.target.value)} 
      className={styles.dateInput} 
    />
    <FiFilter className={styles.filterIcon} />
  </div>
);

export default DateRangePicker;