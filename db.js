import mongoose from 'mongoose'

export const conn = () => {
    mongoose.connect(process.env.DB_URL, {
        dbName: 'lenslight_tr',
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('Connected to the DB succesfully');
    }).catch((err) => {
        console.log(`DB connection err : ${err}`);
    })
}