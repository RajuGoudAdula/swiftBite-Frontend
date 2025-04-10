import React from 'react';

const Badge = ({ status }) => {
  const color = {
    pending: 'yellow',
    delivered: 'green',
    cancelled: 'red'
  };

  return (
    <span className={`badge ${color[status]}`}>
      {status.toUpperCase()}
    </span>
  );
};

export default Badge;
