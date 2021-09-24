const User = require('../../../models/User');
const CommonService = require('../common/commonService');

class UsersService {
  async getOneUser(id) {
    const user = await User.findOne({_id: id});

    const userList = CommonService.withIdField(user)

    return userList;
  }

  async getUsers(filter, range, sort) {
    const match = CommonService.handleFilter(filter);
    const sortBy = CommonService.handleSort(sort);
    const {skip, lim} = CommonService.handlePagination(range);
    console.log('filter', filter)
    console.log('match', match);

    const users = await User.find(match).sort(sortBy).limit(lim).skip(skip);

    //console.log('users', users);

    const countDocuments = await User.countDocuments({});

    const usersList = CommonService.withIdField(users)

    return {usersList, countDocuments};
  }
}

module.exports = new UsersService();