const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');

router.route('/')
    .get(statesController.getAllStates)

router.route('/:state')
    .get(statesController.getState);
router.route('/:state/capital')
    .get(statesController.getStateCapital);
router.route('/:state/nickname')
    .get(statesController.getStateNickname);
router.route('/:state/population')
    .get(statesController.getStatePopulation);
router.route('/:state/admission')
    .get(statesController.getStateAdmission);

router.route('/:state/funfact')
    .get(statesController.getStateFunfact)
    .post(statesController.createNewStateFact)
    .patch(statesController.updateStateFact)
    .delete(statesController.deleteStateFact);
    

module.exports = router;
