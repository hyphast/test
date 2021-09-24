const jwt = require('jsonwebtoken');
const config = require('config');
const Token = require('../../models/Token');

class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(payload, config.get('jwtAccessSecret'), {expiresIn: '25m'});
    const refreshToken = jwt.sign(payload, config.get('jwtRefreshSecret'), {expiresIn: '15d'});
    return {accessToken, refreshToken}
  }

  validateAccessToken(token) {
    try{
      const userData = jwt.verify(token, config.get('jwtAccessSecret'));
      return userData;
    } catch (e) {
        return null;
    }
  }

  validateRefreshToken(token) {
    try{
      const userData = jwt.verify(token, config.get('jwtRefreshSecret'));
      console.log(userData);
      return userData;
    } catch (e) {
        return null;
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await Token.findOne({user: userId});
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    console.log(userId, refreshToken);
    const token = await Token.create({user: userId, refreshToken})
    return token;
  }

  async findToken(refreshToken) {
    const tokenData = await Token.findOne({refreshToken});
    return tokenData;
  }

  async removeToken(refreshToken) {
    const tokenData = await Token.deleteOne({refreshToken});
    return tokenData;
  }
}

module.exports = new TokenService();