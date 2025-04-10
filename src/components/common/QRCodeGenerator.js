import React from 'react';
import QRCode from 'qrcode.react';

const QRCodeGenerator = ({ value }) => {
  return (
    <div className="qr-code">
      <QRCode value={value} />
    </div>
  );
};

export default QRCodeGenerator;
