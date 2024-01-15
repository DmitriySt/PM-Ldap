export const appConfig = () => ({
  app: {
    mode: process.env.NODE_ENV || 'production',
    port: process.env.APP_PORT || 5000,
    cookieSecret: process.env.COOKIE_SECRET,
    passSecret: process.env.PASS_SECRET,
    passSalt: process.env.PASS_SALT,
  },
});
