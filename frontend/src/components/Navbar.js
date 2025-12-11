import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaHeartbeat, FaHome, FaUsers, FaUserMd, FaCalendarAlt, FaStethoscope } from 'react-icons/fa';

const NavigationBar = () => {
    const location = useLocation();

    return (
        <Navbar expand="lg" sticky="top" className="py-3">
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
                    <FaHeartbeat size={28} style={{ color: '#6c63ff' }} />
                    <span>Homecare</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
                    <span style={{ 
                        display: 'block', 
                        width: '22px', 
                        height: '2px', 
                        background: '#fff', 
                        margin: '5px 0',
                        borderRadius: '2px'
                    }}></span>
                    <span style={{ 
                        display: 'block', 
                        width: '22px', 
                        height: '2px', 
                        background: '#fff', 
                        margin: '5px 0',
                        borderRadius: '2px'
                    }}></span>
                    <span style={{ 
                        display: 'block', 
                        width: '22px', 
                        height: '2px', 
                        background: '#fff', 
                        margin: '5px 0',
                        borderRadius: '2px'
                    }}></span>
                </Navbar.Toggle>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto gap-2">
                        <Nav.Link 
                            as={Link} 
                            to="/" 
                            className={`d-flex align-items-center gap-2 ${location.pathname === '/' ? 'active' : ''}`}
                        >
                            <FaHome /> Home
                        </Nav.Link>
                        <Nav.Link 
                            as={Link} 
                            to="/patients" 
                            className={`d-flex align-items-center gap-2 ${location.pathname.startsWith('/patients') ? 'active' : ''}`}
                        >
                            <FaUsers /> Patients
                        </Nav.Link>
                        <Nav.Link 
                            as={Link} 
                            to="/physicians" 
                            className={`d-flex align-items-center gap-2 ${location.pathname.startsWith('/physicians') ? 'active' : ''}`}
                        >
                            <FaUserMd /> Physicians
                        </Nav.Link>
                        <Nav.Link 
                            as={Link} 
                            to="/appointments" 
                            className={`d-flex align-items-center gap-2 ${location.pathname.startsWith('/appointments') ? 'active' : ''}`}
                        >
                            <FaCalendarAlt /> Appointments
                        </Nav.Link>
                        <Nav.Link 
                            as={Link} 
                            to="/specializations" 
                            className={`d-flex align-items-center gap-2 ${location.pathname.startsWith('/specializations') ? 'active' : ''}`}
                        >
                            <FaStethoscope /> Specializations
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
