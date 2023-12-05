import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const POST = async (req, res) => {
  const { userId, prompt, tag } = await req.json();

  try {
    await connectToDB();

    const newPropmt = new Prompt({
      creator: userId,
      prompt,
      tag,
    });

    await newPropmt.save();

    return new Response(JSON.stringify(newPropmt), { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
