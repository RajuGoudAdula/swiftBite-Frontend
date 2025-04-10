import React from 'react';

const LoadingErrorHandler = ({ loading, error, data, children }) => {
  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error.message || "An error occurred"}</p>;
  if (!data || data.length === 0) return <p>No data available.</p>;

  return children;
};

export default LoadingErrorHandler;
