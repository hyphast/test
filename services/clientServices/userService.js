const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const config = require('config');
const mailService = require('./mailService');
const tokenService = require('./tokenService');
const UserDto = require('../../dtos/userDto');
const ApiError = require('../../exceptions/apiError');
const User = require('../../models/User');


class UserService {
  async registration(firstName, lastName, email, password, gender, phoneNumber) {
    const candidate = await User.findOne( {email} );

    if (candidate) {
      throw ApiError.BadRequest(
        'Пользователь с таким Email0 уже существует',
        [{email: 'Пользователь с таким Email уже существует'}]
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const activationLink = uuid.v4();
    const user = await User.create({firstName, lastName, email,
                                    password: hashedPassword, gender,
                                    phoneNumber, activationLink});

    await mailService.sendActivationMail(email, `${config.get('apiUrl')}/api/auth/activate/${activationLink}`);
    const userDto = new UserDto(user); // id, email, phoneNumber, isActivated
    const tokens = tokenService.generateToken({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {...tokens, user: userDto}
  }

  async activate(activationLink) {
    const user = await User.findOne({activationLink});
    if (!user) {
      throw ApiError.BadRequest('Неккоректная ссылка активации');
    }

    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await User.findOne({ email });

    if (!user) {
      throw ApiError.BadRequest(
        'Пользователь с таким email не найден',
        [{email: 'Пользователь с таким email не найден'}]
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw ApiError.BadRequest('Неверный пароль', [{password: 'Неверный пароль'}]);
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {...tokens, user: userDto}
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token; //todo убрать
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = tokenService.findToken((refreshToken));

    if (!userData || !tokenFromDb) {
      console.log('Refresh Token DB');
      throw ApiError.UnauthorizedError();
    }

    const user = await User.findById(userData.id);

    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {...tokens, user: userDto}
  }
}

module.exports = new UserService();