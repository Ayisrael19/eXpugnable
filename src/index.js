export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. CATCH THE POST REQUEST FIRST
    // This intercepts the form before it hits the static assets
    if (request.method === "POST" && url.pathname === "/signup") {
      try {
        const formData = await request.formData();
        const name = formData.get("name");
        const email = formData.get("email");
        const username = formData.get("username");
        const password = formData.get("password");

        // Use the 'DB' binding exactly as it appears in your wrangler file
        await env.DB.prepare(
          "INSERT INTO contacts (full_name, email, username, password) VALUES (?, ?, ?, ?)"
        )
        .bind(name, email, username, password)
        .run();

        return new Response("Signup Successful!", { status: 200 });

      } catch (err) {
        // If this hits, the binding is likely missing or the table isn't created
        return new Response("Worker Error: " + err.message, { status: 500 });
      }
    }

    // 2. SERVE STATIC FILES SECOND
    // If it's a GET request (like loading the page), this handles it
    return env.ASSETS.fetch(request);
  }
};
