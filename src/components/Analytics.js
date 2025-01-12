import React, { useEffect, useState } from 'react';
import { Table, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
const api = process.env.REACT_APP_ROOT_API

const Analytics = () => {
  const [summaryData, setSummaryData] = useState({});
  const [cones, setCones] = useState([]);
  const [sundaes, setSundaes] = useState([]);
  const [monthlyEarnings, setMonthlyEarnings] = useState([]);

  useEffect(() => {
    // Fetch summary data
    axios.get(`${api}/analytics/summary`)
      .then(response => {
        setSummaryData(response.data);
      })
      .catch(error => console.error('Error fetching summary data:', error));

    // Fetch cones data
    axios.get(`${api}/analytics/cone`)
      .then(response => {
        setCones(response.data);
      })
      .catch(error => console.error('Error fetching cones data:', error));

    // Fetch sundaes data
    axios.get(`${api}/analytics/sundae`)
      .then(response => {
        setSundaes(response.data);
      })
      .catch(error => console.error('Error fetching sundaes data:', error));

    // Fetch monthly earnings data
    axios.get(`${api}/analytics/monthly_earnings`)
    .then(response => {
      setMonthlyEarnings(response.data.data);
    })
    .catch(error => console.error('Error fetching monthly earnings data:', error));
  }, []);

  const calculateTotalEarnings = (items) => {
    return items.reduce((acc, curr) => acc + curr.total_earnings, 0).toFixed(2);
  };

  return (
    <div>
      <h1>Analytics Dashboard</h1>
      
      {/* Section 1: Summary Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Total Ice Creams Sold</th>
            <th>Total Sales Amount</th>
            <th>Total Expenses Amount</th>
            <th>Total Cones Sold</th>
            <th>Total Sundae Sold</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{summaryData.total_ice_creams_sold}</td>
            <td>PHP {summaryData.total_sales_amount}</td>
            <td>PHP {summaryData.total_expenses_amount}</td>
            <td>{summaryData.total_cones_sold}</td>
            <td>{summaryData.total_sundae_sold}</td>
          </tr>
        </tbody>
      </Table>
        <br></br>
      {/* Section 2: Tabs for Cones and Sundaes */}
      <Tabs defaultActiveKey="cones" id="product-tabs" className="mb-3">
        <Tab eventKey="cones" title="Cones" tabClassName="fw-bold text-primary">
          <ProductsTable products={cones} />
          <p className="fw-bold">Total Sales Amount: PHP {calculateTotalEarnings(cones)}</p>
        </Tab>
        <Tab eventKey="sundaes" title="Sundaes" tabClassName="fw-bold text-primary">
          <ProductsTable products={sundaes} />
          <p className="fw-bold">Total Sales Amount: PHP {calculateTotalEarnings(sundaes)}</p>
        </Tab>
      </Tabs>

      <br></br>

      {/* Section 3: Earnings Graph by Month */}
      <div>
        <h3>Monthly Earnings</h3>
        <Table striped bordered hover>
        <thead>
          <tr>
            <th>Month</th>
            <th>Expense</th>
            <th>Earnings</th>
            <th>Profits</th>
          </tr>
        </thead>
        <tbody>
          {monthlyEarnings.map((item, index) => (
            <tr key={index}>
              <td>{item.month}</td>
              <td>PHP {item.expense}</td>
              <td>PHP {item.earnings}</td>
              <td style={{ color: item.profit < 0 ? 'red' : 'green' }}>PHP {item.profit}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      </div>
    </div>
  );
};

const ProductsTable = ({ products }) => (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Flavor</th>
          <th>Size</th>
          <th>Count</th>
          <th>Total Earnings</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr key={index}>
            <td>{product.flavor}</td>
            <td>{product.size}</td>
            <td>{product.count}</td>
            <td>PHP {product.total_earnings}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

export default Analytics;