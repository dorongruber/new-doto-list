function AuthenticateToken(req, res, next) {
  const authHeader = req.header['authorization'];
  const token = authHeader && authHeader.splice(' ')[1];

  if ( token == null) res.sendStatus(401);

  jwt.verify(token, process,env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  })
}

module.exports.AuthenticateToken = AuthenticateToken;
