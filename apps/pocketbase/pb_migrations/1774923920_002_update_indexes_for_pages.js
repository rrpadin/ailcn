/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pages");
  collection.indexes.push("CREATE UNIQUE INDEX idx_pages_slug ON pages (slug)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pages");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_pages_slug"));
  return app.save(collection);
})