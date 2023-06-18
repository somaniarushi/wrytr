import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db();
  const userCollection = db.collection("users");

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
