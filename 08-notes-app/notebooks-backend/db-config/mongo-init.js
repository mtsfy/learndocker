const noteBooksDB = process.env.NOTEBOOKS_DB;
const noteBooksUser = process.env.NOTEBOOKS_USER;
const noteBooksPassword = process.env.NOTEBOOKS_PASSWORD;

db = db.getSiblingDB(noteBooksDB);

db.createUser({
  user: noteBooksUser,
  pwd: noteBooksPassword,
  roles: [
    {
      role: "readWrite",
      db: noteBooksDB,
    },
  ],
});
