import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

const getNotes = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = await client.db();
  const notesCollection = await db.collection("notes");
  const usersCollection = await db.collection("users");

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
