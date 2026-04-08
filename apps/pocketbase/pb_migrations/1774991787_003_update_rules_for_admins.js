/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("admins");
  collection.listRule = "@request.auth.collectionName = \"admins\"";
  collection.viewRule = "@request.auth.id = id || @request.auth.collectionName = \"admins\"";
  collection.createRule = "@request.auth.collectionName = \"admins\"";
  collection.updateRule = "@request.auth.id = id || @request.auth.collectionName = \"admins\"";
  collection.deleteRule = "@request.auth.collectionName = \"admins\"";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("admins");
  collection.listRule = "@request.auth.collectionName = \"admins\"";
  collection.viewRule = "@request.auth.collectionName = \"admins\"";
  collection.createRule = null;
  collection.updateRule = "@request.auth.id = id";
  collection.deleteRule = "@request.auth.collectionName = \"admins\"";
  return app.save(collection);
})