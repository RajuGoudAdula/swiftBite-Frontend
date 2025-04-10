import React from 'react';
import StatCard from '../Cards/StatCard';
import ChartCard from '../Cards/ChartCard';
import { FiStar, FiUser, FiPackage } from 'react-icons/fi';
import RatingDistributionChart from '../Charts/RatingDistributionChart';
import ReviewsTable from '../Tables/ReviewsTable';

const ReviewsSection = ({ loading, reviewsData, setReviewsData }) => {
  const calculateMostActive = (key) => {
    if (reviewsData.length === 0) return 'N/A';
    
    const counts = reviewsData.reduce((acc, review) => {
      acc[review[key]] = (acc[review[key]] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  };

  const reviewStats = [
    {
      label: 'Total Reviews',
      value: reviewsData.length,
      change: 0,
      icon: <FiStar />
    },
    {
      label: 'Average Rating',
      value: (reviewsData.reduce((acc, review) => acc + review.rating, 0) / reviewsData.length )|| 0,
      change: 0,
      icon: <FiStar />
    },
    {
      label: 'Most Active Reviewer',
      value: calculateMostActive('user'),
      change: 0,
      icon: <FiUser />
    },
    {
      label: 'Most Reviewed Product',
      value: calculateMostActive('product'),
      change: 0,
      icon: <FiPackage />
    }
  ];

  return (
    <div className="tab-content">
      <div className="stats-grid">
        {reviewStats.map((stat, index) => (
          <StatCard key={index} stat={stat} loading={loading} />
        ))}
      </div>

      <div className="chart-container">
        <ChartCard title="Rating Distribution">
          <RatingDistributionChart 
            data={[
              { name: '5 Stars', value: reviewsData.filter(r => r.rating === 5).length },
              { name: '4 Stars', value: reviewsData.filter(r => r.rating === 4).length },
              { name: '3 Stars', value: reviewsData.filter(r => r.rating === 3).length },
              { name: '2 Stars', value: reviewsData.filter(r => r.rating === 2).length },
              { name: '1 Star', value: reviewsData.filter(r => r.rating === 1).length },
            ]} 
            loading={loading}
          />
        </ChartCard>

        <ChartCard title="Customer Reviews">
          <ReviewsTable 
            data={reviewsData} 
            loading={loading}
            setReviewsData={setReviewsData}
          />
        </ChartCard>
      </div>
    </div>
  );
};

export default ReviewsSection;