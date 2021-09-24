const {Router} = require('express');
const {check} = require('express-validator');
const userController = require('../controllers/userController');
const profileController = require('../controllers/clientControllers/profileController');
const appointmentController = require('../controllers/clientControllers/appointmentController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.post('/auth/registration',
  [
    check('firstName', 'Invalid first name').exists().trim(),
    check('lastName', 'Invalid last name').exists().trim(),
    check('email', 'Invalid email').isEmail(),
    check('password', 'Password length less than 6 characters').isLength({ min: 6, max: 32}),
  ],
  userController.registration);
router.post('/auth/login',
  [
    check('email', 'Incorrect email address').normalizeEmail({ gmail_remove_dots: false }).isEmail(),
    check('email', 'Incorrect password').exists(),
  ],
  userController.login);
router.post('/auth/logout', userController.logout);
router.get('/auth/activate/:link', userController.activate);
router.get('/auth/refresh', userController.refresh);

router.get('/appointments', authMiddleware, appointmentController.getAppointments);
router.put('/appointments', authMiddleware, appointmentController.addPatient);

router.get('/profile', authMiddleware, profileController.getUserProfile);

module.exports = router;