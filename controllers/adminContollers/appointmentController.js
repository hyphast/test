const AppointmentService = require('../../services/adminServices/appointments/appointmentService');

class AppointmentController {
  async createAppointment(req, res, next) {
    try {
      const {date, appointments} = req.body;
      // const {user} = req.user; //todo user or admin?
      console.log('new: ', new Date(date), new Date(appointments[0].time))

      const data = await AppointmentService.createAppointment(date, appointments);

      return res.status(201).json({message: 'Запись была добавлена'});
    } catch (e) {
      next(e);
    }
  }

  async getInstructors(req, res, next) {
    try {
      const instructors = await AppointmentService.getInstructors();

      return res.json(instructors);
    } catch (e) {
      next(e);
    }
  }

  async getAppointmentsTime(req, res, next) {
    try {
      const time = await AppointmentService.getAppointmentsTime();

      return res.json(time);
    } catch (e) {
      next(e);
    }
  }

  async getAppointments(req, res, next) {
    try {
      const filter = req.query.filter ? JSON.parse(req.query.filter) : null;
      const range = req.query.range ? JSON.parse(req.query.range) : null;
      const sort = req.query.sort ? JSON.parse(req.query.sort) : null;

      const appointments = await AppointmentService.getAppointments(filter, range, sort);

      return res.set('Content-Range', appointments.countDocuments.toString()).json(appointments.appointments);
    } catch (e) {
      next(e);
    }
  }

  async getOneAppointment(req, res, next) {
    try {
      const id = req.params.id;

      const appointment = await AppointmentService.getOneAppointment(id);

      return res.json(appointment);
    } catch (e) {
      next(e);
    }
  }

  async updateOneAppointment(req, res, next) {
    try {
      const id = req.params.id;
      const {appointments, date} = req.body;
      console.log('appointments', appointments)


      const appointment = await AppointmentService.updateOneAppointment(id, appointments, date);

      res.json(appointment);
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new AppointmentController();