const express = require('express');
const router = express.Router();

const Agenda = require('../models/Agenda');
const { isAuthenticated } = require('../helpers/auth');

router.get('/agenda', (req, res)=>{
  res.render('agenda/agenda')
});

module.exports = router;