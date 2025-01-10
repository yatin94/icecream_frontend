import React from 'react';

function IceCreamButton({ flavor, onSale }) {
  return (
    <button
      onClick={() => onSale(flavor, 1)}  // Increment the count by 1 on each click
      style={{ width: '150px', height: '150px', margin: '10px', fontSize: '20px', position: 'relative' }}
    >
      {flavor}
    </button>
  );
}

export default IceCreamButton;