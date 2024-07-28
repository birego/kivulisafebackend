import jwt from 'jsonwebtoken';

const s_key = process.env.SECRET_KEY || '273829';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, s_key, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
