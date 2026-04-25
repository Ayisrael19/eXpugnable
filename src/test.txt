export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // This path (/api/signup) does NOT exist as a file, 
    // so Cloudflare will be forced to let the Worker handle it.
    if (request.method === "POST" && url.pathname === "/api/signup") {
      try {
        const formData = await request.formData();
        
        // ... (Your D1 insertion code here) ...

        return new Response("SUCCESS", { status: 200 });
      } catch (err) {
        return new Response("DB ERROR: " + err.message, { status: 500 });
      }
    }

    // All other requests (GET style.css, GET index.html)
    return env.ASSETS.fetch(request);
  }
};