/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dd04lhg7demif8u")

  collection.listRule = "account_id = @request.auth.id && @request.auth.id != \"\" && @collection.users.verified = true"
  collection.createRule = "account_id = @request.auth.id && @request.auth.id != \"\" && @collection.users.verified = true"
  collection.updateRule = "account_id = @request.auth.id && @request.auth.id != \"\" && @collection.users.verified = true"
  collection.deleteRule = "account_id = @request.auth.id && @request.auth.id != \"\" && @collection.users.verified = true"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dd04lhg7demif8u")

  collection.listRule = "account_id = @request.auth.id"
  collection.createRule = "account_id = @request.auth.id"
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
