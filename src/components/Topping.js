import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, ListGroup, ListGroupItem } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';

function ManageToppings() {
  const [toppingName, setToppingName] = useState('');
  const [pricePerScoop, setPricePerScoop] = useState('');
  const [toppings, setToppings] = useState([]);
  const [notification, setNotification] = useState('');
  const api = process.env.REACT_APP_ROOT_API

  useEffect(() => {
    fetchToppings();
  }, []);

  const fetchToppings = async () => {
    try {
      const response = await fetch(`${api}/toppings`);
      const data = await response.json();
      console.log(data)
      console.log("data")
      setToppings(data);
    } catch (error) {
      console.error('Failed to fetch toppings:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${api}/toppings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: toppingName,
          price_per_scoop: parseFloat(pricePerScoop),
          id: null
        })
      });
      if (response.ok) {
        setNotification('Topping added successfully!');
        setToppingName('');
        setPricePerScoop('');
        fetchToppings(); // Refresh the list of toppings
      } else {
        throw new Error('Failed to add topping');
      }
    } catch (error) {
      setNotification('Error: ' + error.message);
    }
    setTimeout(() => setNotification(''), 3000);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${api}/toppings/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setNotification('Topping deleted successfully!');
        fetchToppings(); // Refresh the list after deletion
      } else {
        throw new Error('Failed to delete topping');
      }
    } catch (error) {
      setNotification('Error: ' + error.message);
    }
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Topping Name</Form.Label>
          <Form.Control
            type="text"
            value={toppingName}
            onChange={(e) => setToppingName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Price Per Scoop</Form.Label>
          <Form.Control
            type="number"
            value={pricePerScoop}
            onChange={(e) => setPricePerScoop(e.target.value)}
            required
            step="0.01"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
        {notification && <Alert variant="info" className="mt-3">{notification}</Alert>}
      </Form>

      
      <Table striped bordered hover className="mt-4">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Price Per Scoop</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>

      {toppings.map(topping => (
        <tr>
          <td>{topping.id}</td>
          <td>{topping.name}</td>
          <td>{topping.price_per_scoop}</td>
          <td><Button variant="danger" onClick={() => handleDelete(topping.id)} className="float-right">
              Delete
            </Button></td>
        </tr>
        ))}
      </tbody>
    </Table>


      <ListGroup className="mt-4">
        
      </ListGroup>
    </div>
  );
}

export default ManageToppings;