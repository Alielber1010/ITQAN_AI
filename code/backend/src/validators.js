const Joi = require('joi');

// ── Auth Schemas ──────────────────────────────────────────────
const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(255).required()
    .messages({ 'string.min': 'Name must be at least 2 characters.' }),
  email: Joi.string().email().required()
    .messages({ 'string.email': 'Please provide a valid email address.' }),
  password: Joi.string().min(6).max(128).required()
    .messages({ 'string.min': 'Password must be at least 6 characters.' }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// ── Profile Schemas ───────────────────────────────────────────
const profileSchema = Joi.object({
  userId: Joi.string().required(),
  income: Joi.number().min(0).default(0),
  assets: Joi.number().min(0).default(0),
  liabilities: Joi.number().min(0).default(0),
  savings: Joi.number().min(0).default(0),
});

// ── Goals Schemas ─────────────────────────────────────────────
const goalCreateSchema = Joi.object({
  goalId: Joi.string().allow(null, '').optional(),
  goalType: Joi.string().trim().min(1).max(50).required()
    .messages({ 'string.empty': 'Goal type is required.' }),
  targetAmount: Joi.number().positive().required()
    .messages({ 'number.positive': 'Target amount must be a positive number.' }),
  currentAmount: Joi.number().min(0).default(0),
  deadline: Joi.date().iso().allow(null, '').optional(),
  status: Joi.string().valid('active', 'completed', 'paused').default('active'),
});

// ── AI Chat Schema ────────────────────────────────────────────
const chatSchema = Joi.object({
  message: Joi.string().trim().min(1).max(5000).required()
    .messages({ 'string.empty': 'Message cannot be empty.' }),
  history: Joi.array().items(Joi.object({
    sender: Joi.string().valid('user', 'ai').required(),
    text: Joi.string().required(),
  })).optional(),
  userId: Joi.string().allow(null, '').optional(),
  sessionId: Joi.string().allow(null, '').optional(),
});

// ── Shariah Schemas ───────────────────────────────────────────

const zakatSchema = Joi.object({
  savings: Joi.number().min(0).default(0),
  gold: Joi.number().min(0).default(0),
  silver: Joi.number().min(0).default(0),
  investments: Joi.number().min(0).default(0),
  liabilities: Joi.number().min(0).default(0),
  userId: Joi.string().allow(null, '').optional(),
});

// ── Admin Schemas ─────────────────────────────────────────────
const ruleSchema = Joi.object({
  ruleId: Joi.string().allow(null, '').optional(),
  category: Joi.string().trim().min(1).required()
    .messages({ 'string.empty': 'Category is required.' }),
  description: Joi.string().trim().min(1).required()
    .messages({ 'string.empty': 'Description is required.' }),
  sourceReference: Joi.string().allow(null, '').optional(),
});

const userRoleSchema = Joi.object({
  userId: Joi.string().required(),
  role: Joi.string().valid('User', 'Admin').required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  profileSchema,
  goalCreateSchema,
  chatSchema,

  zakatSchema,
  ruleSchema,
  userRoleSchema,
};
