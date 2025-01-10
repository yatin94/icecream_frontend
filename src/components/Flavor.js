import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Form, Button, Alert, InputGroup, FormControl, Row, Col, Tabs, Tab } from 'react-bootstrap';


function AddFlavor() {
  const [flavorName, setFlavorName] = useState('');
  const [activeKey, setActiveKey] = React.useState('cone'); // 'cone' is selected by default
  const [sundaePrices, setSundaePrices] = React.useState({ small: 0, medium: 0, large: 0 });
  const [conePrices, setConePrices] = React.useState({ small: 0, medium: 0, large: 0 });
  const [flavors, setFlavors] = useState([]);
  const [notification, setNotification] = useState('');
  const api = process.env.REACT_APP_ROOT_API

  useEffect(() => {
    fetchFlavors();
  }, []);


  const fetchFlavors = async () => {
    try {
      const response = await fetch(`${api}/flavors?all=True`);
      const data = await response.json();
      setFlavors(data);
    } catch (error) {
      console.error('Failed to fetch flavors:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${api}/flavors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          flavor_name: flavorName,
          types: {
            sundae: sundaePrices,
            cone: conePrices
          }
        })
      });
      if (response.ok) {
        setNotification('Flavor added successfully!');
        setFlavorName('');
        fetchFlavors(); // Refresh the list of flavors
      } else {
        throw new Error('Failed to add flavor');
      }
    } catch (error) {
      setNotification('Error: ' + error.message);
    }
    setTimeout(() => setNotification(''), 3000);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${api}/flavors/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setNotification('Flavor deleted successfully!');
        fetchFlavors(); // Refresh the list after deletion
      } else {
        throw new Error('Failed to delete flavor');
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
    <Form.Label>Flavor Name</Form.Label>
    <Form.Control
      type="text"
      value={flavorName}
      onChange={(e) => setFlavorName(e.target.value)}
      required
    />
  </Form.Group>

  <Tabs
    activeKey={activeKey}
    onSelect={(k) => setActiveKey(k)}
    className="mb-3"
  >
    <Tab eventKey="sundae" title="Sundae">
      <Row>
        {['small', 'medium', 'large'].map((size) => (
          <Col key={size}>
            <InputGroup className="mb-3">
              <InputGroup.Text>{size.charAt(0).toUpperCase() + size.slice(1)}</InputGroup.Text>
              <FormControl 
                type="text"
                value={sundaePrices[size]}
                onChange={(e) => setSundaePrices({...sundaePrices, [size]: e.target.value})}
              />
            </InputGroup>
          </Col>
        ))}
      </Row>
    </Tab>
    <Tab eventKey="cone" title="Cone">
      <Row>
        {['small', 'medium', 'large'].map((size) => (
          <Col key={size}>
            <InputGroup className="mb-3">
              <InputGroup.Text>{size.charAt(0).toUpperCase() + size.slice(1)}</InputGroup.Text>
              <FormControl 
                type="text"
                value={conePrices[size]}
                onChange={(e) => setConePrices({...conePrices, [size]: e.target.value})}
              />
            </InputGroup>
          </Col>
        ))}
      </Row>
    </Tab>
  </Tabs>

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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>

          {flavors.map(flavor => (
            <tr>
              <td>{flavor.id}</td>
              <td>{flavor.flavor_name}</td>
              <td><Button variant="danger" onClick={() => handleDelete(flavor.id)} className="float-right">
                Delete
              </Button></td>
            </tr>
          ))}
        </tbody>
      </Table>

    </div>
  );
}

export default AddFlavor;