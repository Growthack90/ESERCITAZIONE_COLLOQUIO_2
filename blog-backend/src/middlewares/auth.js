const auth = (req, res, next) => {
  const { ADMIN_TOKEN } = process.env;

  if (!ADMIN_TOKEN) {
    return res.status(500).json({ message: "ADMIN_TOKEN is not configured" });
  }

  const authorization = req.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;

  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};

export default auth;
