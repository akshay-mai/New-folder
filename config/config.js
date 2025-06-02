 const config = {
  jwtSecret: process.env.JWT_SECRET || '314b50b0e007ae8b0f666356fb2776efac7f1ebca28a547a1c00d3e2488770c7',
  jwtExpire: process.env.JWT_EXPIRE || '1d',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@example.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
};

module.exports=config