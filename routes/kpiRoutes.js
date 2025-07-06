const express = require('express');
const kpiController = require('../controllers/kpiController');
const lettersController = require('../controllers/lettersController');

const router = express.Router();

// example:http://localhost:3000/api/employees?FirstName=Xan&LastName=Kramer
router.get('/employees', kpiController.getEmployees);
router.get('/desks', kpiController.getDesks);
router.get('/trans', kpiController.getTrans);

router.get('/letters', lettersController.getLetters);

// router.get('/pfp/', kpiController.getPayForPerformance);
router.post('/pfp', kpiController.getPayForPerformance);
router.get('/ci_boa_postdates', kpiController.getCIAndBOAPostdates);
router.get('/mab_tum_postdates', kpiController.getMABAndTUMPostdates);
router.get('/detailed_posted', kpiController.getDetailedPosted);
router.get('/detailed_employees', kpiController.getDetailedEmployees);

module.exports = router
