const jwt = require('jsonwebtoken')

const verifyJWTUser = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader?.startsWith('Bearer ')) {
        console.log(authHeader);
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Forbidden' })
        req.user = decoded
        next()
    })
}

const verifyJWTAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' })
        }
        if (decoded.role !== 'Admin') {
            console.log(decoded);
            return res.status(403).json({ message: 'Forbidden: Admin access required' });
        }
        req.user = decoded
        next()
    })
}

module.exports = { verifyJWTUser, verifyJWTAdmin }