const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const MESSAGES = require('../constants/messages');

/**
 * Fetch paginated, filtered product list.
 * Search matches title, description, and location via case-insensitive regex.
 */
const getProducts = async ({ search, category, minPrice, maxPrice, page = 1, limit = 12 }) => {
  const filter = {};

  // Regex search across title, description, location — supports partial matches
  if (search && search.trim()) {
    const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [
      { title: regex },
      { description: regex },
      { location: regex },
    ];
  }

  if (category) filter.category = category;

  // Only apply price filter when values are actual numbers
  const min = minPrice !== undefined && minPrice !== '' ? Number(minPrice) : null;
  const max = maxPrice !== undefined && maxPrice !== '' ? Number(maxPrice) : null;
  if (min !== null || max !== null) {
    filter.price = {};
    if (min !== null && !isNaN(min)) filter.price.$gte = min;
    if (max !== null && !isNaN(max)) filter.price.$lte = max;
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('createdBy', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    },
  };
};

/**
 * Fetch distinct product categories.
 */
const getCategories = async () => Product.distinct('category');

/**
 * Fetch a single product by ID.
 */
const getProductById = async (id) => {
  const product = await Product.findById(id).populate('createdBy', 'name avatar').lean();
  if (!product) throw ApiError.notFound(MESSAGES.PRODUCT.NOT_FOUND);
  return product;
};

/**
 * Create a new product listing.
 */
const createProduct = async ({ title, description, price, category, location, images, createdBy }) => {
  const product = await Product.create({
    title,
    description,
    price: Number(price),
    category,
    location: location || '',
    images: images || [],
    createdBy,
  });
  return product;
};

/**
 * Update an existing product.
 */
const updateProduct = async (id, updates) => {
  const product = await Product.findById(id);
  if (!product) throw ApiError.notFound(MESSAGES.PRODUCT.NOT_FOUND);

  const allowedFields = ['title', 'description', 'price', 'category', 'location', 'images'];
  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      product[field] = field === 'price' ? Number(updates[field]) : updates[field];
    }
  });

  await product.save();
  return product;
};

/**
 * Delete a product by ID.
 */
const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw ApiError.notFound(MESSAGES.PRODUCT.NOT_FOUND);
};

module.exports = {
  getProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
