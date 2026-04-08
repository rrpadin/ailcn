/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("courses");

  const existing = collection.fields.getByName("generated_outline_json");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("generated_outline_json"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "generated_outline_json"
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("courses");
  collection.fields.removeByName("generated_outline_json");
  return app.save(collection);
})