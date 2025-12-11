import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { FaHeartbeat, FaGithub, FaLinkedin } from 'react-icons/fa';

// Components
import NavigationBar from './components/Navbar';
import PatientList from './components/PatientList';
import PatientForm from './components/PatientForm';
import PatientDetail from './components/PatientDetail';
import PhysicianList from './components/PhysicianList';
import PhysicianForm from './components/PhysicianForm';
import PhysicianDetail from './components/PhysicianDetail';
import AppointmentList from './components/AppointmentList';
import AppointmentForm from './components/AppointmentForm';
import SpecializationManager from './components/SpecializationManager';

// Pages
import Home from './pages/Home';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <NavigationBar />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        {/* Patient Routes */}
                        <Route path="/patients" element={
                            <Container className="py-4">
                                <PatientList />
                            </Container>
                        } />
                        <Route path="/patients/add" element={
                            <Container className="py-4">
                                <PatientForm />
                            </Container>
                        } />
                        <Route path="/patients/edit/:id" element={
                            <Container className="py-4">
                                <PatientForm />
                            </Container>
                        } />
                        <Route path="/patients/:id" element={
                            <Container className="py-4">
                                <PatientDetail />
                            </Container>
                        } />
                        {/* Physician Routes */}
                        <Route path="/physicians" element={
                            <Container className="py-4">
                                <PhysicianList />
                            </Container>
                        } />
                        <Route path="/physicians/new" element={
                            <Container className="py-4">
                                <PhysicianForm />
                            </Container>
                        } />
                        <Route path="/physicians/edit/:id" element={
                            <Container className="py-4">
                                <PhysicianForm />
                            </Container>
                        } />
                        <Route path="/physicians/:id" element={
                            <Container className="py-4">
                                <PhysicianDetail />
                            </Container>
                        } />
                        {/* Appointment Routes */}
                        <Route path="/appointments" element={
                            <Container className="py-4">
                                <AppointmentList />
                            </Container>
                        } />
                        <Route path="/appointments/new" element={
                            <Container className="py-4">
                                <AppointmentForm />
                            </Container>
                        } />
                        <Route path="/appointments/edit/:id" element={
                            <Container className="py-4">
                                <AppointmentForm />
                            </Container>
                        } />
                        {/* Specialization Route */}
                        <Route path="/specializations" element={
                            <Container className="py-4">
                                <SpecializationManager />
                            </Container>
                        } />
                    </Routes>
                </main>
                <footer style={{
                    background: 'var(--bg-secondary)',
                    borderTop: '1px solid var(--border-color)',
                    padding: '2rem 0'
                }}>
                    <Container>
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-2 mb-3 mb-md-0">
                                <FaHeartbeat style={{ color: '#6c63ff' }} />
                                <span style={{
                                    background: 'linear-gradient(135deg, #6c63ff 0%, #a855f7 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontWeight: '600'
                                }}>Homecare</span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', marginBottom: 0 }}>
                                © 2025 Homecare - Healthcare Management System
                            </p>
                            <div className="d-flex gap-3 mt-3 mt-md-0">
                                <a href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.3s' }}>
                                    <FaGithub size={20} />
                                </a>
                                <a href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.3s' }}>
                                    <FaLinkedin size={20} />
                                </a>
                            </div>
                        </div>
                    </Container>
                </footer>
            </div>
        </Router>
    );
}

export default App;
