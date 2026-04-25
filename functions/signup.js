export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const username = formData.get("username");
    const password = formData.get("password");

    // Insert into D1 using the 'DB' binding
    await env.DB.prepare(
      "INSERT INTO contacts (full_name, email, username, password) VALUES (?, ?, ?, ?)"
    )
    .bind(name, email, username, password)
    .run();

    return new Response("SUCCESS: Data saved to D1!", { status: 200 });

  } catch (err) {
    return new Response("FUNCTION ERROR: " + err.message, { status: 500 });
  }
}