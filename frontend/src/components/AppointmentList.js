import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaPlus, FaSearch, FaClock, FaUser, FaUserMd, FaTrash, FaEdit, FaFilter } from 'react-icons/fa';
import { appointmentService } from '../services/api';

const AppointmentList = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const response = await appointmentService.getAll();
            setAppointments(response.data || []);
            setError(null);
        } catch (err) {
            setError('Failed to fetch appointments. Please try again.');
            console.error('Error fetching appointments:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            try {
                await appointmentService.delete(id);
                setAppointments(appointments.filter(a => a.id !== id));
            } catch (err) {
                setError('Failed to cancel appointment.');
                console.error('Error deleting appointment:', err);
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const filteredAppointments = appointments.filter(apt => {
        const matchesSearch = 
            apt.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.physician?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesDate = !filterDate || 
            new Date(apt.appointmentDate).toDateString() === new Date(filterDate).toDateString();
        
        return matchesSearch && matchesDate;
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    const itemVariants = {
        hidden: { x: -20, opacity: 0 },
        visible: {
            x: 0,
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
                    <FaCalendarAlt size={50} />
                </motion.div>
                <p className="loading-text">Loading appointments...</p>
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
                        <FaCalendarAlt className="title-icon" />
                        Appointments
                    </h1>
                    <p className="page-subtitle">Manage patient appointments</p>
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
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <div className="filter-box">
                        <FaFilter className="filter-icon" />
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="filter-input"
                        />
                    </div>
                    <Link to="/appointments/new" className="btn-primary">
                        <FaPlus /> New Appointment
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
                {filteredAppointments.length === 0 ? (
                    <motion.div
                        className="empty-state"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                    >
                        <FaCalendarAlt size={80} className="empty-icon" />
                        <h3>No Appointments Found</h3>
                        <p>Schedule a new appointment to get started</p>
                        <Link to="/appointments/new" className="btn-primary">
                            <FaPlus /> Schedule Appointment
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        className="appointments-table-container"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <table className="appointments-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Patient</th>
                                    <th>Physician</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAppointments.map((appointment) => (
                                    <motion.tr
                                        key={appointment.id}
                                        variants={itemVariants}
                                        whileHover={{ backgroundColor: 'rgba(108, 99, 255, 0.1)' }}
                                    >
                                        <td>
                                            <div className="appointment-date-cell">
                                                <FaCalendarAlt className="cell-icon" />
                                                <span>{formatDate(appointment.appointmentDate)}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="appointment-time-cell">
                                                <FaClock className="cell-icon" />
                                                <span>{appointment.startTime} - {appointment.endTime}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="appointment-person-cell">
                                                <FaUser className="cell-icon patient-icon" />
                                                <span>{appointment.patient?.name || 'Unknown Patient'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="appointment-person-cell">
                                                <FaUserMd className="cell-icon physician-icon" />
                                                <span>{appointment.physician?.name || 'Unknown Physician'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                <Link
                                                    to={`/appointments/edit/${appointment.id}`}
                                                    className="table-action-btn edit"
                                                >
                                                    <FaEdit />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(appointment.id)}
                                                    className="table-action-btn delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AppointmentList;
