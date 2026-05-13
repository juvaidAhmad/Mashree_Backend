const productService = require('../services/product.service');
const ApiResponse = require('../utils/ApiResponse');
const MESSAGES = require('../constants/messages');

/**
 * GET /api/products
 */
const getProducts = async (req, res) => {
  const { search, category, minPrice, maxPrice, page, limit } = req.query;

  const { products, meta } = await productService.getProducts({
    search,
    category,
    minPrice,
    maxPrice,
    page,
    limit,
  });

  return ApiResponse.success(res, MESSAGES.PRODUCT.FETCHED, { products }, meta);
};

/**
 * GET /api/products/categories
 */
const getCategories = async (req, res) => {
  const categories = await productService.getCategories();
  return ApiResponse.success(res, MESSAGES.PRODUCT.CATEGORIES_FETCHED, { categories });
};

/**
 * GET /api/products/:id
 */
const getProductById = async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  return ApiResponse.success(res, MESSAGES.PRODUCT.SINGLE_FETCHED, { product });
};

/**
 * POST /api/products
 */
const createProduct = async (req, res) => {
  const { title, description, price, category, location } = req.body;
  const images = req.files?.map((f) => f.path) || [];

  const product = await productService.createProduct({
    title,
    description,
    price,
    category,
    location,
    images,
    createdBy: req.user._id,
  });

  return ApiResponse.created(res, MESSAGES.PRODUCT.CREATED, { product });
};

/**
 * PUT /api/products/:id
 */
const updateProduct = async (req, res) => {
  const updates = { ...req.body };
  if (req.files?.length) updates.images = req.files.map((f) => f.path);

  const product = await productService.updateProduct(req.params.id, updates);
  return ApiResponse.success(res, MESSAGES.PRODUCT.UPDATED, { product });
};

/**
 * DELETE /api/products/:id
 */
const deleteProduct = async (req, res) => {
  await productService.deleteProduct(req.params.id);
  return ApiResponse.success(res, MESSAGES.PRODUCT.DELETED);
};

module.exports = {
  getProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
