import sequelize from '../database/connection';

import { User } from './user';
import { Company } from './company';
import { Product } from './products';
import { Category } from './category';
import { ProductCategory } from './productCategory';
import { Order } from './order';
import { OrderProduct } from './orderProduct';
import { Review } from './review';

// Relaciones
User.hasMany(Company, { foreignKey: 'Userid' });
Company.belongsTo(User, { foreignKey: 'Userid' });

Company.hasMany(Product, { foreignKey: 'Companyid' });
Product.belongsTo(Company, { foreignKey: 'Companyid' });

Product.belongsToMany(Category, { through: ProductCategory, foreignKey: 'Productid' });
Category.belongsToMany(Product, { through: ProductCategory, foreignKey: 'Categoryid' });

User.hasMany(Order, { foreignKey: 'Userid' });
Order.belongsTo(User, { foreignKey: 'Userid' });

Order.belongsToMany(Product, { through: OrderProduct, foreignKey: 'Orderid' });
Product.belongsToMany(Order, { through: OrderProduct, foreignKey: 'Productid' });

User.hasMany(Review, { foreignKey: 'Userid' });
Product.hasMany(Review, { foreignKey: 'Productid' });
Review.belongsTo(User, { foreignKey: 'Userid' });
Review.belongsTo(Product, { foreignKey: 'Productid' });

export {
  sequelize,
  User,
  Company,
  Product,
  Category,
  ProductCategory,
  Order,
  OrderProduct,
  Review
};
