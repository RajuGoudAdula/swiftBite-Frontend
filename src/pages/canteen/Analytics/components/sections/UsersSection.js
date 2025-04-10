import React from 'react';
import StatCard from '../Cards/StatCard';
import ChartCard from '../Cards/ChartCard';
import { FiUser, FiTrendingUp, FiShoppingCart, FiAward } from 'react-icons/fi';
import LineChart from '../Charts/BarLineChart';
import PieChartComponent from '../Charts/PieChartComponent';

const UsersSection = ({ loading, usersData }) => {
  const userStats = [
    {
      label: 'Total Users',
      value: usersData?.totalUsers?.value,
      change: usersData?.totalUsers?.change,
      icon: <FiUser />
    },
    {
      label: 'New Users',
      value: usersData?.newUsers?.value,
      change: usersData?.newUsers?.change,
      icon: <FiTrendingUp />
    },
    {
      label: 'Active Users',
      value: usersData?.activeUsers?.value,
      change: usersData?.activeUsers?.change,
      icon: <FiShoppingCart />
    },
    {
      label: 'Avg. Session',
      value: usersData?.avgSession?.value || '0m',
      change: usersData?.avgSession?.change || 0,
      icon: <FiAward />
    }
  ];

  return (
    <div className="tab-content">
      <div className="stats-grid">
        {userStats?.map((stat, index) => (
          <StatCard key={index} stat={stat} loading={loading} />
        ))}
      </div>

      <div className="chart-container">
        <ChartCard title="User Growth">
          <LineChart 
            data={usersData?.growth || []}
            loading={loading}
            showTypeToggle={false}
          />
        </ChartCard>

        {/* Only render PieChartComponent if data is valid */}
        <ChartCard title="User Demographics">
          {Array.isArray(usersData?.demographics) && usersData.demographics.length > 0 ? (
            <PieChartComponent 
              data={usersData.demographics} 
              loading={loading}
            />
          ) : (
            <p style={{ padding: '1rem' }}>No demographic data available</p>
          )}
        </ChartCard>
      </div>
    </div>
  );
};

export default UsersSection;
