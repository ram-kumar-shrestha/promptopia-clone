import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const GET = async (req) => {
  try {
    await connectToDB();

    const propmt = await Prompt.find({}).populate("creator");

    return new Response(JSON.stringify(propmt), { status: 200 });
  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }
};
