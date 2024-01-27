/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dd04lhg7demif8u")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_2VDt7fo` ON `items` (\n  `game_id`,\n  `account_id`\n)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dd04lhg7demif8u")

  collection.indexes = [
    "CREATE INDEX `idx_2VDt7fo` ON `items` (\n  `game_id`,\n  `account_id`\n)"
  ]

  return dao.saveCollection(collection)
})
