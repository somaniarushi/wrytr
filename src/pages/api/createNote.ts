import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

const createNote = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = await client.db();
  const notesCollection = await db.collection("notes");
  if (req.method === "POST") {
    const { title, description, email } = req.query;

    if (!description) {
      res
        .status(422)
        .json({
          message: "Invalid input - title and description should not be empty.",
        });
      client.close();
      return;
    }

    const result = await notesCollection.insertOne({
      title,
      description,
      email,
      createdAt: new Date(),
    });
    res.status(201).json({ message: "Created note!", id: result.insertedId });
  }
  client.close();
};

export default createNote;
