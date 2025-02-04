import jwt from 'jsonwebtoken';


const secretKey = process.env.JWT_SECRET || 'secretKey'; // Use JWT_SECRET no .env

export const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(403).send('Acesso negado!');
  }

  jwt.verify(token, 'secretKey', (err, user) => {
    if (err) {
      return res.status(403).send('Token inválido');
    }
    req.user = user;
    next();
  });
};
