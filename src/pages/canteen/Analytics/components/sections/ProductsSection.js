import React from 'react';
import StatCard from '../Cards/StatCard';
import ChartCard from '../Cards/ChartCard';
import { FiPackage, FiShoppingCart, FiDollarSign, FiStar } from 'react-icons/fi';
import BarChart from '../Charts/BarLineChart';
import ScatterChartComponent from '../Charts/ScatterChartComponent';

const ProductsSection = ({ loading, productsData }) => {
  const productStats = [
    {
      label: 'Total Products',
      value: productsData.totalProducts?.value,
      change: productsData.totalProducts?.change,
      icon: <FiPackage />
    },
    {
      label: 'Products Sold',
      value: productsData.productsSold?.value,
      change: productsData.productsSold?.change,
      icon: <FiShoppingCart />
    },
    {
      label: 'Top Product Revenue',
      value: `$${productsData.topProductRevenue?.value || 0}`,
      change: productsData.topProductRevenue?.change || 0,
      icon: <FiDollarSign />
    },
    {
      label: 'Avg. Rating',
      value: `${productsData.avgRating?.value || 0}/5`,
      change: productsData.avgRating?.change || 0,
      icon: <FiStar />
    }
  ];

  return (
    <div className="tab-content">
      <div className="stats-grid">
        {productStats.map((stat, index) => (
          <StatCard key={index} stat={stat} loading={loading} />
        ))}
      </div>

      <div className="chart-container">
        <ChartCard title="Top Selling Products">
          <BarChart 
            data={productsData.topSelling} 
            loading={loading}
            showTypeToggle={false}
          />
        </ChartCard>

        <ChartCard title="Product Performance">
          <ScatterChartComponent 
            data={productsData.performance} 
            loading={loading}
          />
        </ChartCard>
      </div>
    </div>
  );
};

export default ProductsSection;