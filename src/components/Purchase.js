import React, { useState, useEffect } from 'react';
import './Purchase.css';

function Purchase() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [purchases, setPurchases] = useState([]);
    const [totalCost, setTotalCost] = useState('');
    const api = process.env.REACT_APP_ROOT_API

    useEffect(() => {
      fetchPurchases();
      }, []);

      const fetchPurchases = async () => {
        try {
          const response = await fetch(`${api}/purchases`);
          const data = await response.json();
          console.log(data)
          console.log("data")
          setPurchases(data);
        } catch (error) {
          console.error('Failed to fetch toppings:', error);
        }
      };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const purchase = {
        name,
        price_per_unit: parseFloat(price),
        quantity: parseInt(quantity, 10),
        total_cost: parseFloat(totalCost),
      };
      
      const response = await fetch(`${api}/purchases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(purchase)
      });
      if (response.ok) {
        fetchPurchases(); // Refresh the list of toppings
      } 
      
      setName('');
      setPrice('');
      setQuantity('');
      setTotalCost('');
    };


  const handleDelete = async (id) => {
    const response = await fetch(`${api}/purchases/${id}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      fetchPurchases(); // Refresh the list after deletion
    } else {
      throw new Error('Failed to delete topping');
    }
  };

  const handleTotalCost = () => {
    setTotalCost((price * quantity).toFixed(2));
  };

  return (
    <div className="container">
      <h2 className="heading">Purchase Entry</h2>
      <form onSubmit={handleSubmit} className="form">
      <input type="text" placeholder="Name" value={name} className='input' onChange={e => setName(e.target.value)} required />
      <input type="number" placeholder="Price per Unit" value={price} className='input' onChange={e => setPrice(e.target.value)} required />
      <input type="number" placeholder="Quantity" value={quantity} className='input' onChange={e => setQuantity(e.target.value)} required />
      <input type="text" placeholder="Total Cost" value={totalCost} className='input' onClick={handleTotalCost} readOnly />
      <button type="submit" className='button'>Add Purchase</button>
      </form>

      <h2 className="heading">Purchase History</h2>
      <table className="table">
        <thead>
          <tr className="tr">
            <th className="th">Name</th>
            <th className="th">Quantity</th>
            <th className="th">Price Per Unit</th>
            <th className="th">Total Price</th>
            <th className="th">Date of Purchase</th>
            <th className="th">Action</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((purchase, index) => (
            <tr key={index} className="tr">
              <td className="td">{purchase.name}</td>
              <td className="td">{purchase.quantity}</td>
              <td className="td">PHP {purchase.price_per_unit}</td>
              <td className="td">PHP {purchase.total_cost}</td>
              <td className="td">{purchase.created_at}</td>
              <td className="td">
                <button onClick={() => handleDelete(purchase.id)} className="button deleteButton">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Purchase;