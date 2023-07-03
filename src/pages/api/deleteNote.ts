import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

const deleteNode = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = await client.db();
  const notesCollection = await db.collection("notes");
  const { description, email } = req.query;
  console.log(description, email);
  const result = await notesCollection.deleteOne({
    description: description,
    email: email,
  });
  res.status(200).json({ message: "Note deleted!" });
  client.close();
};

export default deleteNode;
