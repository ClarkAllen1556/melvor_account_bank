/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "vmgq0yn0ctfdasj",
    "created": "2024-01-24 13:46:41.987Z",
    "updated": "2024-01-24 13:46:41.987Z",
    "name": "bank_updates",
    "type": "base",
    "system": false,
    "schema": [
      {
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
      }
    ],
    "indexes": [],
    "listRule": "account_id = @request.auth.id && @request.auth.id != \"\" && @collection.users.verified = true",
    "viewRule": null,
    "createRule": "account_id = @request.auth.id && @request.auth.id != \"\" && @collection.users.verified = true",
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("vmgq0yn0ctfdasj");

  return dao.deleteCollection(collection);
})
