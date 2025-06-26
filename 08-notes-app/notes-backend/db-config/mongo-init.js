const notesDB = process.env.NOTES_DB;
const notesUser = process.env.NOTES_USER;
const notesPassword = process.env.NOTES_PASSWORD;

db = db.getSiblingDB(notesDB);

db.createUser({
  user: notesUser,
  pwd: notesPassword,
  roles: [
    {
      role: "readWrite",
      db: notesDB,
    },
  ],
});
