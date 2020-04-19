const jwt = require('jsonwebtoken');

module.exports = function(req,res,next) {
    // Get header token if exists
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied');

    // Verify token
    try {
        const verified = jwt.verify(token, process.env.TOKEN);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
}