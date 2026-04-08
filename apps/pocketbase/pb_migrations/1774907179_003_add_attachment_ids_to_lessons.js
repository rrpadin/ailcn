/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("lessons");

  const existing = collection.fields.getByName("attachment_ids");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("attachment_ids"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "attachment_ids"
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("lessons");
  collection.fields.removeByName("attachment_ids");
  return app.save(collection);
})