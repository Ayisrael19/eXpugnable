export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Handle the Database Signup (Intercept POST)
    if (request.method === "POST" && url.pathname === "/signup") {
      try {
        const formData = await request.formData();
        const name = formData.get("name");
        const email = formData.get("email");
        const username = formData.get("username");
        const password = formData.get("password");

        // Use the 'DB' binding from your wrangler.jsonc
        await env.DB.prepare(
          "INSERT INTO contacts (full_name, email, username, password) VALUES (?, ?, ?, ?)"
        )
        .bind(name, email, username, password)
        .run();

        return new Response("SUCCESS: Welcome to the team, " + name, { status: 200 });
      } catch (err) {
        return new Response("DATABASE ERROR: " + err.message, { status: 500 });
      }
    }

    // 2. Handle Static Assets (HTML/CSS/Images)
    // This tells the Worker to look for your files since it's not a POST
    try {
      return await env.ASSETS.fetch(request);
    } catch (e) {
      return new Response("Asset Error: " + e.message, { status: 500 });
    }
  }
};