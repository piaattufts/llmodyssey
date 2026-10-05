import { createServer } from "node:http";

const port = Number(process.env.PORT || 8787);

const server = createServer(async (request, response) => {
  if (request.method !== "POST") {
    response.writeHead(405, { "content-type": "application/json" });
    response.end(JSON.stringify({ error: "POST only" }));
    return;
  }
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  const provider = body.provider;
  const keyName = provider === "anthropic" ? "ANTHROPIC_API_KEY" : "OPENAI_API_KEY";
  if (!process.env[keyName]) {
    response.writeHead(501, { "content-type": "application/json" });
    response.end(JSON.stringify({ error: `${keyName} is not set on the proxy. The Odyssey games do not need this process.` }));
    return;
  }
  response.writeHead(501, { "content-type": "application/json" });
  response.end(
    JSON.stringify({
      error: "This sample proxy refuses to call a vendor until you add the request for your institution. Keys stay in the server environment.",
    }),
  );
});

server.listen(port, () => {
  console.log(`LLM proxy sample listening on ${port}. It does not embed API keys.`);
});
