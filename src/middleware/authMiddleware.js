const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ erro: 'Token é obrigatório' });
  }

  const token = authHeader.split(' ')[1]; // Extrai o token após "Bearer"
  if (!token) {
    return res.status(401).json({ erro: 'Token é obrigatório' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ erro: 'Token inválido' });
    }
    req.user = decoded;
    next();
  });
};