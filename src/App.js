import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Dropdown, Nav } from 'react-bootstrap';
import Analytics from './components/Analytics';
import Purchase from './components/Purchase';
import Sale from './components/Sale';
import Flavor from './components/Flavor'; // Import the new component
import ChooseFlavor from './components/ChooseFlavor'; // Import the new component
import ManageToppings from './components/Topping'; // Import the new component
import ManageExtras from './components/Extra'

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {

  return (
    <Router>
    <Container className="app-container" fluid>
      <nav>
        <Nav as="ul">
          <Nav.Item as="li">
            <Link to="/sale" className="nav-link">Sale</Link>
          </Nav.Item>
          <Nav.Item as="li">
            <Link to="/chooseflavor" className="nav-link">ChooseFlavor</Link>
          </Nav.Item>
          <Dropdown as={Nav.Item}>
            <Dropdown.Toggle as={Nav.Link}>More Options</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/purchase">Purchase</Dropdown.Item>
              <Dropdown.Item as={Link} to="/toppings">Toppings</Dropdown.Item>
              <Dropdown.Item as={Link} to="/analytics">Analytics</Dropdown.Item>
              <Dropdown.Item as={Link} to="/extras">Extras</Dropdown.Item>
              <Dropdown.Item as={Link} to="/flavor">Flavor</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </nav>
      <Routes>
        <Route path="/sale" element={<Sale />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/flavor" element={<Flavor />} />
        <Route path="/toppings" element={<ManageToppings />} />
        <Route path="/extras" element={<ManageExtras />} />
        <Route path="/chooseflavor" element={<ChooseFlavor />} />
      </Routes>
    </Container>
    </Router>
  );
}

export default App;