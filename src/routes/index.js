const express = require('express');
const router = express.Router();
const passport = require('passport');

//ruta de inicio
router.get('/', passport.authenticate('local', {
    successRedirect: '/agenda',
    failureRedirect: '/login',
    failureFlash:true
}))

router.get('/about', (req, res) => {
    res.render('about');
})

module.exports = router;