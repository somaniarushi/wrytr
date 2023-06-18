import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";


const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = await client.db();
  const collection = await db.collection("users");

  const { name, email } = req.query;

  const user = await collection.findOne({ email });

  if (user) {
    res.json({ message: "User already exists" });
    return;
  }

  const result = await collection.insertOne({
    name,
    email,
    createdAt: new Date(),
    username: null,
  });

  res.json({ message: "User created successfully", id: result.insertedId });
};

export default createUser;
