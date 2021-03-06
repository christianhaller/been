import { ServerRequest } from "../../deps.ts";

const getUrl = (req: ServerRequest): URL => {
  const [, query] = req.url.split("?");

  const url = new URLSearchParams(query).get("url");
  if (!url) {
    throw new Error("no url set");
  }

  return new URL(url);
};

export { getUrl };
