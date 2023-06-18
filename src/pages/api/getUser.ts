import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = await client.db();
  const userCollection = await db.collection("users");

  if (req.method === "GET") {
    const { email } = req.query;

    const user = await userCollection.findOne({ email });

    if (!user) {
      res.json({ message: "User not found.", statusCode: 401 });
      client.close();
      return;
    }

    res.json({ message: "User found!", user, statusCode: 200, id: user._id });
  }
  client.close();
};

export default getUser;
