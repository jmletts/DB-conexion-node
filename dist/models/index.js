"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsiteService = exports.OnepayService = exports.Invoice = exports.OrderItem = exports.Order = exports.CartItem = exports.Cart = exports.Customer = exports.ProductCategory = exports.Category = exports.ProductImage = exports.Product = exports.Company = exports.User = exports.sequelize = void 0;
// src/models/index.ts
const connection_1 = __importDefault(require("../database/connection"));
exports.sequelize = connection_1.default;
// Importar todos los modelos
const user_1 = require("./user");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_1.User; } });
const company_1 = require("./company");
Object.defineProperty(exports, "Company", { enumerable: true, get: function () { return company_1.Company; } });
const product_1 = require("./product");
Object.defineProperty(exports, "Product", { enumerable: true, get: function () { return product_1.Product; } });
const productImage_1 = require("./productImage");
Object.defineProperty(exports, "ProductImage", { enumerable: true, get: function () { return productImage_1.ProductImage; } });
const category_1 = require("./category");
Object.defineProperty(exports, "Category", { enumerable: true, get: function () { return category_1.Category; } });
const productCategory_1 = require("./productCategory");
Object.defineProperty(exports, "ProductCategory", { enumerable: true, get: function () { return productCategory_1.ProductCategory; } });
const costumer_1 = require("./costumer");
Object.defineProperty(exports, "Customer", { enumerable: true, get: function () { return costumer_1.Customer; } });
const cart_1 = require("./cart");
Object.defineProperty(exports, "Cart", { enumerable: true, get: function () { return cart_1.Cart; } });
const cartItem_1 = require("./cartItem");
Object.defineProperty(exports, "CartItem", { enumerable: true, get: function () { return cartItem_1.CartItem; } });
const order_1 = require("./order");
Object.defineProperty(exports, "Order", { enumerable: true, get: function () { return order_1.Order; } });
const orderItem_1 = require("./orderItem");
Object.defineProperty(exports, "OrderItem", { enumerable: true, get: function () { return orderItem_1.OrderItem; } });
const invoice_1 = require("./invoice");
Object.defineProperty(exports, "Invoice", { enumerable: true, get: function () { return invoice_1.Invoice; } });
const onepayService_1 = require("./onepayService");
Object.defineProperty(exports, "OnepayService", { enumerable: true, get: function () { return onepayService_1.OnepayService; } });
const websiteService_1 = require("./websiteService");
Object.defineProperty(exports, "WebsiteService", { enumerable: true, get: function () { return websiteService_1.WebsiteService; } });
// =============================================
// DEFINIR RELACIONES
// =============================================
// Relación Usuario - Compañía (1:1)
user_1.User.hasOne(company_1.Company, {
    foreignKey: 'user_id',
    as: 'company',
    onDelete: 'CASCADE'
});
company_1.Company.belongsTo(user_1.User, {
    foreignKey: 'user_id',
    as: 'user'
});
// Relación Compañía - Productos (1:N)
company_1.Company.hasMany(product_1.Product, {
    foreignKey: 'company_id',
    as: 'products',
    onDelete: 'CASCADE'
});
product_1.Product.belongsTo(company_1.Company, {
    foreignKey: 'company_id',
    as: 'company'
});
// Relaciones de Producto con imágenes
product_1.Product.hasMany(productImage_1.ProductImage, {
    foreignKey: 'product_id',
    as: 'images',
    onDelete: 'CASCADE'
});
productImage_1.ProductImage.belongsTo(product_1.Product, {
    foreignKey: 'product_id',
    as: 'product'
});
// Relación Productos - Categorías (N:M) a través de ProductCategory
product_1.Product.belongsToMany(category_1.Category, {
    through: productCategory_1.ProductCategory,
    foreignKey: 'product_id',
    otherKey: 'category_id',
    as: 'categories'
});
category_1.Category.belongsToMany(product_1.Product, {
    through: productCategory_1.ProductCategory,
    foreignKey: 'category_id',
    otherKey: 'product_id',
    as: 'products'
});
// Relación directa para ProductCategory
productCategory_1.ProductCategory.belongsTo(product_1.Product, {
    foreignKey: 'product_id',
    as: 'product'
});
productCategory_1.ProductCategory.belongsTo(category_1.Category, {
    foreignKey: 'category_id',
    as: 'category'
});
// Relaciones de Categoría (auto-referencial para subcategorías)
category_1.Category.hasMany(category_1.Category, {
    foreignKey: 'parent_id',
    as: 'subcategories'
});
category_1.Category.belongsTo(category_1.Category, {
    foreignKey: 'parent_id',
    as: 'parent'
});
// relacion categoria compania
category_1.Category.belongsTo(company_1.Company, { foreignKey: 'company_id', as: 'company' });
// Relación Cliente - Carrito (1:N)
costumer_1.Customer.hasMany(cart_1.Cart, {
    foreignKey: 'customer_id',
    as: 'carts',
    onDelete: 'CASCADE'
});
cart_1.Cart.belongsTo(costumer_1.Customer, {
    foreignKey: 'customer_id',
    as: 'customer'
});
// Relación Carrito - Items del Carrito (1:N)
cart_1.Cart.hasMany(cartItem_1.CartItem, {
    foreignKey: 'cart_id',
    as: 'items',
    onDelete: 'CASCADE'
});
cartItem_1.CartItem.belongsTo(cart_1.Cart, {
    foreignKey: 'cart_id',
    as: 'cart'
});
// Relación Producto - Items del Carrito (1:N)
product_1.Product.hasMany(cartItem_1.CartItem, {
    foreignKey: 'product_id',
    as: 'cartItems'
});
cartItem_1.CartItem.belongsTo(product_1.Product, {
    foreignKey: 'product_id',
    as: 'product'
});
// Relación Carrito - Orden (1:1)
cart_1.Cart.hasOne(order_1.Order, {
    foreignKey: 'cart_id',
    as: 'order'
});
order_1.Order.belongsTo(cart_1.Cart, {
    foreignKey: 'cart_id',
    as: 'cart'
});
// Relación Orden - Items de Orden (1:N)
order_1.Order.hasMany(orderItem_1.OrderItem, {
    foreignKey: 'order_id',
    as: 'items',
    onDelete: 'CASCADE'
});
orderItem_1.OrderItem.belongsTo(order_1.Order, {
    foreignKey: 'order_id',
    as: 'order'
});
// Relación Producto - Items de Orden (1:N)
product_1.Product.hasMany(orderItem_1.OrderItem, {
    foreignKey: 'product_id',
    as: 'orderItems'
});
orderItem_1.OrderItem.belongsTo(product_1.Product, {
    foreignKey: 'product_id',
    as: 'product'
});
// Relación Orden - Factura (1:1)
order_1.Order.hasOne(invoice_1.Invoice, {
    foreignKey: 'order_id',
    as: 'invoice'
});
invoice_1.Invoice.belongsTo(order_1.Order, {
    foreignKey: 'order_id',
    as: 'order'
});
// Relación Compañía - Servicio OnePay (1:1)
company_1.Company.hasOne(onepayService_1.OnepayService, {
    foreignKey: 'company_id',
    as: 'onepayService',
    onDelete: 'CASCADE'
});
onepayService_1.OnepayService.belongsTo(company_1.Company, {
    foreignKey: 'company_id',
    as: 'company'
});
// Relación Compañía - Servicio Website (1:1)
company_1.Company.hasOne(websiteService_1.WebsiteService, {
    foreignKey: 'company_id',
    as: 'websiteService',
    onDelete: 'CASCADE'
});
websiteService_1.WebsiteService.belongsTo(company_1.Company, {
    foreignKey: 'company_id',
    as: 'company'
});
