const {Router} = require('express');
const userController = require('../controllers/adminContollers/usersController');
const appointmentController = require('../controllers/adminContollers/appointmentController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getOneUser);
router.get('/appointments', appointmentController.getAppointments);
router.get('/appointments/:id', appointmentController.getOneAppointment);
router.put('/appointments/:id', appointmentController.updateOneAppointment);


router.post('/appointments', appointmentController.createAppointment); //todo AuthMiddleware
router.get('/appointments/time', appointmentController.getAppointmentsTime); //todo AuthMiddleware
// router.get('/created-appointments', appointmentController.getCreatedAppointments); //todo AuthMiddleware

router.get('/instructors', appointmentController.getInstructors); //todo AuthMiddleware

module.exports = router;