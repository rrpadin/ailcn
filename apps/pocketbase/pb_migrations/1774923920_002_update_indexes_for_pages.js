/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pages");

  const hasSlugField = Array.isArray(collection.fields)
    && collection.fields.some((field) => field.name === "slug");

  if (!hasSlugField) {
    console.log("Pages collection has no slug field, skipping idx_pages_slug creation");
    return;
  }

  const slugIndex = "CREATE UNIQUE INDEX idx_pages_slug ON pages (slug)";

  if (!collection.indexes.includes(slugIndex)) {
    collection.indexes.push(slugIndex);
  }

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pages");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_pages_slug"));
  return app.save(collection);
})
