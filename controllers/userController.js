import User from '../models/UserModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body)
        res.status(201).render('login', {
            link: 'login'
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })

        let same = false

        user
            ? same = await bcrypt.compare(password, user.password)
            : res.status(401).json({
                succeded: false,
                error: "There is no such user"
            })

        if (same) {
            const token = createToken(user._id) // token oluşturduk
            res.cookie('jwt', token, { // oluşturduğumuz token'ı cookie'lerin içine yerleştiriyoruz 
                httpOnly: true, // http isteklerinde bulunulabilmesi için true veriyoruz
                maxAge: 1000 * 60 * 60 * 24 // token'ın ne kadar süre erişilebilir olacak onu ayarladık
            })
            console.log(token);
            res.status(200).redirect('/users/dashboard')

        } else {
            res.status(401).json({
                succeded: false,
                error: "Passwords are not matched"
            })
        }

    } catch (error) {
        res.status(500).json({
            succeded: false,
            error
        })
    }
}

const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
}

const getDashboardPage = (req, res) => {
    res.render('dashboard', {
        link: 'dashboard'
    })
}

export {
    createUser, loginUser, getDashboardPage
}