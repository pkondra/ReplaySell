import { httpRouter } from "convex/server";

import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/auth/jwks",
  method: "GET",
  handler: httpAction(async () => {
    const jwks = process.env.CONVEX_AUTH_JWKS;
    if (!jwks || jwks.trim() === "") {
      return new Response(
        JSON.stringify({ error: "CONVEX_AUTH_JWKS is not configured." }),
        {
          status: 500,
          headers: { "content-type": "application/json" },
        },
      );
    }

    return new Response(jwks, {
      headers: {
        "content-type": "application/json",
        "cache-control": "public, max-age=3600",
      },
    });
  }),
});

export default http;
