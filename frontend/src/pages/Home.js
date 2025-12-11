import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUsers, FaUserMd, FaCalendarCheck, FaClipboardList, FaArrowRight, FaHeartbeat } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Home = () => {
    const features = [
        {
            title: 'Patient Management',
            description: 'Register, view, and manage patient records with ease.',
            icon: <FaUsers size={40} />,
            link: '/patients',
            gradient: 'linear-gradient(135deg, #6c63ff 0%, #a855f7 100%)'
        },
        {
            title: 'Physician Directory',
            description: 'Browse healthcare professionals by specialization.',
            icon: <FaUserMd size={40} />,
            link: '/physicians',
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        },
        {
            title: 'Appointments',
            description: 'Schedule and track appointments seamlessly.',
            icon: <FaCalendarCheck size={40} />,
            link: '/appointments',
            gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
        },
        {
            title: 'Reports',
            description: 'Access medical reports and documentation.',
            icon: <FaClipboardList size={40} />,
            link: '/reports',
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <div style={{ background: 'var(--bg-primary)' }}>
            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.15) 0%, rgba(168, 85, 247, 0.1) 50%, rgba(236, 72, 153, 0.05) 100%)',
                padding: '5rem 0',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Animated Background Elements */}
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    left: '5%',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(108, 99, 255, 0.2) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(40px)',
                    animation: 'float 6s ease-in-out infinite'
                }}></div>
                <div style={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '10%',
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    animation: 'float 8s ease-in-out infinite reverse'
                }}></div>

                <Container style={{ position: 'relative', zIndex: 1 }}>
                    <Row className="align-items-center">
                        <Col lg={7}>
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <h1 style={{
                                    fontSize: '3.5rem',
                                    fontWeight: '800',
                                    lineHeight: '1.2',
                                    marginBottom: '1.5rem'
                                }}>
                                    <span style={{ color: 'var(--text-primary)' }}>Welcome to </span>
                                    <span style={{
                                        background: 'linear-gradient(135deg, #6c63ff 0%, #a855f7 50%, #ec4899 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}>Homecare</span>
                                </h1>
                                <p style={{
                                    fontSize: '1.25rem',
                                    color: 'var(--text-secondary)',
                                    marginBottom: '2rem',
                                    maxWidth: '500px'
                                }}>
                                    Your comprehensive healthcare management platform. 
                                    Connect patients with physicians and manage appointments seamlessly.
                                </p>
                                <div className="d-flex gap-3 flex-wrap">
                                    <Link to="/patients">
                                        <Button size="lg" className="d-flex align-items-center gap-2">
                                            View Patients <FaArrowRight />
                                        </Button>
                                    </Link>
                                    <Link to="/patients/add">
                                        <Button variant="outline-light" size="lg">
                                            Add New Patient
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        </Col>
                        <Col lg={5} className="text-center mt-5 mt-lg-0">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                style={{
                                    fontSize: '12rem',
                                    filter: 'drop-shadow(0 0 50px rgba(108, 99, 255, 0.3))'
                                }}
                                className="float"
                            >
                                <FaHeartbeat style={{ color: '#6c63ff' }} />
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Features Section */}
            <Container className="py-5">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-5"
                >
                    <h2 style={{ 
                        fontSize: '2.5rem', 
                        fontWeight: '700',
                        marginBottom: '1rem'
                    }}>
                        Our <span style={{
                            background: 'linear-gradient(135deg, #6c63ff 0%, #a855f7 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>Services</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                        Everything you need to manage healthcare efficiently
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <Row xs={1} md={2} lg={4} className="g-4">
                        {features.map((feature, index) => (
                            <Col key={index}>
                                <motion.div variants={itemVariants}>
                                    <Card className="h-100 text-center p-4" style={{ 
                                        cursor: 'pointer',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            background: feature.gradient
                                        }}></div>
                                        <Card.Body className="d-flex flex-column align-items-center">
                                            <div style={{
                                                width: '80px',
                                                height: '80px',
                                                borderRadius: '20px',
                                                background: feature.gradient,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginBottom: '1.5rem',
                                                color: 'white',
                                                boxShadow: `0 10px 30px ${feature.gradient.includes('6c63ff') ? 'rgba(108, 99, 255, 0.3)' : 
                                                    feature.gradient.includes('10b981') ? 'rgba(16, 185, 129, 0.3)' :
                                                    feature.gradient.includes('3b82f6') ? 'rgba(59, 130, 246, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                                            }}>
                                                {feature.icon}
                                            </div>
                                            <Card.Title style={{ 
                                                fontSize: '1.25rem', 
                                                fontWeight: '600',
                                                marginBottom: '0.75rem'
                                            }}>
                                                {feature.title}
                                            </Card.Title>
                                            <Card.Text style={{ marginBottom: '1.5rem' }}>
                                                {feature.description}
                                            </Card.Text>
                                            <Link to={feature.link} className="mt-auto">
                                                <Button variant="outline-primary" className="d-flex align-items-center gap-2">
                                                    Explore <FaArrowRight size={14} />
                                                </Button>
                                            </Link>
                                        </Card.Body>
                                    </Card>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mt-5"
                >
                    <div style={{
                        background: 'var(--bg-card)',
                        borderRadius: '24px',
                        padding: '3rem',
                        border: '1px solid var(--border-color)'
                    }}>
                        <Row className="text-center">
                            <Col md={4} className="mb-4 mb-md-0">
                                <h2 style={{
                                    fontSize: '3rem',
                                    fontWeight: '800',
                                    background: 'linear-gradient(135deg, #6c63ff 0%, #a855f7 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    textShadow: '0 0 40px rgba(108, 99, 255, 0.3)'
                                }}>100+</h2>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: 0 }}>Registered Patients</p>
                            </Col>
                            <Col md={4} className="mb-4 mb-md-0">
                                <h2 style={{
                                    fontSize: '3rem',
                                    fontWeight: '800',
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    textShadow: '0 0 40px rgba(16, 185, 129, 0.3)'
                                }}>50+</h2>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: 0 }}>Healthcare Professionals</p>
                            </Col>
                            <Col md={4}>
                                <h2 style={{
                                    fontSize: '3rem',
                                    fontWeight: '800',
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    textShadow: '0 0 40px rgba(59, 130, 246, 0.3)'
                                }}>1000+</h2>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: 0 }}>Appointments Managed</p>
                            </Col>
                        </Row>
                    </div>
                </motion.div>
            </Container>
        </div>
    );
};

export default Home;
