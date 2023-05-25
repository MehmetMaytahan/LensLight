import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import validator from "validator";

const { Schema } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username area is required'],
        lowercase: true,
        validate: [validator.isAlphanumeric, 'Only Alphanumeric characters']
    },
    password: {
        type: String,
        required: [true, 'Password area is required'],
        minLength: [4, ' At least 4 characters']
    },
    email: {
        type: String,
        required: [true, 'Email area is required'],
        unique: true,
        validate: [validator.isEmail, 'Valid email is required ']
    }
}, {
    timestamps: true
})

UserSchema.pre("save", function (next) {
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