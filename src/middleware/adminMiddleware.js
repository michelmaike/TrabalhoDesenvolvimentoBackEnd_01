module.exports = (req, res, next) => {
  if (req.user.cargo !== 'admin') {
    return res.status(401).json({ erro: 'Acesso negado' });
  }
  next();
};