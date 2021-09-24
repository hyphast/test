const ProfileService = require('../../services/clientServices/profileService');

class ProfileController {
  async getUserProfile(req, res, next) {
    try {
      const {id} = req.user;
      const profile = await ProfileService.getUserProfile(id);

      return res.json(profile);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ProfileController();