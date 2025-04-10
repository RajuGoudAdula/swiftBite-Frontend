// src/pages/canteen/Analytics/components/Charts/BarLineChart.js
import { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import styles from '../../../../../styles/Analytics.module.css';

const BarLineChart = ({ data, loading, timeRange, setTimeRange }) => {
  const [chartType, setChartType] = useState('bar');

  if (loading) {
    return <div className={`${styles.skeleton} ${styles.chartSkeleton}`} />;
  }

  return (
    <>
      <div className={styles.chartControls}>
        <select 
          className={styles.timeRangeSelect} 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
        <div className={styles.chartTypeToggle}>
          <button 
            className={`${styles.chartTypeButton} ${chartType === 'bar' ? styles.active : ''}`} 
            onClick={() => setChartType('bar')}
          >
            Bars
          </button>
          <button 
            className={`${styles.chartTypeButton} ${chartType === 'line' ? styles.active : ''}`} 
            onClick={() => setChartType('line')}
          >
            Lines
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        {chartType === 'bar' ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="orders" fill="#007aff" radius={[4, 4, 0, 0]} />
            <Bar dataKey="revenue" fill="#34c759" radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="orders" stroke="#007aff" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="revenue" stroke="#34c759" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="users" stroke="#ff9500" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </>
  );
};

export default BarLineChart;