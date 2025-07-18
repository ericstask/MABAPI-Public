require('dotenv').config();

module.exports = function (req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.API_KEY) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    next();
};