import { createUser, loginUser } from '../controllers/userController';
import prisma from '../dbconnexion'; // Assurez-vous que cela pointe vers votre fichier dbconnexion.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../dbconnexion', () => ({
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('User Controller', () => {
  describe('createUser', () => {
    it('should create a new user', async () => {
      const req = {
        body: {
          email: 'birego@gmail.com',
          password: 'password123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      bcrypt.hash.mockResolvedValue('hashedPassword');
      prisma.user.create.mockResolvedValue({ id: 1, ...req.body, password: 'hashedPassword' });

      await createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 1, email: 'birego@gmail.com' });
    });

    it('should handle errors', async () => {
      const req = {
        body: {
          email: 'birego@gmail.com',
          password: 'password123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const error = new Error('Failed to create user');
      prisma.user.create.mockRejectedValue(error);

      await createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('loginUser', () => {
    it('should login a user and return a token', async () => {
      const req = {
        body: {
          email: 'birego@gmail.com',
          password: 'password123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const user = { id: 1, email: 'birego@gmail.com', password: 'hashedPassword' };
      prisma.user.findUnique.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token');

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: 'token' });
    });

    it('should return 401 if invalid email or password', async () => {
      const req = {
        body: {
          email: 'birego@gmail.com',
          password: 'password123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      prisma.user.findUnique.mockResolvedValue(null);

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email or password' });
    });

    it('should handle errors', async () => {
      const req = {
        body: {
          email: 'birego@gmail.com',
          password: 'password123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const error = new Error('Failed to login user');
      prisma.user.findUnique.mockRejectedValue(error);

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});
