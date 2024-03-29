import Photo from "../models/PhotoModel.js";
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

const createPhoto = async (req, res) => {

    const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath, // yüklediğimiz görselin dosya konumu ' image.tempFilePath ' de kayıtlı
        {
            use_filename: true,
            folder: 'lenslight'
        }
    )

    try {
        await Photo.create({
            ...req.body,
            user: res.locals.user._id,
            url: result.secure_url,
            imageId: result.public_id
        })

        fs.unlinkSync(req.files.image.tempFilePath)
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
        const photos = res.locals.user
            ? await Photo.find({ user: { $ne: res.locals.user.id } }).sort({ createdAt: -1 })
            : await Photo.find().sort({ createdAt: -1 })
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
        const photo = await Photo.findById({ _id: req.params.id }).populate('user')
        res.status(200).render('photo', {
            link: 'photos',
            photo,
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error
        })
    }
}

const deletePhoto = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id)
        await cloudinary.uploader.destroy(photo.imageId)
        await Photo.findOneAndRemove({ _id: photo._id })

        res.status(200).redirect('/users/dashboard')
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error
        })
    }
}

const updatePhoto = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id)

        if (req.files) {
            await cloudinary.uploader.destroy(photo.imageId)

            const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
                folder: 'lenslight',
                use_filename: true
            })

            photo.url = result.secure_url
            photo.imageId = result.public_id
            fs.unlinkSync(req.files.image.tempFilePath)
        }

        photo.name = req.body.name
        photo.description = req.body.description

        await photo.save()

        res.status(200).redirect(`/photos/${req.params.id}`)
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error
        })
    }
}

export {
    createPhoto, getAllPhotos, getAPhoto, deletePhoto, updatePhoto
}