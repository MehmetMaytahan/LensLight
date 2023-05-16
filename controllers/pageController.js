const getHomePage = (req, res) => {
    res.render('index', {
        link: 'index'
    })
}
const getAboutPage = (req, res) => {
    res.render('about', {
        link: 'about'
    })
}

const getPhotosPage = (req,res) =>{
    res.render('photos',{
        link:'photos'
    })
}

export {
    getHomePage, getAboutPage, getPhotosPage
}