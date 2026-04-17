import axios from 'axios';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000';

export const predictFraud = async (req, res) => {
    try {
        const response = await axios.post(`${ML_SERVICE_URL}/predict/fraud`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'ML service error' });
    }
};

export const predictPrice = async (req, res) => {
    try {
        const response = await axios.post(`${ML_SERVICE_URL}/predict/price`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'ML service error' });
    }
};

export const predictRisk = async (req, res) => {
    try {
        const response = await axios.post(`${ML_SERVICE_URL}/predict/risk`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'ML service error' });
    }
};

export const predictClaim = async (req, res) => {
    try {
        const response = await axios.post(`${ML_SERVICE_URL}/predict/claim`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'ML service error' });
    }
};