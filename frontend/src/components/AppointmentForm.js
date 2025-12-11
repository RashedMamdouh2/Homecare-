import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaSave, FaTimes, FaClock, FaUser, FaUserMd } from 'react-icons/fa';
import { appointmentService, patientService, physicianService } from '../services/api';

const AppointmentForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState({
        appointmentDate: '',
        startTime: '',
        endTime: '',
        patientId: '',
        physicianId: '',
    });
    const [patients, setPatients] = useState([]);
    const [physicians, setPhysicians] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDropdownData();
        if (isEditing) {
            fetchAppointment();
        }
    }, [id]);

    const fetchDropdownData = async () => {
        try {
            const [patientsRes, physiciansRes] = await Promise.all([
                patientService.getAll(),
                physicianService.getAll()
            ]);
            setPatients(patientsRes.data || []);
            setPhysicians(physiciansRes.data || []);
        } catch (err) {
            console.error('Error fetching dropdown data:', err);
        }
    };

    const fetchAppointment = async () => {
        try {
            setLoading(true);
            const response = await appointmentService.getById(id);
            const apt = response.data;
            setFormData({
                appointmentDate: apt.appointmentDate ? apt.appointmentDate.split('T')[0] : '',
                startTime: apt.startTime || '',
                endTime: apt.endTime || '',
                patientId: apt.patientId || '',
                physicianId: apt.physicianId || '',
            });
        } catch (err) {
            setError('Failed to fetch appointment details.');
            console.error('Error fetching appointment:', err);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEditing) {
                await appointmentService.update(id, formData);
            } else {
                await appointmentService.create(formData);
            }
            navigate('/appointments');
        } catch (err) {
            setError(`Failed to ${isEditing ? 'update' : 'create'} appointment. Please try again.`);
            console.error('Error saving appointment:', err);
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
                        <FaCalendarAlt className="title-icon" />
                        {isEditing ? 'Edit Appointment' : 'Schedule New Appointment'}
                    </h1>
                    <p className="form-subtitle">
                        {isEditing ? 'Update appointment details' : 'Fill in the appointment information'}
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
                        <div className="form-group">
                            <label className="form-label">
                                <FaUser className="label-icon" />
                                Patient
                            </label>
                            <select
                                name="patientId"
                                value={formData.patientId}
                                onChange={handleChange}
                                className="form-input form-select"
                                required
                            >
                                <option value="">Select Patient</option>
                                {patients.map(patient => (
                                    <option key={patient.id} value={patient.id}>
                                        {patient.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FaUserMd className="label-icon" />
                                Physician
                            </label>
                            <select
                                name="physicianId"
                                value={formData.physicianId}
                                onChange={handleChange}
                                className="form-input form-select"
                                required
                            >
                                <option value="">Select Physician</option>
                                {physicians.map(physician => (
                                    <option key={physician.id} value={physician.id}>
                                        Dr. {physician.name} - {physician.specialization?.name || 'General'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FaCalendarAlt className="label-icon" />
                                Appointment Date
                            </label>
                            <input
                                type="date"
                                name="appointmentDate"
                                value={formData.appointmentDate}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FaClock className="label-icon" />
                                Start Time
                            </label>
                            <input
                                type="time"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FaClock className="label-icon" />
                                End Time
                            </label>
                            <input
                                type="time"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <motion.button
                            type="button"
                            className="btn-secondary"
                            onClick={() => navigate('/appointments')}
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
                                    <FaSave /> {isEditing ? 'Update' : 'Schedule'} Appointment
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.form>
            </div>
        </motion.div>
    );
};

export default AppointmentForm;
