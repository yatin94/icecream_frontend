import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container, Row, Alert, Col, Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS



function App() {
  const [billId, setBillId] = useState('');
  const [customerName, setCustomerName] = useState('Ice Cream Shop');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [coneFlavors, setConeFlavors] = useState([]);
  const [sundaeFlavors, setsundaeFlavors] = useState([]);
  const [paymentType, setPaymentType] = useState('');
  const [amountGiven, setAmountGiven] = useState('');
  const [selectedFlavor, setSelectedFlavor] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [notification, setNotification] = useState('');
  
  // Sample data structure for purchases. This would be managed by state in a real application.

  const api = process.env.REACT_APP_ROOT_API

  useEffect(() => {
    axios.get(`${api}/flavors?type=sundae`)
      .then(response => {
        setsundaeFlavors(response.data)
      })
      .catch(error => console.error('Error fetching flavors:', error));

    axios.get(`${api}/flavors?type=cone`)
      .then(response => {
        setConeFlavors(response.data)
      })
      .catch(error => console.error('Error fetching flavors:', error));
}, []);


  const handleConeFlavorSelect = (flavor, size) => {
    setSelectedFlavor(flavor);
    setSelectedType("Cone")
    setSelectedSize(size)
    addItemToBill(flavor, 'Cone', size, []);
  };

  const handleSundaeFlavorSelect = (flavor) => {
    setSelectedType('Sundae');
    setSelectedFlavor(flavor);
    axios.get(`${api}/sizes/${flavor.id}`)
      .then(response => {
        setSizes(response.data)
        setShowModal(true);
        if(response.data.length == 1){
          handleSizeSelect(response.data[0])
        }
      })
      .catch(error => console.error('Error fetching types:', error));
  };


  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    axios.get(`${api}/toppings`)
      .then(response => setToppings(response.data))
      .catch(error => console.error('Error fetching toppings:', error));
  };

  const handleSubmit = () => {
    addItemToBill(selectedFlavor, selectedType, selectedSize, selectedToppings);
    setShowModal(false);
    setSelectedSize(null);
    setSelectedFlavor(null);
    setSelectedToppings([]);
    setSelectedType(null);
    setToppings([])
    setSizes([])
  };

  const handlePaymentSubmit = () => {
    const paymentDetails = {
      customer_name: customerName,
      bill_id: billId,
      purchases: purchases,
      payment_type: paymentType,
      total_amount: totalPrice.toFixed(2),
    };

    if (paymentType === 'cash') {
      paymentDetails.amount_given = parseFloat(amountGiven);
      paymentDetails.amount_returned = Math.max(0, parseFloat(amountGiven) - totalPrice).toFixed(2);
    }
    else{
      paymentDetails.amount_given = totalPrice.toFixed(2);
      paymentDetails.amount_returned = '0';
    }

    // Send data to the server
    fetch(`${api}/sales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentDetails),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(data => {
        console.log('Success:', data);
        // alert('Payment successful!');
        resetData();
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while submitting the payment.');
      });
  };

  const resetData = () => {
    setNotification('Payment successfully Captured!');
    setBillId('');
    setShowPaymentModal(false);
    setPaymentType('');
    setAmountGiven('');
    setSelectedFlavor(null);
    setSelectedType(null);
    setSelectedSize(null);
    setSizes([])
    setToppings([])
    setSelectedToppings([])
    setShowModal(false)
    setPurchases([])
    setTimeout(() => setNotification(''), 3000);
    // window.location.reload()
  }




  const calculateTotalToppingsCost = () => {
    return selectedToppings.reduce((acc, topping) => {
      return acc + (topping.price_per_scoop * topping.scoops);
    }, 0);
  };

  const handleToppingChange = (topping, change) => {
    const existingTopping = selectedToppings.find(t => t.id === topping.id);
    if (existingTopping) {
      const newScoops = Math.max(0, existingTopping.scoops + change); // Prevent negative values
      setSelectedToppings(selectedToppings.map(t => t.id === topping.id ? { ...t, scoops: newScoops } : t));
    } else if (change > 0) {
      setSelectedToppings([...selectedToppings, { ...topping, scoops: change }]);
    }
  };

  const getScoops = (toppingId) => {
    const topping = selectedToppings.find(t => t.id === toppingId);
    return topping ? topping.scoops : 0;
  };





  const addItemToBill = (flavor, type, size, toppings) => {
    // Create a new item object with all necessary details
    const newItem = {
      count: purchases.length + 1,
      flavor: flavor,
      type: type,
      size: size,
      toppings: toppings,
      basePrice: size.price, // Assuming size object has a 'price' property
      totalPrice: 0 // Initialize totalPrice to 0, will be calculated next
    };

    // Calculate the total price for the new item
    newItem.totalPrice = calculateItemTotal(newItem);

    // Append the new item to the existing purchases
    setPurchases(prevPurchases => [...prevPurchases, newItem]);
  };

  // Function to remove an item from purchases
  const handleRemove = (id) => {
    setPurchases(purchases.filter(purchase => purchase.count !== id));
  };

  // Calculate total price for each item including toppings
  const calculateItemTotal = (item) => {
    // Ensure that the item.toppings array exists and is not undefined
    if (!item.toppings || item.toppings.length === 0) {
      console.log("No toppings, returning base price only:", item.basePrice);
      return item.basePrice; // If no toppings, return the base price of the item
    }

    // Calculate the total cost of toppings
    const toppingCost = item.toppings.reduce((acc, topping) => {
      if (topping && topping.price_per_scoop && topping.scoops) {
        return acc + (topping.price_per_scoop * topping.scoops);
      }
      return acc; // Return accumulated value if current topping is undefined or missing properties
    }, 0);

    console.log("Topping Cost:", toppingCost);

    // Calculate the total price of the item
    const totalItemPrice = item.basePrice + toppingCost;
    console.log("Total Item Price:", totalItemPrice);

    return totalItemPrice;
  };


  // Calculate total price for all items
  const totalPrice = purchases.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <Container fluid>
      <Row>

        {/* Billings */}
        <Col md={8} style={{ padding: '20px', fontFamily: 'Courier New, monospace', backgroundColor: '#f0f0f0' }}>
          <Row>
            <Col md={6}>
              <Form>
                <Form.Group>
                  <Form.Label>Bill ID</Form.Label>
                  <Form.Control type="text" value={billId} readOnly />
                </Form.Group>
              </Form>
            </Col>
            <Col md={6}>
              <Form>
                <Form.Group>
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                </Form.Group>
              </Form>
            </Col>
          </Row>
          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <Table striped bordered hover>
              <thead style={{ backgroundColor: '#007bff', color: 'white' }}>
                <tr>
                  <th>#</th>
                  <th>Flavor</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Toppings</th>
                  <th>Base Price (PHP)</th>
                  <th>Total Price (PHP)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase, index) => (
                  <>
                    <tr key={index + 1}>
                      <td>{index + 1}</td>
                      <td>{purchase.flavor.flavor_name}</td>
                      <td>{purchase.type}</td>
                      <td>{purchase.size.name}</td>
                      <td>
                        {purchase.toppings.map(topping => `${topping.name} x${topping.scoops}`).join(', ')}
                      </td>
                      <td>{purchase.basePrice}</td>
                      <td>{purchase.totalPrice}</td>
                      <td style={{ textAlign: 'center' }}>
                        <Button variant="danger" size="sm" onClick={() => handleRemove(purchase.count)} style={{ padding: '0 4px' }}>X</Button>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="8" style={{ borderTop: '2px dashed black' }}></td> {/* Dashed line as a separator */}
                    </tr>
                  </>
                ))}
              </tbody>
            </Table>
          </div>
          <div style={{ borderTop: '2px solid black', padding: '10px', backgroundColor: '#f8f9fa' }}>
            <Row className="align-items-center">
              <Col xs={12} md={8}>
                <strong style={{ fontSize: '1.2rem' }}>Total: PHP {totalPrice.toFixed(2)}</strong>
              </Col>
              <Col xs={12} md={4}>
                <Button
                  variant="primary"
                  size="lg"
                  block
                  onClick={() => setShowPaymentModal(true)}
                  style={{ marginTop: '10px', fontSize: '1rem' }}
                >
                  Submit Bill
                </Button>
              </Col>
            </Row>
          </div>
        </Col>



        {/* Flavors */}
        <Col md={4} style={{ padding: '20px', backgroundColor: '#e9ecef' }}>
        <Row>
        <Col md={12}>
          <h2>Cones</h2>
          {coneFlavors.map(flavor => (
            <Row key={flavor.name} style={{ backgroundColor: '#f1f1f1', marginBottom: '20px', padding: '10px' }}>
              <Col md={12}>
                <Row>
                  {flavor.size.map(flavorsize => (
                    <Col key={flavorsize.id} xs={6} md={4} lg={3} style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                      <Button
                        variant="primary"
                        onClick={() => handleConeFlavorSelect(flavor, flavorsize)}
                        style={{
                          width: '100%',
                          height: '100px',  // Standard height for all buttons
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: '10px 20px',
                          fontSize: '1em'
                        }}
                      >
                        {flavorsize.name} {flavor.flavor_name}
                        <div style={{ fontSize: '0.9em', marginTop: '5px' }}>
                          Price: ${flavorsize.price}
                        </div>
                      </Button>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          ))}
        </Col>
          <Col md={12} style={{ padding: '20px', backgroundColor: '#e9ecef' }}>
          <h2>Sundaes</h2>
          {sundaeFlavors.map(flavor => (
            <Button
              key={flavor.id}
              variant="primary"
              onClick={() => handleSundaeFlavorSelect(flavor)}
            style={{ width: '6em', height: '6em', justifyContent: 'center', alignItems: 'center', margin: '10px', fontSize: '1.2em' }}
            >
              {flavor.flavor_name}
            </Button>
          ))}
          </Col>
        </Row>
          
        </Col>
      </Row>



      {/* Sizes and Toppings */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Size</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
            {sizes.map(size => (
              <Button
                key={size.id}
                onClick={() => handleSizeSelect(size)}
                style={{
                  padding: '10px 20px',
                  fontSize: '1em',
                  flex: '1 1 auto',
                  backgroundColor: selectedSize ? selectedSize.id === size.id ? 'green' : undefined : undefined
                }}
              >
                {size.name}
              </Button>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
            {toppings.map(topping => (
              <Form.Group key={topping.id} style={{ display: 'flex', alignItems: 'center', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <Form.Label style={{ marginRight: '10px', flex: 1 }}>{topping.name} - PHP {topping.price_per_scoop} per scoop</Form.Label>
                <Button
                  variant="outline-secondary"
                  onClick={() => handleToppingChange(topping, -1)}
                  style={{ width: '40px', height: '40px' }}
                >
                  -
                </Button>
                <Form.Control
                  type="text"
                  readOnly
                  value={getScoops(topping.id)}
                  style={{ width: '60px', textAlign: 'center', margin: '0 10px' }}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => handleToppingChange(topping, 1)}
                  style={{ width: '40px', height: '40px' }}
                >
                  +
                </Button>
              </Form.Group>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div>
              <p style={{ margin: '0', padding: '5px' }}>
                <strong>Base Price:</strong> PHP {selectedSize ? selectedSize.price.toFixed(2) : '0.00'}
              </p>
              <p style={{ margin: '0', padding: '5px' }}>
                <strong>Toppings Price:</strong> PHP {calculateTotalToppingsCost().toFixed(2)}
              </p>
            </div>
            <Button
              variant="success"
              disabled={!selectedType || !selectedSize}
              onClick={handleSubmit}
              style={{ alignSelf: 'center' }}
            >
              Submit PHP {((selectedSize ? selectedSize.price : 0) + calculateTotalToppingsCost()).toFixed(2)}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Payment */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Payment Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-grid gap-2">
            <Button
              variant={paymentType === 'cash' ? "primary" : "outline-primary"}
              size="lg"
              onClick={() => setPaymentType('cash')}
            >
              Cash
            </Button>
            <Button
              variant={paymentType === 'card' ? "primary" : "outline-primary"}
              size="lg"
              onClick={() => setPaymentType('card')}
            >
              Card
            </Button>
            <Button
              variant={paymentType === 'gcash' ? "primary" : "outline-primary"}
              size="lg"
              onClick={() => setPaymentType('gcash')}
            >
              GCash
            </Button>
          </div>
          {paymentType === 'cash' && (
            <Form>
              <Form.Group className="mt-3">
                <Form.Label>Amount Given</Form.Label>
                <Form.Control
                  type="number"
                  value={amountGiven}
                  onChange={e => setAmountGiven(e.target.value)}
                  size="lg"
                  autoFocus="true"
                />
              </Form.Group>
              <p className="mt-2">Balance to Return: PHP {Math.max(0, (amountGiven - totalPrice).toFixed(2))}</p>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            size="lg"
            disabled={!paymentType || (paymentType === 'cash' && (!amountGiven || parseFloat(amountGiven) < totalPrice))}
            onClick={handlePaymentSubmit}
          >
            Submit Payment
          </Button>
        </Modal.Footer>
      </Modal>


      {notification && <Alert variant="info" className="notification-alert">{notification}</Alert>}
    </Container>
  );
}

export default App;