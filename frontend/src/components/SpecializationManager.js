import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStethoscope, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { specializationService } from '../services/api';

const SpecializationManager = () => {
    const [specializations, setSpecializations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    useEffect(() => {
        fetchSpecializations();
    }, []);

    const fetchSpecializations = async () => {
        try {
            setLoading(true);
            const response = await specializationService.getAll();
            setSpecializations(response.data || []);
            setError(null);
        } catch (err) {
            setError('Failed to fetch specializations.');
            console.error('Error fetching specializations:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await specializationService.update(editingId, formData);
            } else {
                await specializationService.create(formData);
            }
            fetchSpecializations();
            resetForm();
        } catch (err) {
            setError(`Failed to ${editingId ? 'update' : 'create'} specialization.`);
            console.error('Error saving specialization:', err);
        }
    };

    const handleEdit = (spec) => {
        setEditingId(spec.id);
        setFormData({
            name: spec.name || '',
            description: spec.description || '',
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this specialization?')) {
            try {
                await specializationService.delete(id);
                setSpecializations(specializations.filter(s => s.id !== id));
            } catch (err) {
                setError('Failed to delete specialization.');
                console.error('Error deleting specialization:', err);
            }
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '' });
        setEditingId(null);
        setShowForm(false);
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
            <div className="loading-container">
                <motion.div
                    className="loading-spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <FaStethoscope size={50} />
                </motion.div>
                <p className="loading-text">Loading specializations...</p>
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
                        <FaStethoscope className="title-icon" />
                        Specializations
                    </h1>
                    <p className="page-subtitle">Manage medical specializations</p>
                </motion.div>

                <motion.div
                    className="header-actions"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <button 
                        className="btn-primary"
                        onClick={() => setShowForm(!showForm)}
                    >
                        <FaPlus /> Add Specialization
                    </button>
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
                {showForm && (
                    <motion.div
                        className="form-container inline-form"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                    >
                        <form onSubmit={handleSubmit} className="modern-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">
                                        <FaStethoscope className="label-icon" />
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="form-input"
                                        placeholder="e.g., Cardiology"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <input
                                        type="text"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        className="form-input"
                                        placeholder="Brief description"
                                    />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn-secondary" onClick={resetForm}>
                                    <FaTimes /> Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    <FaSave /> {editingId ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                className="specializations-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {specializations.length === 0 ? (
                    <motion.div
                        className="empty-state"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <FaStethoscope size={80} className="empty-icon" />
                        <h3>No Specializations</h3>
                        <p>Add specializations to categorize physicians</p>
                    </motion.div>
                ) : (
                    specializations.map((spec) => (
                        <motion.div
                            key={spec.id}
                            className="specialization-card"
                            variants={itemVariants}
                            whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(108, 99, 255, 0.2)" }}
                        >
                            <div className="spec-icon">
                                <FaStethoscope />
                            </div>
                            <div className="spec-content">
                                <h3 className="spec-name">{spec.name}</h3>
                                <p className="spec-description">{spec.description || 'No description'}</p>
                            </div>
                            <div className="spec-actions">
                                <button
                                    onClick={() => handleEdit(spec)}
                                    className="spec-action-btn edit"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => handleDelete(spec.id)}
                                    className="spec-action-btn delete"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </motion.div>
        </motion.div>
    );
};

export default SpecializationManager;
