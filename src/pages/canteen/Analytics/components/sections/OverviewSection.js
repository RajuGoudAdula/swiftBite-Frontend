// src/pages/canteen/Analytics/sections/OverviewSection.js
import StatCard from '../Cards/StatCard';
import ChartCard from '../Cards/ChartCard';
import BarLineChart from '../Charts/BarLineChart';
import PieChartComponent from '../Charts/PieChartComponent';

const OverviewSection = ({ loading, stats, chartData, pieData, timeRange, setTimeRange }) => {
  return (
    <>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} loading={loading} />
        ))}
      </div>

      <div className="chart-container">
        <ChartCard title="Weekly Performance">
          <BarLineChart 
            data={chartData} 
            loading={loading} 
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
        </ChartCard>

        <ChartCard title="Traffic Sources">
          <PieChartComponent data={pieData} loading={loading} />
        </ChartCard>
      </div>
    </>
  );
};

export default OverviewSection;