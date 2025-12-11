import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserMd, FaSave, FaTimes, FaImage, FaStethoscope, FaMapMarkerAlt } from 'react-icons/fa';
import { physicianService, specializationService } from '../services/api';

const PhysicianForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        specializationId: '',
        clinicalAddress: '',
        image: null,
    });
    const [specializations, setSpecializations] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSpecializations();
        if (isEditing) {
            fetchPhysician();
        }
    }, [id]);

    const fetchSpecializations = async () => {
        try {
            const response = await specializationService.getAll();
            setSpecializations(response.data || []);
        } catch (err) {
            console.error('Error fetching specializations:', err);
        }
    };

    const fetchPhysician = async () => {
        try {
            setLoading(true);
            const response = await physicianService.getById(id);
            const physician = response.data;
            setFormData({
                name: physician.name || '',
                specializationId: physician.specializationId || '',
                clinicalAddress: physician.clinicalAddress || '',
                image: null,
            });
            if (physician.image) {
                setImagePreview(`data:image/jpeg;base64,${physician.image}`);
            }
        } catch (err) {
            setError('Failed to fetch physician details.');
            console.error('Error fetching physician:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file,
            }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEditing) {
                await physicianService.update(id, formData);
            } else {
                await physicianService.create(formData);
            }
            navigate('/physicians');
        } catch (err) {
            setError(`Failed to ${isEditing ? 'update' : 'create'} physician. Please try again.`);
            console.error('Error saving physician:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="page-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="form-container">
                <motion.div
                    className="form-header"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="form-title">
                        <FaUserMd className="title-icon" />
                        {isEditing ? 'Edit Physician' : 'Add New Physician'}
                    </h1>
                    <p className="form-subtitle">
                        {isEditing ? 'Update physician information' : 'Enter physician details below'}
                    </p>
                </motion.div>

                {error && (
                    <motion.div
                        className="error-message"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {error}
                    </motion.div>
                )}

                <motion.form
                    onSubmit={handleSubmit}
                    className="modern-form"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label className="form-label">
                                <FaImage className="label-icon" />
                                Physician Photo
                            </label>
                            <div className="image-upload-container">
                                <div className="image-preview-area">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="image-preview" />
                                    ) : (
                                        <div className="image-placeholder">
                                            <FaUserMd size={60} />
                                            <span>No image selected</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="file-input"
                                    id="physician-image"
                                />
                                <label htmlFor="physician-image" className="file-label">
                                    <FaImage /> Choose Image
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FaUserMd className="label-icon" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Dr. John Smith"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FaStethoscope className="label-icon" />
                                Specialization
                            </label>
                            <select
                                name="specializationId"
                                value={formData.specializationId}
                                onChange={handleChange}
                                className="form-input form-select"
                                required
                            >
                                <option value="">Select Specialization</option>
                                {specializations.map(spec => (
                                    <option key={spec.id} value={spec.id}>
                                        {spec.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label className="form-label">
                                <FaMapMarkerAlt className="label-icon" />
                                Clinical Address
                            </label>
                            <textarea
                                name="clinicalAddress"
                                value={formData.clinicalAddress}
                                onChange={handleChange}
                                className="form-input form-textarea"
                                placeholder="123 Medical Center, Suite 100, City, State"
                                rows="3"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <motion.button
                            type="button"
                            className="btn-secondary"
                            onClick={() => navigate('/physicians')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FaTimes /> Cancel
                        </motion.button>
                        <motion.button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {loading ? (
                                <>Saving...</>
                            ) : (
                                <>
                                    <FaSave /> {isEditing ? 'Update' : 'Save'} Physician
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.form>
            </div>
        </motion.div>
    );
};

export default PhysicianForm;
