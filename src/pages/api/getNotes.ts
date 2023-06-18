import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

const getNotes = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db();
  const notesCollection = db.collection("notes");
  const usersCollection = db.collection("users");

  const { username } = req.query;

  if (req.method === "GET") {
    // Get user with username
    const user = await usersCollection
      .findOne({ username: username })
      .then((user) => user);
    if (!user) {
      res.json({ message: "User not found", notes: []});
      client.close();
      return;
    }
    // Get notes with user email
    const notes = await notesCollection.find({ email: user.email }).toArray();
    if (!notes) {
      res.json({ message: "No notes found", notes: [] });
      client.close();
      return;
    }
    res.json({ notes });
  }
  client.close();
};

export default getNotes;
