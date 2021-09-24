const usersService = require('../../services/adminServices/users/usersService');

class UsersController {
  async getUsers(req, res, next) {
    try {
      const filter = req.query.filter ? JSON.parse(req.query.filter) : null;
      const range = req.query.range ? JSON.parse(req.query.range) : null;
      const sort = req.query.sort ? JSON.parse(req.query.sort) : null;

      const users = await usersService.getUsers(filter, range, sort);

      return res.set('Content-Range', users.countDocuments.toString()).json(users.usersList);
    } catch (e) {
      next(e);
    }
  }

  async getOneUser(req, res, next) {
    try {
      const id = req.params.id;

      const user = await usersService.getOneUser(id);

      return res.json(user);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UsersController();