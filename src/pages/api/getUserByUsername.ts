import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

const getUserByUsername = async (req: NextApiRequest, res: NextApiResponse) => {

    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = await client.db();
    const collection = await db.collection("users");

    const { username } = req.query;

    const user = await collection.findOne({ username });

    if (!user) {
        res.json({ message: "User does not exist", statusCode: 401 });
    } else {
        res.json({ message: "User exists", statusCode: 200 });
    }
};

export default getUserByUsername;