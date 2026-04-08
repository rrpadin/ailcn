/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("modules");

  const existing = collection.fields.getByName("suggested_lessons_json");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("suggested_lessons_json"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "suggested_lessons_json"
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("modules");
  collection.fields.removeByName("suggested_lessons_json");
  return app.save(collection);
})