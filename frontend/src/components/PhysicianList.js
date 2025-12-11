import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserMd, FaPlus, FaSearch, FaStethoscope, FaMapMarkerAlt, FaTrash, FaEdit } from 'react-icons/fa';
import { physicianService } from '../services/api';

const PhysicianList = () => {
    const [physicians, setPhysicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPhysicians();
    }, []);

    const fetchPhysicians = async () => {
        try {
            setLoading(true);
            const response = await physicianService.getAll();
            setPhysicians(response.data || []);
            setError(null);
        } catch (err) {
            setError('Failed to fetch physicians. Please try again.');
            console.error('Error fetching physicians:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this physician?')) {
            try {
                await physicianService.delete(id);
                setPhysicians(physicians.filter(p => p.id !== id));
            } catch (err) {
                setError('Failed to delete physician.');
                console.error('Error deleting physician:', err);
            }
        }
    };

    const filteredPhysicians = physicians.filter(physician =>
        physician.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        physician.specialization?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        physician.clinicalAddress?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            <div className="loading-container">
                <motion.div
                    className="loading-spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <FaUserMd size={50} />
                </motion.div>
                <p className="loading-text">Loading physicians...</p>
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
            <div className="page-header">
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="page-title">
                        <FaUserMd className="title-icon" />
                        Physicians
                    </h1>
                    <p className="page-subtitle">Manage your healthcare providers</p>
                </motion.div>

                <motion.div
                    className="header-actions"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search physicians..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <Link to="/physicians/new" className="btn-primary">
                        <FaPlus /> Add Physician
                    </Link>
                </motion.div>
            </div>

            {error && (
                <motion.div
                    className="error-message"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {error}
                </motion.div>
            )}

            <AnimatePresence>
                {filteredPhysicians.length === 0 ? (
                    <motion.div
                        className="empty-state"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                    >
                        <FaUserMd size={80} className="empty-icon" />
                        <h3>No Physicians Found</h3>
                        <p>Start by adding a new physician to the system</p>
                        <Link to="/physicians/new" className="btn-primary">
                            <FaPlus /> Add First Physician
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        className="cards-grid"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {filteredPhysicians.map((physician) => (
                            <motion.div
                                key={physician.id}
                                className="card physician-card"
                                variants={itemVariants}
                                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(108, 99, 255, 0.3)" }}
                                layout
                            >
                                <div className="card-image-container">
                                    {physician.image ? (
                                        <img
                                            src={`data:image/jpeg;base64,${physician.image}`}
                                            alt={physician.name}
                                            className="card-image"
                                        />
                                    ) : (
                                        <div className="card-image-placeholder">
                                            <FaUserMd size={60} />
                                        </div>
                                    )}
                                    <div className="card-overlay">
                                        <Link to={`/physicians/${physician.id}`} className="overlay-btn view">
                                            View
                                        </Link>
                                    </div>
                                </div>

                                <div className="card-body">
                                    <h3 className="card-title">{physician.name}</h3>
                                    
                                    <div className="card-info">
                                        <div className="info-item">
                                            <FaStethoscope className="info-icon accent" />
                                            <span>{physician.specialization?.name || 'General'}</span>
                                        </div>
                                        <div className="info-item">
                                            <FaMapMarkerAlt className="info-icon" />
                                            <span>{physician.clinicalAddress || 'Not specified'}</span>
                                        </div>
                                    </div>

                                    <div className="card-actions">
                                        <Link to={`/physicians/edit/${physician.id}`} className="action-btn edit">
                                            <FaEdit /> Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(physician.id)}
                                            className="action-btn delete"
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default PhysicianList;
