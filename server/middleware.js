// const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You need to be logged in to do that!');
        return res.redirect('/login');
    }
    next();
}

// module.exports.isAuthor = async (req, res, next) => {
//     const { id } = req.params;
//     const campground = await Campground.findById(id);
//     if (!campground.author.equals(req.user._id)) {
//         req.flash('error', 'Only campground authors can do that!');
//         return res.redirect(`/campgrounds/${id}`);
//     } 
//     next();
// }