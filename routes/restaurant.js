const express = require('express')
const router = express.Router();


const {
    newRestaurant,
    getRestaurants,
    getTraderRestaurants,
    getSingleRestaurant,
    updateRestaurant,
    deleteRestaurant,
    createRestaurantReview,
    getRestaurantReviews,
    myRestaurants,

     } = require('../controllers/restaurantController')

     const { isAuthenticatedUser , authorizeRoles} = require('../middleware/auth');

     router.route('/restaurants/me').get(isAuthenticatedUser,authorizeRoles('trader'), myRestaurants);


     router.route('/restaurants').get(getRestaurants);
     router.route('/trader/restaurants').get(getTraderRestaurants);
    

     router.route('/restaurant/:id').get(getSingleRestaurant);
     
     router.route('/trader/restaurant/new').post(isAuthenticatedUser,authorizeRoles('trader'), newRestaurant);
     
     router.route('/merchant/restaurant/:id')
         .put(isAuthenticatedUser, authorizeRoles('trader'), updateRestaurant)
         .delete(isAuthenticatedUser, authorizeRoles('trader'), deleteRestaurant);
     
    
         router.route('/restaurant/review').put(isAuthenticatedUser, createRestaurantReview);


         router.route('/restaurant/reviews').get(isAuthenticatedUser, getRestaurantReviews);


     module.exports = router;