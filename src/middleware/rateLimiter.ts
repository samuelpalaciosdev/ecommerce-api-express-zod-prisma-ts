import rateLimiter from 'express-rate-limit';

const rateLimit = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per `window` (here, per 1 minute)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again later',
});

export default rateLimit;
