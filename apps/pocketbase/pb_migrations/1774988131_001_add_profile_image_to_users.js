/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const assetsCollection = app.findCollectionByNameOrId("assets");
  const collection = app.findCollectionByNameOrId("users");

  const existing = collection.fields.getByName("profile_image");
  if (existing) {
    if (existing.type === "relation") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("profile_image"); // exists with wrong type, remove first
  }

  collection.fields.add(new RelationField({
    name: "profile_image",
    required: false,
    collectionId: assetsCollection.id,
    maxSelect: 1
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("users");
  collection.fields.removeByName("profile_image");
  return app.save(collection);
})