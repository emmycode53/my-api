
function isAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can upload files' });
  }
  next();
}

module.exports = isAdmin;
