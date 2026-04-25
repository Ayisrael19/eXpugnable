export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Handle the Signup Database Insertion
    if (request.method === "POST" && url.pathname === "/signup") {
      try {
        const formData = await request.formData();
        const name = formData.get("name");
        const email = formData.get("email");
        const username = formData.get("username");
        const password = formData.get("password");

        await env.DB.prepare(
          "INSERT INTO contacts (full_name, email, username, password) VALUES (?, ?, ?, ?)"
        )
        .bind(name, email, username, password)
        .run();

        return new Response("SUCCESS: User Registered!", { status: 200 });
      } catch (err) {
        return new Response("DB ERROR: " + err.message, { status: 500 });
      }
    }

    // 2. Everything else? Just serve the static files!
    // In Pages, you don't even need env.ASSETS.fetch, 
    // you just let it fall through to the default behavior.
    return env.ASSETS.fetch(request);
  }
};