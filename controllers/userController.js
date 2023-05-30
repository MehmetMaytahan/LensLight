import User from '../models/UserModel.js'
import Photo from '../models/PhotoModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body)
        res.status(201).json({ user: user._id })
    } catch (error) {

        // catch blogundan gelen hatayi ozellestirmek icin yeni hata objesi olusturuyoruz 
        let errors = {}

        // ayni mail adresi ile kayit olmaya calistiginda bu sekilde yakaliyoruz
        if (error.code === 11000) { errors.email = 'The Email is already registered' }

        // girilen parametreler yanlis veya eksikse bura yakaliyor ve olusturdugumuz hata objesine kayit ediyoruz
        if (error.name === "ValidationError") { Object.keys(error.errors).forEach(key => { errors[key] = error.errors[key].message }) }

        // ozellestirdigimiz hatayi geri donduruyoruz
        res.status(400).json(errors)
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

const getDashboardPage = async (req, res) => {
    const photos = await Photo.find({ user: res.locals.user._id })
    const user = await User.findById({ _id: res.locals.user._id }).populate(["followers", "followings"])

    res.render('dashboard', {
        photos,
        user,
        link: 'dashboard'
    })
}

const getAllUsers = async (req, res) => {
    const users = await User.find({
        _id: {
            $ne: res.locals.user._id
        }
    })
    res.status(200).render('users', {
        link: 'users',
        users
    })
}

const getAUser = async (req, res) => {
    const user = await User.findById(req.params.id)

    const inFollower = user.followers.some(follower => {
        return follower.equals(res.locals.user._id)
    })

    if (user) {
        const photos = await Photo.find({ user: user._id })

        res.status(200).render('user', {
            link: 'users',
            user,
            photos,
            inFollower
        })
    } else {
        res.status(204).redirect('/login')
    }
}

const getFollow = async (req, res) => {

    try {
        let user = await User.findByIdAndUpdate(req.params.id,
            {
                $push: { followers: res.locals.user._id } // $push ile mongoDB fonksiyonunu kullanarak dizi'ye ekleme yapiyoruz
            },
            { new: true })

        user = await User.findByIdAndUpdate({ _id: res.locals.user._id },
            {
                $push: { followings: req.params.id }
            },
            { new: true })
        res.status(200).redirect(`/users/${req.params.id}`)
    } catch (error) {

    }


}

const getUnfollow = async (req, res) => {

    try {
        let user = await User.findByIdAndUpdate(req.params.id,
            {
                $pull: { followers: res.locals.user._id } // $pull ile mongoDB fonksiyonunu kullanarak dizi'den çıkarma yapiyoruz
            }, { new: true })

        user = await User.findByIdAndUpdate(res.locals.user._id,
            {
                $pull: { followings: req.params.id }
            }, { new: true })

        res.status(200).redirect(`/users/${req.params.id}`)
    } catch (error) {

    }



}

export {
    createUser, loginUser, getDashboardPage, getAllUsers, getAUser, getFollow, getUnfollow
}