import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { patientService } from '../services/api';
import { FaUser, FaPhone, FaVenusMars, FaCity, FaMapMarkerAlt, FaImage, FaArrowLeft, FaCheck, FaEdit } from 'react-icons/fa';
import { motion } from 'framer-motion';

const PatientForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);
    
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        gender: '',
        address: '',
        city: '',
        image: null
    });

    useEffect(() => {
        if (isEditing) {
            fetchPatient();
        }
    }, [id]);

    const fetchPatient = async () => {
        try {
            setFetchLoading(true);
            const response = await patientService.getById(id);
            const patient = response.data;
            setFormData({
                name: patient.name || '',
                phone: patient.phone || '',
                gender: patient.gender || '',
                address: patient.address || '',
                city: patient.city || '',
                image: null
            });
            if (patient.image) {
                setImagePreview(`data:image/jpeg;base64,${patient.image}`);
            }
        } catch (err) {
            setError('Failed to fetch patient details.');
            console.error('Error fetching patient:', err);
        } finally {
            setFetchLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(file.type)) {
                setError('Please select a valid image file (PNG, JPG, or JPEG)');
                return;
            }
            if (file.size > 1000 * 1024) {
                setError('Image size must be less than 1MB');
                return;
            }
            setFormData(prev => ({
                ...prev,
                image: file
            }));
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEditing) {
                await patientService.update(id, formData);
            } else {
                await patientService.create(formData);
            }
            navigate('/patients');
        } catch (err) {
            setError(err.response?.data || `Failed to ${isEditing ? 'update' : 'add'} patient. Please try again.`);
            console.error('Error saving patient:', err);
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" style={{ width: '4rem', height: '4rem', color: '#6c63ff' }} />
                <p className="mt-3" style={{ color: 'var(--text-secondary)' }}>Loading patient data...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="row justify-content-center"
        >
            <div className="col-md-8 col-lg-6">
                <Card style={{ overflow: 'hidden' }}>
                    <div style={{
                        height: '6px',
                        background: 'linear-gradient(135deg, #6c63ff 0%, #a855f7 50%, #ec4899 100%)'
                    }}></div>
                    <Card.Header className="py-4">
                        <h4 className="mb-0 d-flex align-items-center gap-2">
                            {isEditing ? <FaEdit style={{ color: '#6c63ff' }} /> : <FaUser style={{ color: '#6c63ff' }} />}
                            <span style={{
                                background: 'linear-gradient(135deg, #6c63ff 0%, #a855f7 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>{isEditing ? 'Edit Patient' : 'Add New Patient'}</span>
                        </h4>
                    </Card.Header>
                    <Card.Body className="p-4">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <Alert variant="danger">{error}</Alert>
                            </motion.div>
                        )}
                        
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-4">
                                <Form.Label className="d-flex align-items-center gap-2">
                                    <FaUser style={{ color: '#6c63ff' }} /> Full Name
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter patient name"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="d-flex align-items-center gap-2">
                                    <FaPhone style={{ color: '#a855f7' }} /> Phone Number
                                </Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="d-flex align-items-center gap-2">
                                    <FaVenusMars style={{ color: '#ec4899' }} /> Gender
                                </Form.Label>
                                <Form.Select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="d-flex align-items-center gap-2">
                                    <FaCity style={{ color: '#10b981' }} /> City
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="Enter city"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="d-flex align-items-center gap-2">
                                    <FaMapMarkerAlt style={{ color: '#f59e0b' }} /> Address
                                </Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter full address"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="d-flex align-items-center gap-2">
                                    <FaImage style={{ color: '#3b82f6' }} /> Profile Image
                                </Form.Label>
                                <div style={{
                                    border: '2px dashed var(--border-color)',
                                    borderRadius: '12px',
                                    padding: '2rem',
                                    textAlign: 'center',
                                    background: 'var(--bg-secondary)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onClick={() => document.getElementById('imageInput').click()}
                                >
                                    {imagePreview ? (
                                        <div>
                                            <img 
                                                src={imagePreview} 
                                                alt="Preview" 
                                                style={{
                                                    maxWidth: '150px',
                                                    maxHeight: '150px',
                                                    borderRadius: '12px',
                                                    marginBottom: '1rem'
                                                }}
                                            />
                                            <p style={{ color: 'var(--text-secondary)', marginBottom: 0 }}>
                                                Click to change image
                                            </p>
                                        </div>
                                    ) : (
                                        <div>
                                            <FaImage size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                                            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                                Click to upload image
                                            </p>
                                            <small style={{ color: 'var(--text-muted)' }}>
                                                PNG, JPG, JPEG (Max 1MB)
                                            </small>
                                        </div>
                                    )}
                                </div>
                                <Form.Control
                                    id="imageInput"
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                    required={!isEditing}
                                />
                            </Form.Group>

                            <div className="d-grid gap-3">
                                <Button 
                                    variant="primary" 
                                    type="submit" 
                                    disabled={loading}
                                    size="lg"
                                    className="d-flex align-items-center justify-content-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Spinner animation="border" size="sm" />
                                            {isEditing ? 'Updating...' : 'Adding Patient...'}
                                        </>
                                    ) : (
                                        <>
                                            <FaCheck /> {isEditing ? 'Update Patient' : 'Add Patient'}
                                        </>
                                    )}
                                </Button>
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={() => navigate('/patients')}
                                    className="d-flex align-items-center justify-content-center gap-2"
                                >
                                    <FaArrowLeft /> Cancel
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </motion.div>
    );
};

export default PatientForm;
