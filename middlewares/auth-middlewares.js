import jwt from 'jsonwebtoken';

export const validateJWT = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ success: false, message: 'Falta Authorization header' });
    }

    const [bearer, token] = header.split(' ');

    if (bearer !== 'Bearer' || !token) {
      return res.status(401).json({ success: false, message: 'Formato inválido. Usa: Bearer <token>' });
    }

    const payload = jwt.verify(token, process.env.SECRET_KEY);

    req.user = payload;

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token inválido o expirado', error: error.message });
  }
};