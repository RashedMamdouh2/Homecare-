import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserMd, FaStethoscope, FaMapMarkerAlt, FaEdit, FaTrash, FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';
import { physicianService, appointmentService } from '../services/api';

const PhysicianDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [physician, setPhysician] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPhysicianData();
    }, [id]);

    const fetchPhysicianData = async () => {
        try {
            setLoading(true);
            const [physicianRes, appointmentsRes] = await Promise.all([
                physicianService.getById(id),
                appointmentService.getByPhysician(id)
            ]);
            setPhysician(physicianRes.data);
            setAppointments(appointmentsRes.data || []);
        } catch (err) {
            setError('Failed to fetch physician details.');
            console.error('Error fetching physician:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this physician?')) {
            try {
                await physicianService.delete(id);
                navigate('/physicians');
            } catch (err) {
                setError('Failed to delete physician.');
                console.error('Error deleting physician:', err);
            }
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <motion.div
                    className="loading-spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <FaUserMd size={50} />
                </motion.div>
                <p className="loading-text">Loading physician details...</p>
            </div>
        );
    }

    if (error || !physician) {
        return (
            <div className="error-container">
                <p className="error-message">{error || 'Physician not found.'}</p>
                <Link to="/physicians" className="btn-primary">
                    <FaArrowLeft /> Back to Physicians
                </Link>
            </div>
        );
    }

    return (
        <motion.div
            className="page-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="back-button-container"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
            >
                <Link to="/physicians" className="back-link">
                    <FaArrowLeft /> Back to Physicians
                </Link>
            </motion.div>

            <div className="detail-container">
                <motion.div
                    className="detail-card"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="detail-header">
                        <div className="detail-image-container">
                            {physician.image ? (
                                <motion.img
                                    src={`data:image/jpeg;base64,${physician.image}`}
                                    alt={physician.name}
                                    className="detail-image"
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            ) : (
                                <div className="detail-image-placeholder">
                                    <FaUserMd size={80} />
                                </div>
                            )}
                        </div>

                        <div className="detail-title-section">
                            <h1 className="detail-name">{physician.name}</h1>
                            <div className="detail-badge">
                                <FaStethoscope />
                                <span>{physician.specialization?.name || 'General Practice'}</span>
                            </div>
                        </div>

                        <div className="detail-actions">
                            <Link to={`/physicians/edit/${physician.id}`} className="action-btn edit">
                                <FaEdit /> Edit
                            </Link>
                            <button onClick={handleDelete} className="action-btn delete">
                                <FaTrash /> Delete
                            </button>
                        </div>
                    </div>

                    <div className="detail-body">
                        <div className="detail-section">
                            <h3 className="section-title">Information</h3>
                            <div className="info-grid">
                                <motion.div
                                    className="info-card"
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="info-icon-container">
                                        <FaStethoscope />
                                    </div>
                                    <div className="info-content">
                                        <span className="info-label">Specialization</span>
                                        <span className="info-value">{physician.specialization?.name || 'General'}</span>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="info-card"
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="info-icon-container">
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div className="info-content">
                                        <span className="info-label">Clinical Address</span>
                                        <span className="info-value">{physician.clinicalAddress || 'Not specified'}</span>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="info-card"
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="info-icon-container">
                                        <FaCalendarAlt />
                                    </div>
                                    <div className="info-content">
                                        <span className="info-label">Appointments</span>
                                        <span className="info-value">{appointments.length} scheduled</span>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {appointments.length > 0 && (
                            <div className="detail-section">
                                <h3 className="section-title">Upcoming Appointments</h3>
                                <div className="appointments-list">
                                    {appointments.slice(0, 5).map((apt, index) => (
                                        <motion.div
                                            key={apt.id}
                                            className="appointment-item"
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <div className="appointment-date">
                                                <FaCalendarAlt />
                                                <span>{new Date(apt.appointmentDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="appointment-time">
                                                {apt.startTime} - {apt.endTime}
                                            </div>
                                            <div className="appointment-patient">
                                                Patient: {apt.patient?.name || 'Unknown'}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default PhysicianDetail;
