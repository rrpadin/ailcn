/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("navigation_links");

  const record0 = new Record(collection);
    record0.set("name", "Apply Now");
    record0.set("url", "/apply");
    record0.set("link_type", "internal");
    record0.set("category", "cta_buttons");
    record0.set("open_in_new_tab", false);
    record0.set("is_active", true);
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record1 = new Record(collection);
    record1.set("name", "Book Consultation");
    record1.set("url", "/book-consultation");
    record1.set("link_type", "internal");
    record1.set("category", "cta_buttons");
    record1.set("open_in_new_tab", false);
    record1.set("is_active", true);
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record2 = new Record(collection);
    record2.set("name", "Get Started");
    record2.set("url", "/get-started");
    record2.set("link_type", "internal");
    record2.set("category", "cta_buttons");
    record2.set("open_in_new_tab", false);
    record2.set("is_active", true);
  try {
    app.save(record2);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record3 = new Record(collection);
    record3.set("name", "Learn More");
    record3.set("url", "/learn-more");
    record3.set("link_type", "internal");
    record3.set("category", "cta_buttons");
    record3.set("open_in_new_tab", false);
    record3.set("is_active", true);
  try {
    app.save(record3);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record4 = new Record(collection);
    record4.set("name", "Footer - About");
    record4.set("url", "/about");
    record4.set("link_type", "internal");
    record4.set("category", "footer");
    record4.set("open_in_new_tab", false);
    record4.set("is_active", true);
  try {
    app.save(record4);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record5 = new Record(collection);
    record5.set("name", "Footer - Contact");
    record5.set("url", "/contact");
    record5.set("link_type", "internal");
    record5.set("category", "footer");
    record5.set("open_in_new_tab", false);
    record5.set("is_active", true);
  try {
    app.save(record5);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record6 = new Record(collection);
    record6.set("name", "Footer - Privacy");
    record6.set("url", "/privacy-policy");
    record6.set("link_type", "internal");
    record6.set("category", "footer");
    record6.set("open_in_new_tab", false);
    record6.set("is_active", true);
  try {
    app.save(record6);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record7 = new Record(collection);
    record7.set("name", "Footer - Terms");
    record7.set("url", "/terms-of-service");
    record7.set("link_type", "internal");
    record7.set("category", "footer");
    record7.set("open_in_new_tab", false);
    record7.set("is_active", true);
  try {
    app.save(record7);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})