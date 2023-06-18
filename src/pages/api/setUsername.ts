import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

const setUsername = async (req: NextApiRequest, res: NextApiResponse) => {
    const client = await clientPromise;
    const db = await client.db();
    const collection = await db.collection("users");

    const { username, email } = req.query;
    console.log(username, email);

    const user = await collection.findOne({ email });

    if (!user) {
        res.json({ message: "User does not exist" });
        return;
    }

    if (user.username) {
        res.json({ message: "User already exists" });
        return;
    } else {
        // Set username of found user to username
        const result = await collection.updateOne(
            { email },
            {
                $set: {
                    username,
                },
            }
        );
        res.json({ message: "Username set successfully", id: result.insertedId });
    }
};

export default setUsername;