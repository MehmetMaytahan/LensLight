import jwt from 'jsonwebtoken'
import User from '../models/UserModel.js'

const authenticateToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]

        !token
            ? res.status(401).json({
                succeded: false,
                message: 'No token available'
            })
            : next()

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET).userId

        req.user = await User.findById(verifyToken)
    } catch (error) {
        res.status(401).json({
            succeded: false,
            message: 'Not authorized'
        })
    }
}

export {
    authenticateToken
}