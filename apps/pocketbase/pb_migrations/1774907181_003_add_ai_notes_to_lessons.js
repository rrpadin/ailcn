/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("lessons");

  const existing = collection.fields.getByName("ai_notes");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("ai_notes"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "ai_notes"
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("lessons");
  collection.fields.removeByName("ai_notes");
  return app.save(collection);
})