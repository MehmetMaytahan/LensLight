import Photo from "../models/PhotoModel.js";

const createPhoto = async (req, res) => {
    try {
        const photo = await Photo.create(req.body)
        res.status(201).redirect('/users/dashboard')
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error
        })
    }
}

const getAllPhotos = async (req, res) => {
    try {
        const photos = await Photo.find()
        res.status(200).render('photos', {
            link: 'photos',
            photos
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error
        })
    }
}

const getAPhoto = async (req, res) => {
    try {
        const photo = await Photo.findById({ _id: req.params.id })
        res.status(200).render('photo', {
            link: 'photos',
            photo
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error
        })
    }
}

export {
    createPhoto, getAllPhotos, getAPhoto
}