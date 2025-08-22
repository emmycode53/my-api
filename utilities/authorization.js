
function isAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can is allowed to use this route' });
  }
  next();
}

module.exports = isAdmin;
