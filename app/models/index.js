const sequelize = require('../config/database.config')

// init model
const db = {}
db.sequelize = sequelize
db.product = require('./product.model')(sequelize)
db.product_brand = require('./product_brand.model')(sequelize)
db.report_product = require('./report_product.model')(sequelize)
db.store = require('./store.model')(sequelize)
db.store_area = require('./store_area.model')(sequelize)
db.store_account = require('./store_account.model')(sequelize)

module.exports = db