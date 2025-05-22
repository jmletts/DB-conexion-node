import sequelize from '../database/connection';

// Importar todos los modelos
import { User } from './user';
import { Address } from './address';
import { Category } from './category';
import { Product } from './product';
import { ProductImage } from './productImage';
import { PaymentMethod } from './paymentMethod';
import { ShippingMethod } from './shippingMethod';
import { Order } from './order';
import { OrderItem } from './orderItem';
import { CartItem } from './cartItem';
import { Invoice } from './invoice';
import { Staff } from './staff';
import { SystemConfig } from './systemConfig';

// =============================================
// DEFINIR RELACIONES
// =============================================

// Relaciones de Usuario
User.hasMany(Address, { 
  foreignKey: 'user_id', 
  as: 'addresses',
  onDelete: 'CASCADE' 
});
Address.belongsTo(User, { 
  foreignKey: 'user_id', 
  as: 'user' 
});

User.hasMany(Order, { 
  foreignKey: 'user_id', 
  as: 'orders' 
});
Order.belongsTo(User, { 
  foreignKey: 'user_id', 
  as: 'customer' 
});

User.hasMany(CartItem, { 
  foreignKey: 'user_id', 
  as: 'cartItems',
  onDelete: 'CASCADE' 
});
CartItem.belongsTo(User, { 
  foreignKey: 'user_id', 
  as: 'user' 
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

Category.hasMany(Product, { 
  foreignKey: 'category_id', 
  as: 'products' 
});
Product.belongsTo(Category, { 
  foreignKey: 'category_id', 
  as: 'category' 
});

// Relaciones de Producto
Product.hasMany(ProductImage, { 
  foreignKey: 'product_id', 
  as: 'images',
  onDelete: 'CASCADE' 
});
ProductImage.belongsTo(Product, { 
  foreignKey: 'product_id', 
  as: 'product' 
});

Product.hasMany(OrderItem, { 
  foreignKey: 'product_id', 
  as: 'orderItems' 
});
OrderItem.belongsTo(Product, { 
  foreignKey: 'product_id', 
  as: 'product' 
});

Product.hasMany(CartItem, { 
  foreignKey: 'product_id', 
  as: 'cartItems',
  onDelete: 'CASCADE' 
});
CartItem.belongsTo(Product, { 
  foreignKey: 'product_id', 
  as: 'product' 
});

// Relaciones de Pedido
Order.hasMany(OrderItem, { 
  foreignKey: 'order_id', 
  as: 'items',
  onDelete: 'CASCADE' 
});
OrderItem.belongsTo(Order, { 
  foreignKey: 'order_id', 
  as: 'order' 
});

Order.belongsTo(PaymentMethod, { 
  foreignKey: 'payment_method_id', 
  as: 'paymentMethod' 
});
PaymentMethod.hasMany(Order, { 
  foreignKey: 'payment_method_id', 
  as: 'orders' 
});

Order.belongsTo(ShippingMethod, { 
  foreignKey: 'shipping_method_id', 
  as: 'shippingMethod' 
});
ShippingMethod.hasMany(Order, { 
  foreignKey: 'shipping_method_id', 
  as: 'orders' 
});

// Relaciones de direcciones en pedidos
Order.belongsTo(Address, { 
  foreignKey: 'shipping_address_id', 
  as: 'shippingAddress' 
});
Order.belongsTo(Address, { 
  foreignKey: 'billing_address_id', 
  as: 'billingAddress' 
});

// Relación de Factura
Order.hasOne(Invoice, { 
  foreignKey: 'order_id', 
  as: 'invoice' 
});
Invoice.belongsTo(Order, { 
  foreignKey: 'order_id', 
  as: 'order' 
});


export {
  sequelize,
  User,
  Address,
  Category,
  Product,
  ProductImage,
  PaymentMethod,
  ShippingMethod,
  Order,
  OrderItem,
  CartItem,
  Invoice,
  Staff,
  SystemConfig
};