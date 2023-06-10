const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;
const jwksRsa = require('jwks-rsa');

const firstlineDomain = process.env.FIRSTLINE_DOMAIN;
const issuerUrl = ['localhost', '127.0.0.1'].some((localDomain) =>
  firstlineDomain.includes(localDomain),
)
  ? `http://${firstlineDomain}`
  : `https://${firstlineDomain}`;

const options = {
  secretOrKeyProvider: jwksRsa.passportJwtSecret({
    cache: false,
    rateLimit: false,
    jwksRequestsPerMinute: 5,
    jwksUri: `${issuerUrl}/api/v3/.well-known/jwks.json`,
  }),
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  audience: process.env.FIRSTLINE_AUDIENCE,
  issuer: `${issuerUrl}/`,
  algorithms: ['RS256'],
  passReqToCallback: true,
};

module.exports = function () {
  const strategy = new JwtStrategy(options, function (request, payload, done) {
    if (!payload)
      return done(
        new Error('An error occurred while parsing the JWT (undefined)'),
        null,
      );

    try {
      const accessToken = request.headers['authorization'].split(' ')[1];

      const user = {
        accessToken: accessToken,
        sub: payload.sub,
        email: payload.email,
        username: payload.username,
        roles: payload.roles,
        permissions: payload.permissions,
      };
      return done(null, user);
    } catch (e) {
      console.error(e);
      return done(new Error('An error occurred while parsing the JWT.'), null);
    }
  });

  passport.use(strategy);

  return {
    initialize: function () {
      return passport.initialize();
    },
  };
};

