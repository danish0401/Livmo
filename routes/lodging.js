const express = require('express')
const router = express.Router();


const {
    newLodging,
    getLodgings,
    getTraderLodgings,
    getSingleLodging,
    updateLodging,
    deleteLodging,
    createLodgingReview,
    getLodgingeReviews,
    myLodgings,

} = require('../controllers/lodgingController')

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

//
router.route('/lodgings/me').get(isAuthenticatedUser, authorizeRoles('trader'), myLodgings);


router.route('/lodgings').get(getLodgings);
router.route('/trader/lodgings').get(getTraderLodgings);


router.route('/lodging/:id').get(getSingleLodging);

router.route('/trader/lodging/new').post(isAuthenticatedUser, authorizeRoles('trader'), newLodging);

router.route('/merchant/lodging/:id')
    .put(isAuthenticatedUser, authorizeRoles('trader'), updateLodging)
    .delete(isAuthenticatedUser, authorizeRoles('trader'), deleteLodging);


router.route('/lodging/review').put(isAuthenticatedUser, createLodgingReview);


router.route('/lodging/reviews').get(isAuthenticatedUser, getLodgingeReviews);


module.exports = router;