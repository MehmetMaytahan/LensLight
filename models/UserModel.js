import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const { Schema } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
})

UserSchema.pre("save", function () {
    const user = this

    !user.isModified('password')
        ? next()
        : bcrypt.hash(user.password, 10, (err, hash) => {
            user.password = hash
            next()
        })
})

const User = mongoose.model('User', UserSchema)

export default User