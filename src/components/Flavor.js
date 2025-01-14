import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Form, Button, Alert, InputGroup, FormControl, Row, Col, Tabs, Tab, FormCheck } from 'react-bootstrap';


function AddFlavor() {
  const [flavorName, setFlavorName] = useState('');
  const [activeKey, setActiveKey] = React.useState('cone'); // 'cone' is selected by default
  const [prices, setPrices] = React.useState({ small: 0, medium: 0, large: 0 });
  const [coneFlavors, setConeFlavors] = useState([]);
  const [sundaeFlavors, setSundaeFlavors] = useState([]);
  const [isSundae, setIsSundae] = useState('false')
  const [notification, setNotification] = useState('');
  const [typeName, setTypeName] = useState("Cone")
  const api = process.env.REACT_APP_ROOT_API

  useEffect(() => {
    fetchFlavors();
  }, []);

  const fetchConeFlavors = async () => {
    try {
      const response = await fetch(`${api}/flavors?all=True&type=cone`);
      const data = await response.json();
      setConeFlavors(data);
    } catch (error) {
      console.error('Failed to fetch flavors:', error);
    }
  }

  const fetchSundaeFlavors = async () => {
    try {
      const response = await fetch(`${api}/flavors?all=True&type=sundae`);
      const data = await response.json();
      setSundaeFlavors(data);
    } catch (error) {
      console.error('Failed to fetch flavors:', error);
    }
  }

  const fetchFlavors = async () => {
    await fetchSundaeFlavors()
    await fetchConeFlavors()
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
          sizes: prices,
          sundae: isSundae
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

  const handleSundaeCheckboxChange = () => {
    if( isSundae == "true"){
      setTypeName("Cone")
      setIsSundae("false")
    }else{
      setTypeName("Sundae")
      setIsSundae("true")
    }
  }

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
    <Tab eventKey="cone" title={typeName}>
      <Row>
        {['small', 'medium', 'large'].map((size) => (
          <Col key={size}>
            <InputGroup className="mb-3">
              <InputGroup.Text>{size.charAt(0).toUpperCase() + size.slice(1)}</InputGroup.Text>
              <FormControl 
                type="text"
                value={prices[size]}
                onChange={(e) => setPrices({...prices, [size]: e.target.value})}
              />
            </InputGroup>
          </Col>
        ))}
      </Row>
    </Tab>
  </Tabs>
  
  <FormCheck id="custom-checkbox" label="Is Sundae" checked={isSundae == "false"?false:true} onChange={handleSundaeCheckboxChange} className='mb-3'></FormCheck>

  <Button variant="primary" type="submit">
    Submit
  </Button>
  {notification && <Alert variant="info" className="mt-3">{notification}</Alert>}
</Form>
        <h3>Cones</h3>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Is Sundae</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>

          {coneFlavors.map(flavor => (
            <tr>
              <td>{flavor.id}</td>
              <td>{flavor.flavor_name}</td>
              <td>{flavor.is_sundae == 1? 'YES':'NO'}</td>
              <td><Button variant="danger" onClick={() => handleDelete(flavor.id)} className="float-right">
                Delete
              </Button></td>
            </tr>
          ))}
        </tbody>
      </Table>
          <h3>Sundaes</h3>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Is Sundae</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>

          {sundaeFlavors.map(flavor => (
            <tr>
              <td>{flavor.id}</td>
              <td>{flavor.flavor_name}</td>
              <td>{flavor.is_sundae == 1? 'YES':'NO'}</td>
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