/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vmgq0yn0ctfdasj")

  collection.createRule = "account_id != \"\" && account_id = @request.auth.id && @request.auth.id != \"\" && @collection.users.verified = true"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vmgq0yn0ctfdasj")

  collection.createRule = "account_id = @request.auth.id && @request.auth.id != \"\" && @collection.users.verified = true"

  return dao.saveCollection(collection)
})
