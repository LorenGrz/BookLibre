db = db.getSiblingDB("booklibreMongo");
db.createUser({
  user: "booklibre_app",
  pwd: "booklibre_app_secret",
  roles: [
    { role: "readWrite", db: "booklibreMongo" }
  ]
});
