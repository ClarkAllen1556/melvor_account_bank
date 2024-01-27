/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vmgq0yn0ctfdasj")

  collection.createRule = null

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "7cvpsqlo",
    "name": "last_update",
    "type": "date",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vmgq0yn0ctfdasj")

  collection.createRule = "account_id != \"\" && account_id = @request.auth.id && @request.auth.id != \"\" && @collection.users.verified = true"

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "7cvpsqlo",
    "name": "last_update",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
})
