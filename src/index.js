export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // TEST: Catch ANY POST request to any path
    if (request.method === "POST") {
      try {
        const formData = await request.formData();
        const name = formData.get("name");
        const email = formData.get("email");
        const username = formData.get("username");
        const password = formData.get("password");

        // If your table name or columns are different, this will throw an error
        // which we will see in the response instead of a 405.
        await env.DB.prepare(
          "INSERT INTO contacts (full_name, email, username, password) VALUES (?, ?, ?, ?)"
        )
        .bind(name, email, username, password)
        .run();

        return new Response("SUCCESS: Data saved to D1!", { status: 200 });

      } catch (err) {
        // If the binding or SQL is wrong, you'll see the REAL error here
        return new Response("DATABASE ERROR: " + err.message, { status: 500 });
      }
    }

    // Normal GET requests (viewing the page) go here
    return env.ASSETS.fetch(request);
  }
};