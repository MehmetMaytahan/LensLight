import Photo from "../models/PhotoModel.js";

const createPhoto = async (req, res) => {
    try {
        const photo = await Photo.create(req.body)
        res.status(201).json({
            succeded: true,
            photo
        })
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

export {
    createPhoto, getAllPhotos
}