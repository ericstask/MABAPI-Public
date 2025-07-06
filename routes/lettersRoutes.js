const express = require('express');
const lettersController = require('../controllers/lettersController');

const router = express.Router();

router.get('/letters', lettersController.getLetters);
router.get('/letters_zip', lettersController.getLettersStream);

module.exports = router
