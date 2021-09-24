const TimeTemplate = require('../../../models/TimeTemplate');
const Appointments = require('../../../models/Appointments');
const DateService = require('../../dateService');

class AppointmentHelpers {
  async initAppointmentsTime() {
    const time = await TimeTemplate.find();

    const appointment = time.map(i => ({
        time: i.time,
        patients: [],
        numberPatients: 0,
      }
    ))
    return appointment;
  }

  async newAppointment(date) {
    const app = await this.initAppointmentsTime();

    const appointment = {
      date,
      appointments: app,
      numberAllPatients: 0,
    }
    // console.log('appointment', appointment.app);

    return appointment;
  }

  async createAppointment(date) {
    const appointment = this.newAppointment(date);

    return appointment;
  }

  async handlePagination(range) {
    const date = DateService.dateToUtc(new Date());
    const dateOffset = range[0];
    const amountOnePortion = range[1] - range[0] + 1;
    const startDate = date.setDate(date.getDate() + dateOffset);

    const {start, end} = DateService.dateSearchRange(startDate, amountOnePortion);

    const itemsList = await Appointments.find({date: {$gte: start, $lt: end}});

    let appointmentsList = [];
    const curDate = new Date(startDate);
    for (let i = 0; i < amountOnePortion; i++) {
      const range = DateService.dateSearchRange(curDate.getTime());
      const app = itemsList.find(item => {
        const itemDate = new Date(item.date).getTime();
        return itemDate >= range.start && itemDate <= range.end
      })

      if (!app) {
        const newApp = await this.newAppointment(curDate.toISOString());
        appointmentsList.push(newApp);
      }

      curDate.setDate(curDate.getDate() + 1);
    }

    await Appointments.insertMany(appointmentsList);

    return {start, end}
  }
}

module.exports = new AppointmentHelpers();