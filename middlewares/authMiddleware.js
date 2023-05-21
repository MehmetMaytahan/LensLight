import jwt from 'jsonwebtoken'
import User from '../models/UserModel.js'

const authenticateToken = async (req, res, next) => {
    try {
        const token = req.cookies.jwt

        token
            ? jwt.verify(token, process.env.JWT_SECRET, (err) => {
                err
                    ? res.redirect('/login') // token'ı çözümlerken hata verirse login'e yönlendiriyor
                    : next() // hata yoksa diğer işleme geciyor
            })
            : res.redirect('/login') // token yoksa login'e yönlendiriyor

    } catch (error) {
        res.status(401).json({
            succeded: false,
            message: 'Unauthorized'
        })
    }
}

export {
    authenticateToken
}