import React, { useEffect, useState } from 'react';
import { Table, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import { TextField, Box, Typography, Button } from '@mui/material';


const api = process.env.REACT_APP_ROOT_API

const Analytics = () => {
  // 
  let currentDate = new Date()
  let tomorrowDate = new Date();
  tomorrowDate.setDate(currentDate.getDate() + 1);
  currentDate = currentDate.toISOString("YYYY-mm-dd").slice(0,10)
  tomorrowDate= tomorrowDate.toISOString("YYYY-mm-dd").slice(0,10)

  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(tomorrowDate);
  const [key, setKey] = useState(0);  // Create a key state

  const [summaryData, setSummaryData] = useState({});
  const [cones, setCones] = useState([]);
  const [sundaes, setSundaes] = useState([]);
  const [monthlyEarnings, setMonthlyEarnings] = useState([]);

  useEffect(() => {
    // Fetch summary data
    axios.get(addDateFilter(`${api}/analytics/summary`))
      .then(response => {
        setSummaryData(response.data);
      })
      .catch(error => console.error('Error fetching summary data:', error));


    // Fetch cones data
    axios.get(addDateFilter(`${api}/analytics/cone`))
      .then(response => {
        setCones(response.data);
      })
      .catch(error => console.error('Error fetching cones data:', error));

    // Fetch sundaes data
    axios.get(addDateFilter(`${api}/analytics/sundae`))
      .then(response => {
        setSundaes(response.data);
      })
      .catch(error => console.error('Error fetching sundaes data:', error));

    // Fetch monthly earnings data
    axios.get(addDateFilter(`${api}/analytics/monthly_earnings`))
      .then(response => {
        setMonthlyEarnings(response.data.data);
      })
      .catch(error => console.error('Error fetching monthly earnings data:', error));
  }, [startDate, endDate]);

  const calculateTotalEarnings = (items) => {
    return items.reduce((acc, curr) => acc + curr.total_earnings, 0).toFixed(2);
  };

  const addDateFilter = (url) => {
    if(startDate != '' && endDate != ''){
      url = `${url}?start_date=${startDate}&end_date=${endDate}`
    }
    else if(startDate != '' && endDate == ''){
      url = `${url}?start_date=${startDate}`
    }
    else if(startDate == '' && endDate != '') {
      url = `${url}?end_date=${endDate}`
    }
    else if(startDate == '' && endDate == '') {
      url = `${url}`
    }
    return url
  }

  const handleClear = () => {
    setStartDate('')
    setEndDate('')
  }

  return (
    <Box
      sx={{
        margin: 1,
        padding: 1,
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Select Date Range
      </Typography>
      <Box
        display="flex"
      >
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          style={{ paddingRight: '12px' }}

        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button
        variant="outlined"
        color="primary"
        onClick={handleClear}
      >
        Clear Dates
      </Button>
      </Box>
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
    </Box>

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