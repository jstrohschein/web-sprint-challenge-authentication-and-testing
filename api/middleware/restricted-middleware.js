module.exports = (req, res, next) => {
  
  if (req.session && req.session.user){
    next()
  }
  if (!req.session){
    res.status(400).json({ message: 'token required' })
  }
  else{
    res.status(403).json({ message: 'token invalid' })
  }
  
};
