/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vmgq0yn0ctfdasj")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_wPvk6Q0` ON `bank_updates` (\n  `account_id`,\n  `last_update`\n)"
  ]

  // add
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

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "sdqi46o2",
    "name": "account_id",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vmgq0yn0ctfdasj")

  collection.indexes = []

  // remove
  collection.schema.removeField("7cvpsqlo")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "sdqi46o2",
    "name": "account_id",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
})
