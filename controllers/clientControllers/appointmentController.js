const AppointmentService = require('../../services/clientServices/appointmentService');

class AppointmentController {
  async getAppointments(req, res, next) {
    try {
      const {date} = req.query;
      const parseDate = parseInt(date, 10);

      const appointments = await AppointmentService.getAppointments(parseDate);

      return res.json(appointments);
    } catch (e) {
      next(e);
    }
  }

  async addPatient(req, res, next) {
    try {
      const {date, time, userId} = req.body;

      const appointments = await AppointmentService.addPatient(date, time, userId);

      console.log(appointments);
      return res.status(201).json({message: 'Запись была выполнена'});
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new AppointmentController();