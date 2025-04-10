import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,Cell } from 'recharts';
import styles from '../../../../../styles/Analytics.module.css';

const COLORS = ['#007aff', '#34c759', '#ff9500', '#ff2d55', '#5856d6'];

const ScatterChartComponent = ({ data, loading }) => {
  if (loading) {
    return <div className={`${styles.skeleton} ${styles.chartSkeleton}`} />;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid />
        <XAxis type="number" dataKey="sales" name="Sales" unit="units" />
        <YAxis type="number" dataKey="revenue" name="Revenue" unit="$" />
        <ZAxis type="number" dataKey="rating" name="Rating" range={[50, 300]} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend />
        <Scatter name="Products" data={data} fill="#007aff">
          {data?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default ScatterChartComponent;