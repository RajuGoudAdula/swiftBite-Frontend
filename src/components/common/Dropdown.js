import React from "react";
import styles from "../../styles/Dropdown.module.css";

const Dropdown = ({ label, options, value, onChange }) => {
  return (
    <div className={styles.dropdownContainer}>
      <label>{label}</label>
      <select value={value} onChange={onChange}>
        <option value="" disabled>
          Select {label}
        </option>
        {options.map((option) => (
          <option key={option._id} value={option._id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
