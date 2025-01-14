// src/Flavors.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChooseFlavor.css';  // Importing the CSS for styling
import { Col, Container, Row } from 'react-bootstrap';

const Flavors = () => {
    const [cones, setCones] = useState([]);
    const [sundaes, setSundaes] = useState([]);
    const api = process.env.REACT_APP_ROOT_API

    useEffect(() => {
        // Fetch flavors data from an API
        axios.get(`${api}/flavors?type=sundae&all=True`)
            .then(response => {
                setSundaes(response.data)
            })
            .catch(error => console.error('Error fetching flavors:', error));
        axios.get(`${api}/flavors?all=True&type=cone`)
            .then(response => {
                setCones(response.data)
            })
            .catch(error => console.error('Error fetching flavors:', error));
    }, []);

    const handleFlavorClick = (flavor) => {
        console.log(flavor)
        let value = flavor.is_activated ? 'deactivate': 'activate'
        const apiEndpoint = `${api}/flavors/change_status`;
        let body = {
            flavor_id : flavor.id,
            status: value
        }
        axios.post(apiEndpoint, body)
            .then(() => {
                // Update the state to re-render the button with the new color
                if(flavor.is_sundae == 1){
                    setSundaes(sundaes.map(f => f.id === flavor.id ? { ...f, is_activated: !f.is_activated } : f));
                }else{
                    setCones(cones.map(f => f.id === flavor.id ? { ...f, is_activated: !f.is_activated } : f));
                }
            })
            .catch(error => console.error('Error updating flavor:', error));
    };

    return (
        <>
            <Row md={2}>
                <h1>Flavors</h1>
            </Row>
            <Row md={12}>
                <Col md={'12'}>
                <h3>Cones</h3>
                    <div className="flavors-container">
                        {cones.map(flavor => (
                            <button
                                key={flavor.id}
                                style={{ backgroundColor: flavor.is_activated ? 'green' : 'grey' }}
                                onClick={() => handleFlavorClick(flavor)}
                            >
                                {flavor.flavor_name}
                            </button>
                        ))}
                    </div>
                </Col>
                <hr></hr>
                <Col md={'12'}>
                <h3>Sundaes</h3>
                    <div className="flavors-container">
                        {sundaes.map(flavor => (
                            <button
                                key={flavor.id}
                                style={{ backgroundColor: flavor.is_activated ? 'green' : 'grey' }}
                                onClick={() => handleFlavorClick(flavor)}
                            >
                                {flavor.flavor_name}
                            </button>
                        ))}
                    </div>
                </Col>
            </Row>
        </>


    );
};

export default Flavors;