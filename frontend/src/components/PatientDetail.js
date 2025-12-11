import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { patientService } from '../services/api';
import { FaUser, FaPhone, FaVenusMars, FaCity, FaMapMarkerAlt, FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';

const PatientDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPatient = useCallback(async () => {
        try {
            setLoading(true);
            const response = await patientService.getById(id);
            setPatient(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch patient details.');
            console.error('Error fetching patient:', err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchPatient();
    }, [fetchPatient]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            try {
                await patientService.delete(id);
                navigate('/patients');
            } catch (err) {
                setError('Failed to delete patient.');
                console.error('Error deleting patient:', err);
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
                    <p className="mt-3" style={{ color: 'var(--text-secondary)' }}>Loading patient details...</p>
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
                    <Button variant="link" onClick={() => navigate('/patients')} style={{ color: '#fca5a5' }}>
                        Back to Patients
                    </Button>
                </Alert>
            </motion.div>
        );
    }

    if (!patient) {
        return (
            <Alert variant="warning">Patient not found.</Alert>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="row justify-content-center"
        >
            <div className="col-lg-8">
                <Card style={{ overflow: 'hidden' }}>
                    <div style={{
                        height: '6px',
                        background: 'linear-gradient(135deg, #6c63ff 0%, #a855f7 50%, #ec4899 100%)'
                    }}></div>
                    <Card.Header className="py-3 d-flex justify-content-between align-items-center">
                        <h4 className="mb-0" style={{
                            background: 'linear-gradient(135deg, #6c63ff 0%, #a855f7 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>Patient Details</h4>
                        <Badge style={{
                            background: 'var(--bg-card-hover)',
                            color: 'var(--text-secondary)',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px'
                        }}>ID: {id}</Badge>
                    </Card.Header>
                    <Card.Body className="p-4">
                        <div className="row">
                            <div className="col-md-4 text-center mb-4 mb-md-0">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                >
                                    {patient.image ? (
                                        <img
                                            src={`data:image/jpeg;base64,${patient.image}`}
                                            alt={patient.name}
                                            style={{ 
                                                width: '180px', 
                                                height: '180px', 
                                                objectFit: 'cover',
                                                borderRadius: '50%',
                                                border: '4px solid #6c63ff',
                                                boxShadow: '0 0 30px rgba(108, 99, 255, 0.3)'
                                            }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: '180px',
                                            height: '180px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, var(--bg-card-hover) 0%, var(--bg-card) 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto',
                                            border: '4px solid var(--border-color)'
                                        }}>
                                            <FaUser size={60} style={{ color: 'var(--text-muted)' }} />
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                            <div className="col-md-8">
                                <motion.div
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <h3 style={{ 
                                        fontSize: '1.75rem', 
                                        fontWeight: '700',
                                        marginBottom: '1.5rem'
                                    }}>{patient.name}</h3>
                                    
                                    <div style={{
                                        background: 'var(--bg-secondary)',
                                        borderRadius: '16px',
                                        padding: '1.5rem',
                                        border: '1px solid var(--border-color)'
                                    }}>
                                        <div className="row mb-3">
                                            <div className="col-5 d-flex align-items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                                                <FaPhone style={{ color: '#6c63ff' }} /> Phone
                                            </div>
                                            <div className="col-7" style={{ fontWeight: '500' }}>{patient.phone}</div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-5 d-flex align-items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                                                <FaVenusMars style={{ color: '#a855f7' }} /> Gender
                                            </div>
                                            <div className="col-7">
                                                <Badge style={{
                                                    background: patient.gender === 'Male' 
                                                        ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
                                                        : 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                                                    padding: '0.4rem 0.8rem',
                                                    borderRadius: '6px'
                                                }}>
                                                    {patient.gender}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-5 d-flex align-items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                                                <FaCity style={{ color: '#10b981' }} /> City
                                            </div>
                                            <div className="col-7" style={{ fontWeight: '500' }}>{patient.city}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-5 d-flex align-items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                                                <FaMapMarkerAlt style={{ color: '#f59e0b' }} /> Address
                                            </div>
                                            <div className="col-7" style={{ fontWeight: '500' }}>{patient.address}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-between py-3">
                        <Button 
                            variant="outline-secondary" 
                            onClick={() => navigate('/patients')}
                            className="d-flex align-items-center gap-2"
                        >
                            <FaArrowLeft /> Back to List
                        </Button>
                        <div className="d-flex gap-2">
                            <Button 
                                variant="outline-primary"
                                onClick={() => navigate(`/patients/edit/${id}`)}
                                className="d-flex align-items-center gap-2"
                            >
                                <FaEdit /> Edit
                            </Button>
                            <Button 
                                variant="outline-danger" 
                                onClick={handleDelete}
                                className="d-flex align-items-center gap-2"
                            >
                                <FaTrash /> Delete
                            </Button>
                        </div>
                    </Card.Footer>
                </Card>
            </div>
        </motion.div>
    );
};

export default PatientDetail;
