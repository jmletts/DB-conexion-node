// src/models/index.ts
import sequelize from '../database/connection';

// Importar todos los modelos
import { User } from './user';
import { Company } from './company';
import { Product } from './product';
import { ProductImage } from './productImage';
import { Category } from './category';
import { ProductCategory } from './productCategory';
import { Customer } from './costumer';
import { Cart } from './cart';
import { CartItem } from './cartItem';
import { Order } from './order';
import { OrderItem } from './orderItem';
import { Invoice } from './invoice';
import { OnepayService } from './onepayService';
import { WebsiteService } from './websiteService';

// =============================================
// DEFINIR RELACIONES
// =============================================

// Relación Usuario - Compañía (1:1)
User.hasOne(Company, { 
  foreignKey: 'user_id', 
  as: 'company',
  onDelete: 'CASCADE' 
});
Company.belongsTo(User, { 
  foreignKey: 'user_id', 
  as: 'user' 
});

// Relación Compañía - Productos (1:N)
Company.hasMany(Product, { 
  foreignKey: 'company_id', 
  as: 'products',
  onDelete: 'CASCADE' 
});
Product.belongsTo(Company, { 
  foreignKey: 'company_id', 
  as: 'company' 
});

// Relaciones de Producto con imágenes
Product.hasMany(ProductImage, { 
  foreignKey: 'product_id', 
  as: 'images',
  onDelete: 'CASCADE' 
});
ProductImage.belongsTo(Product, { 
  foreignKey: 'product_id', 
  as: 'product' 
});

// Relación Productos - Categorías (N:M) a través de ProductCategory
Product.belongsToMany(Category, {
  through: ProductCategory,
  foreignKey: 'product_id',
  otherKey: 'category_id',
  as: 'categories'
});
Category.belongsToMany(Product, {
  through: ProductCategory,
  foreignKey: 'category_id',
  otherKey: 'product_id',
  as: 'products'
});

// Relación directa para ProductCategory
ProductCategory.belongsTo(Product, { 
  foreignKey: 'product_id', 
  as: 'product' 
});
ProductCategory.belongsTo(Category, { 
  foreignKey: 'category_id', 
  as: 'category' 
});

// Relaciones de Categoría (auto-referencial para subcategorías)
Category.hasMany(Category, { 
  foreignKey: 'parent_id', 
  as: 'subcategories' 
});
Category.belongsTo(Category, { 
  foreignKey: 'parent_id', 
  as: 'parent' 
});

// Relación Cliente - Carrito (1:N)
Customer.hasMany(Cart, { 
  foreignKey: 'customer_id', 
  as: 'carts',
  onDelete: 'CASCADE' 
});
Cart.belongsTo(Customer, { 
  foreignKey: 'customer_id', 
  as: 'customer' 
});

// Relación Carrito - Items del Carrito (1:N)
Cart.hasMany(CartItem, { 
  foreignKey: 'cart_id', 
  as: 'items',
  onDelete: 'CASCADE' 
});
CartItem.belongsTo(Cart, { 
  foreignKey: 'cart_id', 
  as: 'cart' 
});

// Relación Producto - Items del Carrito (1:N)
Product.hasMany(CartItem, { 
  foreignKey: 'product_id', 
  as: 'cartItems' 
});
CartItem.belongsTo(Product, { 
  foreignKey: 'product_id', 
  as: 'product' 
});

// Relación Carrito - Orden (1:1)
Cart.hasOne(Order, { 
  foreignKey: 'cart_id', 
  as: 'order' 
});
Order.belongsTo(Cart, { 
  foreignKey: 'cart_id', 
  as: 'cart' 
});

// Relación Orden - Items de Orden (1:N)
Order.hasMany(OrderItem, { 
  foreignKey: 'order_id', 
  as: 'items',
  onDelete: 'CASCADE' 
});
OrderItem.belongsTo(Order, { 
  foreignKey: 'order_id', 
  as: 'order' 
});

// Relación Producto - Items de Orden (1:N)
Product.hasMany(OrderItem, { 
  foreignKey: 'product_id', 
  as: 'orderItems' 
});
OrderItem.belongsTo(Product, { 
  foreignKey: 'product_id', 
  as: 'product' 
});

// Relación Orden - Factura (1:1)
Order.hasOne(Invoice, { 
  foreignKey: 'order_id', 
  as: 'invoice' 
});
Invoice.belongsTo(Order, { 
  foreignKey: 'order_id', 
  as: 'order' 
});

// Relación Compañía - Servicio OnePay (1:1)
Company.hasOne(OnepayService, { 
  foreignKey: 'company_id', 
  as: 'onepayService',
  onDelete: 'CASCADE' 
});
OnepayService.belongsTo(Company, { 
  foreignKey: 'company_id', 
  as: 'company' 
});

// Relación Compañía - Servicio Website (1:1)
Company.hasOne(WebsiteService, { 
  foreignKey: 'company_id', 
  as: 'websiteService',
  onDelete: 'CASCADE' 
});
WebsiteService.belongsTo(Company, { 
  foreignKey: 'company_id', 
  as: 'company' 
});

export {
  sequelize,
  User,
  Company,
  Product,
  ProductImage,
  Category,
  ProductCategory,
  Customer,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Invoice,
  OnepayService,
  WebsiteService
};