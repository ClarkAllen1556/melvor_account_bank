/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dd04lhg7demif8u")

  collection.listRule = "account_id = @request.auth.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dd04lhg7demif8u")

  collection.listRule = ""

  return dao.saveCollection(collection)
})
