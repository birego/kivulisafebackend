import prisma from '../dbconnexion.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const s_key = process.env.SECRET_KEY || '273829';

export const createUser = async (req, res) => {
  const { firstName, lastName, birthDate, sex, city, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        birthDate: new Date(birthDate),
        sex,
        city,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, s_key, { expiresIn: '72h' });

    res.json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Failed to login user' });
  }
};
