/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("applications");
  collection.listRule = "@request.auth.collectionName = \"admins\"";
  collection.viewRule = "@request.auth.collectionName = \"admins\"";
  collection.createRule = "@request.auth.id != \"\"";
  collection.updateRule = "@request.auth.collectionName = \"admins\"";
  collection.deleteRule = "@request.auth.collectionName = \"admins\"";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("applications");
  collection.listRule = "@request.auth.collectionName = \"admins\"";
  collection.viewRule = "@request.auth.collectionName = \"admins\"";
  collection.createRule = "";
  collection.updateRule = "@request.auth.collectionName = \"admins\"";
  collection.deleteRule = "@request.auth.collectionName = \"admins\"";
  return app.save(collection);
})