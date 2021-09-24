class DateService {
  dateSearchRange(date, offset = 1) {
    const d = new Date(date);
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    //console.log('start: ', start, new Date(start));

    const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + offset).getTime();
    //console.log('end1: ', end, new Date(end));

    return {start, end};
  }

  dateToUtc(date) {
    //const d = new Date(date);
    const utc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
                                  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(),
    ));
    //console.log('utc', utc);
    //console.log('utc.toUTCString()', utc.toUTCString());

    return utc;
  }
}

module.exports = new DateService();