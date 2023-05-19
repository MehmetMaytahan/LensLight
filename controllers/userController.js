import User from '../models/UserModel.js'

const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body)
        res.status(201).render('index', {
            link: 'index'
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error
        })
    }
}

export {
    createUser
}