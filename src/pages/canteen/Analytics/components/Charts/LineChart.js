import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from '../../../../../styles/Analytics.module.css';

const LineChart = ({ data, loading, showTypeToggle = true, onTypeChange }) => {
  if (loading) {
    return <div className={`${styles.skeleton} ${styles.chartSkeleton}`} />;
  }

  return (
    <>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="total" 
            stroke="#007aff" 
            strokeWidth={2} 
            dot={{ r: 4 }} 
            name="Total Users"
          />
          <Line 
            type="monotone" 
            dataKey="new" 
            stroke="#34c759" 
            strokeWidth={2} 
            dot={{ r: 4 }} 
            name="New Users"
          />
          <Line 
            type="monotone" 
            dataKey="active" 
            stroke="#ff9500" 
            strokeWidth={2} 
            dot={{ r: 4 }} 
            name="Active Users"
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default LineChart;