const Users = require('../../models/User');
const ProfileDto = require('../../dtos/profileDto');

class ProfileService {
  async getUserProfile(id) {
    const profile = await Users.findOne({_id: id});

    const profileDto = new ProfileDto(profile); // id, firstName, lastName, gender, phoneNumber

    return {profile: profileDto};
  }
}

module.exports = new ProfileService();