"use strict";
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    const ProductBrand = sequelize.define('product_brand', {
        brand_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        brand_name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },{
        underscored: true,
        freezeTableName: true
    })

    return ProductBrand
}