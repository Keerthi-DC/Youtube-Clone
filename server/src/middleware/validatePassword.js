export const validatePassword = (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  const errors = [];

  if (password.length < 8) {
    errors.push('at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('at least one uppercase letter (A-Z)');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('at least one lowercase letter (a-z)');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('at least one number (0-9)');
  }
  if (!/[@$!%*?&^#()_-]/.test(password)) {
    errors.push('at least one special character (@$!%*?& etc.)');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: `Password must contain: ${errors.join(', ')}.`
    });
  }

  next();
};
