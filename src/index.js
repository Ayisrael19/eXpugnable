export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/index.html' || path === '/') 
      
    if (path === '/signup.html' || path === '/signup') {
    }

    // 1. ROUTE: Handle the Signup Form Submission
    if (request.method === "POST" && path === "/signup") {
      try {
        const formData = await request.formData();
        const name = formData.get("name");
        const email = formData.get("email");
        const username = formData.get("username");
        const password = formData.get("password");
        const confirmPassword = formData.get("confirm-password");

        // Basic validation
        if (password !== confirmPassword) {
          return new Response("Error: Passwords do not match.", { status: 400 });
        }

        // Insert into your Cloudflare D1 Database
        // Note: In a real app, use bcrypt here to hash the password first!
        await env.DB.prepare(
          "INSERT INTO contacts (full_name, email, username, password) VALUES (?, ?, ?, ?)"
        )
        .bind(name, email, username, password)
        .run();

        return new Response("Signup successful! Welcome to eXpugnable, " + name, { status: 200 });

      } catch (err) {
        return new Response("Database Error: " + err.message, { status: 500 });
      }
    }

    // 2. ROUTE: Serve Static Files (HTML/CSS/Images)
    // This part matches the logic in your image_4fdf2f.png
    try {
      let filePath = path === "/" ? "/index.html" : path;
      
      // If you are hosting your files on Cloudflare Pages or a bucket, 
      // you fetch them from the origin. 
      const response = await fetch(`${url.origin}${filePath}`);
      
      if (response.status === 404) {
        return new Response("File Not Found", { status: 404 });
      }

      return response;
    } catch (e) {
      return new Response("Internal Server Error", { status: 500 });
    }
  }
};
