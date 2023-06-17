const express = require('express')
const router = express.Router();


const {
    newTransport,
    getTransports,
    getTraderTransports,
    getSingleTransport,
    updateTransport,
    deleteTransport,
    createTransportReview,
    getTransportReviews,
    myTransports,
     } = require('../controllers/transportController')

     const { isAuthenticatedUser , authorizeRoles} = require('../middleware/auth');

     //
     router.route('/transports/me').get(isAuthenticatedUser, authorizeRoles('trader'), myTransports);

     router.route('/transports').get(getTransports);
     router.route('/trader/transports').get(getTraderTransports);
    

     router.route('/transport/:id').get(getSingleTransport);
     
     router.route('/trader/transport/new').post(isAuthenticatedUser,authorizeRoles('trader'), newTransport);
     
     router.route('/merchant/transport/:id')
         .put(isAuthenticatedUser, authorizeRoles('trader'), updateTransport)
         .delete(isAuthenticatedUser, authorizeRoles('trader'), deleteTransport);
     
         router.route('/transport/review').put(isAuthenticatedUser, createTransportReview);


         router.route('/transport/reviews').get(isAuthenticatedUser, getTransportReviews);



     module.exports = router;