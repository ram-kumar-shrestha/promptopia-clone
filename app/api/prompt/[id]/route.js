import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
//GET
export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const propmt = await Prompt.findById(params.id).populate("creator");

    if (!propmt) return new new Response("Prompt not found", { status: 404 })();

    return new Response(JSON.stringify(propmt), { status: 200 });
  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }
};

//PATCH
export const PATCH = async (req, { params }) => {
  const { prompt, tag } = await req.json();

  try {
    await connectToDB();

    const existingPrompt = await Prompt.findById(params.id);

    if (!existingPrompt)
      return new Response("Prompt not found", { status: 404 });

    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;

    await existingPrompt.save();

    return new Response(JSON.stringify(existingPrompt), { status: 200 });
  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }
};

//DELETE

export const DELETE = async (req, { params }) => {
  try {
    await connectToDB();

    await Prompt.findByIdAndRemove(params.id);
    return new Response("Propmpt deleted successfully", { status: 200 });
  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }
};
