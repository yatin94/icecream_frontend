import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Form } from 'react-bootstrap';

const Extras = () => {
  const [flavors, setFlavors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [newSizeName, setNewSizeName] = useState('');
  const [selectedFlavorForSize, setSelectedFlavorForSize] = useState('');
  const [newSizeCost, setNewSizeCost] = useState('');
  const api = process.env.REACT_APP_ROOT_API

  useEffect(() => {
    fetchFlavors();
    fetchSizes();
  }, []);

  const fetchFlavors = () => {
    fetch(`${api}/flavors?all=True`)
      .then(response => response.json())
      .then(data => setFlavors(data))
      .catch(error => console.error('Error fetching flavors:', error));
  };


  const fetchSizes = () => {
    fetch(`${api}/sizes`)
      .then(response => response.json())
      .then(data => setSizes(data))
      .catch(error => console.error('Error fetching sizes:', error));
  };



  const handleAddSize = (e) => {
    e.preventDefault();
    let flavor_id = selectedFlavorForSize
    console.log("sizeee")
    console.log(flavor_id)
    const body = {
      name: newSizeName,
      flavor_id: flavor_id,
      price: newSizeCost
    };
    fetch(`${api}/sizes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    .then(() => {
      fetchSizes(); // Refresh sizes list
      setNewSizeName(''); // Reset form fields
      setSelectedFlavorForSize('');
      setNewSizeCost('');
    })
    .catch(error => console.error('Error adding size:', error));
  };

  

  const handleDeleteSize = (id) => {
    fetch(`${api}/sizes/${id}`, { method: 'DELETE' })
      .then(() => fetchSizes())
      .catch(error => console.error('Error deleting size:', error));
  };
  

  return (
    <Container fluid className="p-0" style={{ height: '100vh' }}>
      <Row className="g-0 h-100">
        {/* Placeholder for Sizes Table */}
        <Col xs={12} md={12} className="d-flex flex-column">
  <h2 className="mt-2 mb-4">Sizes</h2>
  <Form onSubmit={handleAddSize} className="mb-3">
    <Form.Group>
      <Form.Label>Size Name</Form.Label>
      <Form.Control
        type="text"
        value={newSizeName}
        onChange={(e) => setNewSizeName(e.target.value)}
        required
      />
    </Form.Group>
    <Form.Group>
      <Form.Label>Flavor</Form.Label>
      <Form.Control
        as="select"
        value={selectedFlavorForSize}
        onChange={(e) => setSelectedFlavorForSize(e.target.value)}
        required
      >
        <option value="">Select a Flavor</option>
        {flavors.map(flavor => (
          <option key={flavor.id} value={`${flavor.id}`}>{flavor.flavor_name} </option>
        ))}
      </Form.Control>
    </Form.Group>
    <Form.Group>
      <Form.Label>Cost</Form.Label>
      <Form.Control
        type="number"
        value={newSizeCost}
        onChange={(e) => setNewSizeCost(e.target.value)}
        required
      />
    </Form.Group>
    <Button type="submit">Add Size</Button>
  </Form>
  <Table striped bordered hover size="sm" className="flex-grow-1">
    <thead>
      <tr>
        <th>Name</th>
        <th>Flavor</th>
        <th>Cost</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {sizes.map(size => (
        <tr key={size.id}>
          <td>{size.name}</td>
          <td>{flavors.find(flavor => flavor.id === size.flavor_id)?.flavor_name}</td>
          <td>${size.price.toFixed(2)}</td>
          <td>
            <Button variant="danger" onClick={() => handleDeleteSize(size.id)}>Delete</Button>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
</Col>
      </Row>
    </Container>
  );
};

export default Extras;