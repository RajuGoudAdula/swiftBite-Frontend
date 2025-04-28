import React from 'react';
import StatCard from '../Cards/StatCard';
import ChartCard from '../Cards/ChartCard';
import { FiStar, FiUser, FiPackage } from 'react-icons/fi';
import RatingDistributionChart from '../Charts/RatingDistributionChart';
import ReviewsTable from '../Tables/ReviewsTable';
import styles from '../../../../../styles/CanteenDashboard.module.css'

const ReviewsSection = ({ loading, reviewsData, setReviewsData }) => {
  

  const reviewStats = [
    {
      label: 'Total Reviews',
      value: reviewsData?.totalReviews,
      change: 0,
      icon: <FiStar />
    },
    {
      label: 'Average Rating',
      value: reviewsData?.averageRating || 0,
      change: 0,
      icon: <FiStar />
    },
    {
      label: 'Most Active Reviewer',
      value: `${reviewsData?.mostActiveReviewer?.name}(${reviewsData?.mostActiveReviewer?.email})`   ,
      change: 0,
      icon: <FiUser />
    },
    {
      label: 'Most Reviewed Product',
      value: `${reviewsData?.mostReviewedProduct?.name}(#${reviewsData?.mostReviewedProduct?._id})`,
      change: 0,
      icon: <FiPackage />
    }
  ];

  return (
    <div className="tab-content">
      <div className={styles.statsGrid}>
        {reviewStats.map((stat, index) => (
          <StatCard key={index} stat={stat} loading={loading} />
        ))}
      </div>

      <div className="chart-container">
        <ChartCard title="Rating Distribution">
          <RatingDistributionChart 
            data={[
              { name: '5 Stars', value: reviewsData?.allReviews?.filter(r => r.rating === 5).length },
              { name: '4 Stars', value: reviewsData?.allReviews?.filter(r => r.rating === 4).length },
              { name: '3 Stars', value: reviewsData?.allReviews?.filter(r => r.rating === 3).length },
              { name: '2 Stars', value: reviewsData?.allReviews?.filter(r => r.rating === 2).length },
              { name: '1 Star', value: reviewsData?.allReviews?.filter(r => r.rating === 1).length },
            ]} 
            loading={loading}
          />
        </ChartCard>

        <ChartCard title="Customer Reviews">
          <ReviewsTable 
            data={reviewsData.allReviews} 
            loading={loading}
            setReviewsData={setReviewsData}
          />
        </ChartCard>
      </div>
    </div>
  );
};

export default ReviewsSection;