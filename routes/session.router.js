const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const { createHash, isValidPassword } = require('../utils/hash');

const router = express.Router();

// 🔹 Registro de Usuario
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) return res.status(400).json({ message: 'El email ya está registrado' });

    const newUser = new User({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password)
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente' });

  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error });
  }
});

// 🔹 Login con JWT
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !isValidPassword(password, user.password)) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secretKey', { expiresIn: '1h' });

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    res.json({ message: 'Inicio de sesión exitoso', token });

  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
});

// 🔹 Ruta `/current` para validar sesión
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ user: req.user });
});

module.exports = router; 
