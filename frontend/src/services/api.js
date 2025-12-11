import axios from 'axios';

const API_BASE_URL = 'http://localhost:5004/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Patient API calls
export const patientService = {
    getAll: () => api.get('/Patient/GetAllPatients'),
    getById: (id) => api.get(`/Patient/GetPatient/${id}`),
    create: (patientData) => {
        const formData = new FormData();
        formData.append('Name', patientData.name);
        formData.append('Phone', patientData.phone);
        formData.append('Gender', patientData.gender);
        formData.append('Address', patientData.address);
        formData.append('City', patientData.city);
        if (patientData.image) {
            formData.append('Image', patientData.image);
        }
        return api.post('/Patient/AddPatient', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    update: (id, patientData) => {
        const formData = new FormData();
        formData.append('Name', patientData.name);
        formData.append('Phone', patientData.phone);
        formData.append('Gender', patientData.gender);
        formData.append('Address', patientData.address);
        formData.append('City', patientData.city);
        if (patientData.image) {
            formData.append('Image', patientData.image);
        }
        return api.put(`/Patient/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    delete: (id) => api.delete(`/Patient?id=${id}`),
};

// Physician API calls
export const physicianService = {
    getAll: () => api.get('/Physician/GetAllPhysicians'),
    getById: (id) => api.get(`/Physician/GetPhysician/${id}`),
    create: (physicianData) => {
        const formData = new FormData();
        formData.append('Name', physicianData.name);
        formData.append('SpecializationId', physicianData.specializationId);
        formData.append('ClinicalAddress', physicianData.clinicalAddress);
        if (physicianData.image) {
            formData.append('Image', physicianData.image);
        }
        return api.post('/Physician/AddPhysician', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    update: (id, physicianData) => {
        const formData = new FormData();
        formData.append('Name', physicianData.name);
        formData.append('SpecializationId', physicianData.specializationId);
        formData.append('ClinicalAddress', physicianData.clinicalAddress);
        if (physicianData.image) {
            formData.append('Image', physicianData.image);
        }
        return api.put(`/Physician/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    delete: (id) => api.delete(`/Physician/${id}`),
};

// Appointment API calls
export const appointmentService = {
    getAll: () => api.get('/Appointment/GetAllAppointments'),
    getById: (id) => api.get(`/Appointment/GetAppointment/${id}`),
    getByPatient: (patientId) => api.get(`/Appointment/GetByPatient/${patientId}`),
    getByPhysician: (physicianId) => api.get(`/Appointment/GetByPhysician/${physicianId}`),
    create: (appointmentData) => api.post('/Appointment/AddAppointment', {
        appointmentDate: appointmentData.appointmentDate,
        startTime: appointmentData.startTime,
        endTime: appointmentData.endTime,
        patientId: appointmentData.patientId,
        physicianId: appointmentData.physicianId,
    }),
    update: (id, appointmentData) => api.put(`/Appointment/${id}`, {
        appointmentDate: appointmentData.appointmentDate,
        startTime: appointmentData.startTime,
        endTime: appointmentData.endTime,
        patientId: appointmentData.patientId,
        physicianId: appointmentData.physicianId,
    }),
    delete: (id) => api.delete(`/Appointment/${id}`),
};

// Specialization API calls
export const specializationService = {
    getAll: () => api.get('/Specialization/GetAllSpecializations'),
    getById: (id) => api.get(`/Specialization/GetSpecialization/${id}`),
    create: (specData) => api.post('/Specialization/AddSpecialization', {
        name: specData.name,
        description: specData.description,
    }),
    update: (id, specData) => api.put(`/Specialization/${id}`, {
        name: specData.name,
        description: specData.description,
    }),
    delete: (id) => api.delete(`/Specialization/${id}`),
};

export default api;
