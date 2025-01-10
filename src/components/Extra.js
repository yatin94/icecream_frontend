import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Form } from 'react-bootstrap';

const Extras = () => {
  const [types, setTypes] = useState([]);
  const [flavors, setFlavors] = useState([]);
  const [newTypeName, setNewTypeName] = useState('');
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [sizes, setSizes] = useState([]);
    const [newSizeName, setNewSizeName] = useState('');
    const [selectedTypeFlavorForSize, setSelectedTypeFlavorForSize] = useState('');
    const [newSizeCost, setNewSizeCost] = useState('');
  const api = process.env.REACT_APP_ROOT_API

  useEffect(() => {
    fetchFlavors();
    fetchTypes();
    fetchSizes();
  }, []);

  const fetchFlavors = () => {
    fetch(`${api}/flavors?all=True`)
      .then(response => response.json())
      .then(data => setFlavors(data))
      .catch(error => console.error('Error fetching flavors:', error));
  };

  const fetchTypes = () => {
    fetch(`${api}/types`)
      .then(response => response.json())
      .then(data => setTypes(data))
      .catch(error => console.error('Error fetching types:', error));
  };

  const fetchSizes = () => {
    fetch(`${api}/sizes`)
      .then(response => response.json())
      .then(data => setSizes(data))
      .catch(error => console.error('Error fetching sizes:', error));
  };

  const handleAddType = (e) => {
    e.preventDefault();
    const body = { type: newTypeName, flavor_id: selectedFlavor };
    fetch(`${api}/types`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    .then(() => {
      fetchTypes(); // Refresh types list
      setNewTypeName(''); // Reset form
    })
    .catch(error => console.error('Error adding type:', error));
  };

  const handleAddSize = (e) => {
    e.preventDefault();
    let [flavor_id, type_id] = selectedTypeFlavorForSize.split("-")
    console.log(selectedTypeFlavorForSize)
    const body = {
      name: newSizeName,
      ice_cream_type_id: type_id,
      flavor_id: flavor_id,
      price: newSizeCost
    };
    console.log(body)
    fetch(`${api}/sizes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    .then(() => {
      fetchSizes(); // Refresh sizes list
      setNewSizeName(''); // Reset form fields
      setSelectedTypeFlavorForSize('');
      setNewSizeCost('');
    })
    .catch(error => console.error('Error adding size:', error));
  };

  
  const handleDeleteType = (id) => {
    fetch(`${api}/types/${id}`, { method: 'DELETE' })
      .then(() => fetchTypes())
      .catch(error => console.error('Error deleting type:', error));
  };

  const handleDeleteSize = (id) => {
    fetch(`${api}/sizes/${id}`, { method: 'DELETE' })
      .then(() => fetchSizes())
      .catch(error => console.error('Error deleting size:', error));
  };
  

  return (
    <Container fluid className="p-0" style={{ height: '100vh' }}>
      <Row className="g-0 h-100">
        <Col xs={12} md={6} className="d-flex flex-column">
          <h2 className="mt-2 mb-4">Types</h2>
          <Form onSubmit={handleAddType} className="mb-3">
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Flavor</Form.Label>
              <Form.Control
                as="select"
                value={selectedFlavor}
                onChange={(e) => setSelectedFlavor(e.target.value)}
                required
              >
                <option value="">Select a flavor</option>
                {flavors.map(flavor => (
                  <option key={flavor.id} value={flavor.id}>{flavor.flavor_name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button type="submit">Add Type</Button>
          </Form>
          <Table striped bordered hover size="sm" className="flex-grow-1">
            <thead>
              <tr>
                <th>Name</th>
                <th>Flavor</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {types.map(type => (
                <tr key={type.id}>
                  <td>{type.type}</td>
                  <td>{flavors.find(flavor => flavor.id === type.flavor_id)?.flavor_name}</td>
                  <td>
                    <Button variant="danger" onClick={() => handleDeleteType(type.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        {/* Placeholder for Sizes Table */}
        <Col xs={12} md={6} className="d-flex flex-column">
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
    {/* <Form.Group>
      <Form.Label>Flavor</Form.Label>
      <Form.Control
        as="select"
        value={selectedFlavorForSize}
        onChange={(e) => setSelectedFlavorForSize(e.target.value)}
        required
      >
        <option value="">Select a flavor</option>
        {flavors.map(flavor => (
          <option key={flavor.id} value={flavor.id}>{flavor.name}</option>
        ))}
      </Form.Control>
    </Form.Group> */}
    <Form.Group>
      <Form.Label>Flavor Type</Form.Label>
      <Form.Control
        as="select"
        value={selectedTypeFlavorForSize}
        onChange={(e) => setSelectedTypeFlavorForSize(e.target.value)}
        required
      >
        <option value="">Select a type</option>
        {types.map(type => (
          <option key={type.id} value={`${type.flavor_id}-${type.id}`}>{flavors.find(flavor => flavor.id === type.flavor_id)?.flavor_name} {type.type} </option>
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
        <th>Type</th>
        <th>Cost</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {sizes.map(size => (
        <tr key={size.id}>
          <td>{size.name}</td>
          <td>{flavors.find(flavor => flavor.id === size.flavor_id)?.flavor_name}</td>
          <td>{types.find(type => type.id === size.ice_cream_type_id)?.type}</td>
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