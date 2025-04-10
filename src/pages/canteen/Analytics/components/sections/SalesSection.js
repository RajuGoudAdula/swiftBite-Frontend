import React from 'react';
import StatCard from '../Cards/StatCard';
import ChartCard from '../Cards/ChartCard';
import { FiDollarSign, FiShoppingCart, FiTrendingUp, FiAward } from 'react-icons/fi';
import LineChart from '../Charts/BarLineChart';
import BarChart from '../Charts/BarLineChart';

const SalesSection = ({ loading, salesData }) => {
  const salesStats = [
    {
      label: 'Total Revenue',
      value: salesData.totalRevenue?.value,
      change: salesData.totalRevenue?.change,
      icon: <FiDollarSign />
    },
    {
      label: 'Total Orders',
      value: salesData.totalOrders?.value,
      change: salesData.totalOrders?.change,
      icon: <FiShoppingCart />
    },
    {
      label: 'Avg. Order Value',
      value: salesData.avgOrderValue?.value,
      change: salesData.avgOrderValue?.change,
      icon: <FiTrendingUp />
    },
    {
      label: 'Top Product',
      value: salesData.topProduct?.name || 'N/A',
      change: salesData.topProduct?.revenue || 0,
      icon: <FiAward />
    }
  ];

  return (
    <div className="tab-content">
      <div className="stats-grid">
        {salesStats.map((stat, index) => (
          <StatCard key={index} stat={stat} loading={loading} />
        ))}
      </div>

      <div className="chart-container">
        <ChartCard title="Sales Trend">
          <LineChart 
            data={salesData.trend} 
            loading={loading}
            showTypeToggle={false}
          />
        </ChartCard>

        <ChartCard title="Sales by Category">
          <BarChart 
            data={salesData.byCategory} 
            loading={loading}
            showTypeToggle={false}
          />
        </ChartCard>
      </div>
    </div>
  );
};

export default SalesSection;