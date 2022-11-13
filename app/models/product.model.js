"use strict";
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    const Product = sequelize.define('product', {
        product_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        product_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        brand_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },{
        underscored: true,
        freezeTableName: true
    })

    return Product
}