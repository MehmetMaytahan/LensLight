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

        same
            ?
            res.status(200).json({
                user,
                jwtToken: createToken(user._id)
            })

            : res.status(401).json({
                succeded: false,
                error: "Passwords are not matched"
            })

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

export {
    createUser, loginUser
}