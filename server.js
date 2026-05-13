require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const HTTP_STATUS = require('./constants/httpStatus');
const MESSAGES = require('./constants/messages');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');

const app = express();

// ─── Database ────────────────────────────────────────────────────────────────
connectDB();

// ─── Security & Logging ──────────────────────────────────────────────────────
app.use(helmet());
const allowedOrigins = [
  'http://localhost:5173',
  'https://mashree-frontend.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, mobile apps, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── Global Rate Limit ───────────────────────────────────────────────────────
app.use('/api', apiLimiter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) =>
  res.status(HTTP_STATUS.OK).json({ success: true, message: 'Server is healthy' })
);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) =>
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: MESSAGES.SERVER.NOT_FOUND_ROUTE,
  })
);

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`[server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);

// Graceful shutdown
process.on('unhandledRejection', (err) => {
  console.error('[unhandledRejection]', err.message);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('[SIGTERM] Shutting down gracefully');
  server.close(() => process.exit(0));
});
