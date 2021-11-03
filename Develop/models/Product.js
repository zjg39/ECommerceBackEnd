// import important parts of sequelize library
const { Model, DataTypes } = require('sequelize');
// import our database connection from config.js
const sequelize = require('../config/connection');

// Initialize Product model (table) by extending off Sequelize's Model class
class Product extends Model {}

// set up fields and rules for Product model
Product.init(
  {
    category_id: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'category',
        key: 'id'
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
      allowNull: false,
      validate: {
        isNumeric: true
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isDecimal: true
      }
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }

  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product',
  }
);

module.exports = Product;
