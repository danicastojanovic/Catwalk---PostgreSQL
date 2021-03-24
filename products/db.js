const ExpressCassandra = require('express-cassandra');
const fs = require('fs');
const readline = require('readline');
const addCreated = require('./addCreated');
const addFeatures = require('./addFeatures');
const addRelated = require('./addRelated');
const addSkus = require('./addSkus');
const addPhotos = require('./addPhotos');

var models = ExpressCassandra.createClient({
  clientOptions: {
    contactPoints: ['127.0.0.1'],
    protocolOptions: { port: 9042 },
    keyspace: 'products',
    queryOptions: {consistency: ExpressCassandra.consistencies.one}
  },
  ormOptions: {
    defaultReplicationStrategy : {
      class: 'SimpleStrategy',
      replication_factor: 1
    },
    migration: 'safe',
  }
});

var ProductModel = models.loadSchema('Products', {
  fields: {
    product_id: {
      type: "int"
    },
    name: {
      type: "varchar"
    },
    slogan: {
      type: "varchar"
    },
    description: {
      type: "varchar"
    },
    category: {
      type: "varchar"
    },
    default_price: {
      type: "int"
    },
    created_at: {
      type: "timestamp",
      default: {"$db_function": "toTimestamp(now())"}
    },
    updated_at: {
      type: "timestamp",
      default: {"$db_function": "toTimestamp(now())"}
    },
    features: {
      type: "list",
      typeDef: "<varchar>",
    },
    feature_values: {
      type: "list",
      typeDef: "<varchar>",
    },
    related_products: {
      type: "list",
      typeDef: "<int>",
    },
  },
  key:["product_id"],
  required: [
    "product_id",
    "name",
    "created_at",
    "product_id"
  ],
  options: {
    timestamps: {
        createdAt: 'created_at', // defaults to createdAt
        updatedAt: 'updated_at' // defaults to updatedAt
    }
  },
});

var StyleModel = models.loadSchema('Styles', {
  fields: {
    style_id: {
      type: "int"
    },
    product_id: {
      type: "int"
    },
    name: {
      type: "varchar"
    },
    original_price: {
      type: "varchar"
    },
    sale_price: {
      type: "varchar",
      default: null
    },
    default_style: {
      type: "boolean",
      default: false
    },
    sku_id: {
      type: "list",
      typeDef: "<int>"
    },
    sku_size: {
      type: "list",
      typeDef: "<varchar>"
    },
    sku_quantity: {
      type: "list",
      typeDef: "<int>"
    },
    photo_urls: {
      type: "list",
      typeDef: "<varchar>"
    },
    photo_thumbnail_urls: {
      type: "list",
      typeDef: "<varchar>"
    }
  },
  key:["product_id", "style_id"],
//   required: [
//     "name",
//     "category",
//     "created_at",
//     "product_id"
//   ],
});

addCreated.init(models)
// addFeatures.init(models)
// addRelated.init(models)
// addSkus.init(models)
// addPhotos.init(models)


ProductModel.syncDB(function(err, result) {
  if (err) throw err;
  console.log('changed?', result)
});

StyleModel.syncDB(function(err, result) {
  if (err) throw err;
  console.log('changed?', result)
});

// COPY products."Products"(product_id, name, slogan, description, category, default_price) FROM '/home/bargle/hackreactor/SDC-Team-C/products/product.csv' WITH DELIMITER=',' AND HEADER=TRUE ;