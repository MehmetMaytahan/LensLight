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

const checkUser = async (req, res, next) => {
    let user = null
    const token = req.cookies.jwt

    token
        ? jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => { // token varsa cozumleniyor
            err
                ? (res.locals.user = null, next()) // token cozumlenirken hata olusursa local'de ki user null degerini aliyor 
                : (user = await User.findById(decodedToken.userId), res.locals.user = user, next()) // db'den user bulunuyor ve local'de ki user'a esitleniyor
        })
        : (res.locals.user = null, next()) // token yoksa local'de ki user null degerini aliyor
}

export {
    authenticateToken, checkUser
}