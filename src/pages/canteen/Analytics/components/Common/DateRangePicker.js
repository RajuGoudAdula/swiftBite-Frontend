import styles from '../../../../../styles/Analytics.module.css';

const DateRangePicker = ({ startDate, endDate, setStartDate, setEndDate }) => (
  <div className={styles.dateInputContainer}>
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
  </div>
);

export default DateRangePicker;