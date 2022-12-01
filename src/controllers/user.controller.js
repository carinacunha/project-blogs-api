require('dotenv/config');
const loginService = require('../services/login.service');
const userService = require('../services/user.service');
const { encoder } = require('../auth/validateJWT');

const createUser = async (req, res) => {
    const { displayName, email, password, image } = req.body;
    const user = await loginService.findByEmail(email);
    if (user) {
      return res.status(409).json({ message: 'User already registered' });
    }

    if (!user) {
      await userService.createUser({ displayName, email, password, image });
      const token = encoder({ email });
      return res.status(201).json({ token });
    }
};

module.exports = {
  createUser,
};