"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemConfig = exports.Staff = exports.Invoice = exports.CartItem = exports.OrderItem = exports.Order = exports.ShippingMethod = exports.PaymentMethod = exports.ProductImage = exports.Product = exports.Category = exports.Address = exports.User = exports.sequelize = void 0;
const connection_1 = __importDefault(require("../database/connection"));
exports.sequelize = connection_1.default;
// Importar todos los modelos
const user_1 = require("./user");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_1.User; } });
const address_1 = require("./address");
Object.defineProperty(exports, "Address", { enumerable: true, get: function () { return address_1.Address; } });
const category_1 = require("./category");
Object.defineProperty(exports, "Category", { enumerable: true, get: function () { return category_1.Category; } });
const product_1 = require("./product");
Object.defineProperty(exports, "Product", { enumerable: true, get: function () { return product_1.Product; } });
const productImage_1 = require("./productImage");
Object.defineProperty(exports, "ProductImage", { enumerable: true, get: function () { return productImage_1.ProductImage; } });
const paymentMethod_1 = require("./paymentMethod");
Object.defineProperty(exports, "PaymentMethod", { enumerable: true, get: function () { return paymentMethod_1.PaymentMethod; } });
const shippingMethod_1 = require("./shippingMethod");
Object.defineProperty(exports, "ShippingMethod", { enumerable: true, get: function () { return shippingMethod_1.ShippingMethod; } });
const order_1 = require("./order");
Object.defineProperty(exports, "Order", { enumerable: true, get: function () { return order_1.Order; } });
const orderItem_1 = require("./orderItem");
Object.defineProperty(exports, "OrderItem", { enumerable: true, get: function () { return orderItem_1.OrderItem; } });
const cartItem_1 = require("./cartItem");
Object.defineProperty(exports, "CartItem", { enumerable: true, get: function () { return cartItem_1.CartItem; } });
const invoice_1 = require("./invoice");
Object.defineProperty(exports, "Invoice", { enumerable: true, get: function () { return invoice_1.Invoice; } });
const staff_1 = require("./staff");
Object.defineProperty(exports, "Staff", { enumerable: true, get: function () { return staff_1.Staff; } });
const systemConfig_1 = require("./systemConfig");
Object.defineProperty(exports, "SystemConfig", { enumerable: true, get: function () { return systemConfig_1.SystemConfig; } });
// =============================================
// DEFINIR RELACIONES
// =============================================
// Relaciones de Usuario
user_1.User.hasMany(address_1.Address, {
    foreignKey: 'user_id',
    as: 'addresses',
    onDelete: 'CASCADE'
});
address_1.Address.belongsTo(user_1.User, {
    foreignKey: 'user_id',
    as: 'user'
});
user_1.User.hasMany(order_1.Order, {
    foreignKey: 'user_id',
    as: 'orders'
});
order_1.Order.belongsTo(user_1.User, {
    foreignKey: 'user_id',
    as: 'customer'
});
user_1.User.hasMany(cartItem_1.CartItem, {
    foreignKey: 'user_id',
    as: 'cartItems',
    onDelete: 'CASCADE'
});
cartItem_1.CartItem.belongsTo(user_1.User, {
    foreignKey: 'user_id',
    as: 'user'
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
category_1.Category.hasMany(product_1.Product, {
    foreignKey: 'category_id',
    as: 'products'
});
product_1.Product.belongsTo(category_1.Category, {
    foreignKey: 'category_id',
    as: 'category'
});
// Relaciones de Producto
product_1.Product.hasMany(productImage_1.ProductImage, {
    foreignKey: 'product_id',
    as: 'images',
    onDelete: 'CASCADE'
});
productImage_1.ProductImage.belongsTo(product_1.Product, {
    foreignKey: 'product_id',
    as: 'product'
});
product_1.Product.hasMany(orderItem_1.OrderItem, {
    foreignKey: 'product_id',
    as: 'orderItems'
});
orderItem_1.OrderItem.belongsTo(product_1.Product, {
    foreignKey: 'product_id',
    as: 'product'
});
product_1.Product.hasMany(cartItem_1.CartItem, {
    foreignKey: 'product_id',
    as: 'cartItems',
    onDelete: 'CASCADE'
});
cartItem_1.CartItem.belongsTo(product_1.Product, {
    foreignKey: 'product_id',
    as: 'product'
});
// Relaciones de Pedido
order_1.Order.hasMany(orderItem_1.OrderItem, {
    foreignKey: 'order_id',
    as: 'items',
    onDelete: 'CASCADE'
});
orderItem_1.OrderItem.belongsTo(order_1.Order, {
    foreignKey: 'order_id',
    as: 'order'
});
order_1.Order.belongsTo(paymentMethod_1.PaymentMethod, {
    foreignKey: 'payment_method_id',
    as: 'paymentMethod'
});
paymentMethod_1.PaymentMethod.hasMany(order_1.Order, {
    foreignKey: 'payment_method_id',
    as: 'orders'
});
order_1.Order.belongsTo(shippingMethod_1.ShippingMethod, {
    foreignKey: 'shipping_method_id',
    as: 'shippingMethod'
});
shippingMethod_1.ShippingMethod.hasMany(order_1.Order, {
    foreignKey: 'shipping_method_id',
    as: 'orders'
});
// Relaciones de direcciones en pedidos
order_1.Order.belongsTo(address_1.Address, {
    foreignKey: 'shipping_address_id',
    as: 'shippingAddress'
});
order_1.Order.belongsTo(address_1.Address, {
    foreignKey: 'billing_address_id',
    as: 'billingAddress'
});
// Relación de Factura
order_1.Order.hasOne(invoice_1.Invoice, {
    foreignKey: 'order_id',
    as: 'invoice'
});
invoice_1.Invoice.belongsTo(order_1.Order, {
    foreignKey: 'order_id',
    as: 'order'
});
