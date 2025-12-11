import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { patientService } from '../services/api';
import { FaPlus, FaEye, FaTrash, FaUser, FaPhone, FaMapMarkerAlt, FaCity, FaVenusMars, FaEdit } from 'react-icons/fa';
import { motion } from 'framer-motion';

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const response = await patientService.getAll();
            setPatients(response.data || []);
            setError(null);
        } catch (err) {
            setError('Failed to fetch patients. Please make sure the backend is running.');
            console.error('Error fetching patients:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            try {
                await patientService.delete(id);
                setPatients(patients.filter(p => p.id !== id));
            } catch (err) {
                setError('Failed to delete patient.');
                console.error('Error deleting patient:', err);
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Spinner animation="border" style={{ width: '4rem', height: '4rem', color: '#6c63ff' }} />
                    <p className="mt-3" style={{ color: 'var(--text-secondary)' }}>Loading patients...</p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Alert variant="danger" className="mt-3">
                    {error}
                    <Button variant="link" onClick={fetchPatients} style={{ color: '#fca5a5' }}>Try again</Button>
                </Alert>
            </motion.div>
        );
    }

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="d-flex justify-content-between align-items-center mb-4"
            >
                <div>
                    <h2 style={{ 
                        fontSize: '2rem', 
                        fontWeight: '700',
                        marginBottom: '0.25rem'
                    }}>
                        <span style={{
                            background: 'linear-gradient(135deg, #6c63ff 0%, #a855f7 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>Patients</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 0 }}>
                        Manage your patient records
                    </p>
                </div>
                <Link to="/patients/add">
                    <Button variant="success" className="d-flex align-items-center gap-2">
                        <FaPlus /> Add Patient
                    </Button>
                </Link>
            </motion.div>

            {patients.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <Alert variant="info" className="text-center py-5">
                        <FaUser size={48} className="mb-3" style={{ opacity: 0.5 }} />
                        <h5>No patients found</h5>
                        <p className="mb-3">Get started by adding your first patient!</p>
                        <Link to="/patients/add">
                            <Button variant="primary">Add First Patient</Button>
                        </Link>
                    </Alert>
                </motion.div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {patients.map((patient) => (
                            <Col key={patient.id}>
                                <motion.div variants={itemVariants}>
                                    <Card className="h-100" style={{ overflow: 'hidden' }}>
                                        <div style={{
                                            height: '4px',
                                            background: 'linear-gradient(135deg, #6c63ff 0%, #a855f7 100%)'
                                        }}></div>
                                        {patient.image ? (
                                            <div style={{
                                                height: '200px',
                                                overflow: 'hidden',
                                                position: 'relative'
                                            }}>
                                                <Card.Img 
                                                    variant="top" 
                                                    src={`data:image/jpeg;base64,${patient.image}`}
                                                    alt={patient.name}
                                                    style={{ 
                                                        height: '100%', 
                                                        objectFit: 'cover',
                                                        filter: 'brightness(0.9)'
                                                    }}
                                                />
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: '50%',
                                                    background: 'linear-gradient(transparent, rgba(26, 26, 46, 0.9))'
                                                }}></div>
                                            </div>
                                        ) : (
                                            <div style={{
                                                height: '200px',
                                                background: 'linear-gradient(135deg, var(--bg-card-hover) 0%, var(--bg-card) 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <FaUser size={60} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
                                            </div>
                                        )}
                                        <Card.Body>
                                            <Card.Title style={{ 
                                                fontSize: '1.25rem',
                                                fontWeight: '600',
                                                marginBottom: '1rem'
                                            }}>
                                                {patient.name}
                                            </Card.Title>
                                            <div style={{ fontSize: '0.9rem' }}>
                                                <p className="mb-2 d-flex align-items-center gap-2">
                                                    <FaPhone style={{ color: '#6c63ff' }} />
                                                    <span style={{ color: 'var(--text-secondary)' }}>{patient.phone}</span>
                                                </p>
                                                <p className="mb-2 d-flex align-items-center gap-2">
                                                    <FaVenusMars style={{ color: '#a855f7' }} />
                                                    <span style={{ color: 'var(--text-secondary)' }}>{patient.gender}</span>
                                                </p>
                                                <p className="mb-2 d-flex align-items-center gap-2">
                                                    <FaCity style={{ color: '#10b981' }} />
                                                    <span style={{ color: 'var(--text-secondary)' }}>{patient.city}</span>
                                                </p>
                                                <p className="mb-0 d-flex align-items-center gap-2">
                                                    <FaMapMarkerAlt style={{ color: '#f59e0b' }} />
                                                    <span style={{ 
                                                        color: 'var(--text-secondary)',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}>{patient.address}</span>
                                                </p>
                                            </div>
                                        </Card.Body>
                                        <Card.Footer className="d-flex justify-content-between py-3">
                                            <Link to={`/patients/${patient.id}`}>
                                                <Button variant="outline-primary" size="sm" className="d-flex align-items-center gap-2">
                                                    <FaEye /> View
                                                </Button>
                                            </Link>
                                            <div className="d-flex gap-2">
                                                <Link to={`/patients/edit/${patient.id}`}>
                                                    <Button variant="outline-info" size="sm" className="d-flex align-items-center gap-2">
                                                        <FaEdit /> Edit
                                                    </Button>
                                                </Link>
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm"
                                                    className="d-flex align-items-center gap-2"
                                                    onClick={() => handleDelete(patient.id)}
                                                >
                                                    <FaTrash /> Delete
                                                </Button>
                                            </div>
                                        </Card.Footer>
                                    </Card>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </motion.div>
            )}
        </div>
    );
};

export default PatientList;
