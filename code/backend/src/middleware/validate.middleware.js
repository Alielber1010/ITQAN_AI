/**
 * Generic Joi validation middleware.
 * Usage: router.post('/route', validate(schema), handler)
 */
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const messages = error.details.map(d => d.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: messages,
    });
  }

  // Replace body with validated + sanitized values
  req.body = value;
  next();
};

module.exports = validate;
