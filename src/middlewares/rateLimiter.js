const rateLimit = require('express-rate-limit');

const { TooManyRequest } = require('../errors');

class RateLimiter {
  constructor() {
    this.commonWindow = 15 * 60 * 1000; // 15 minutes
    this.commonLimit = 100; // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  }

  handleRateLimitExceeded(req, res, next) {
    next(new TooManyRequest());
  }

  commonLimiter() {
    return rateLimit({
      windowMs: this.commonWindow,
      limit: this.commonLimit,
      handler: this.handleRateLimitExceeded,
    });
  }

  sensitiveLimiter() {
    return rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minutes
      max: 10,
      handler: this.handleRateLimitExceeded,
    });
  }
}

module.exports = RateLimiter;
