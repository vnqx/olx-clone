import { verify } from "jsonwebtoken";
import User, { IUser } from "./models/User";

const JWT_SECRET = process.env.JWT_SECRET;

export interface IContext {
  user: IUser | null;
}

function getUser(token: string): null | object {
  try {
    if (token) {
      return verify(token, JWT_SECRET) as any;
    }

    return null;
  } catch (error) {
    return null;
  }
}

export default async ({ req }: any): Promise<IContext> => {
  const tokenWithBearer = req.headers.authorization || "";
  const token = tokenWithBearer.split(" ")[1];
  const decodedUser = getUser(token) as any;

  if (decodedUser === null) {
    const user = null;
    return { user };
  }

  const user = (await User.findById(decodedUser.id)
    .populate("ownPostings")
    .populate("followedPostings")
    .populate({
      path: "messages",
      populate: {
        path: "posting",
      },
    })) as any;

  return { user };
};
