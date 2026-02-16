export default {
  async fetch(request) {
    const url = new URL(request.url);
    let path = url.pathname;

    // Default to index.html for root path
    if (path === '/') {
      path = '/index.html';
    }

    // Try to fetch the requested file
    try {
      const response = await fetch(`${url.origin}${path}`);
      return response;
    } catch (error) {
      // Return 404 if file not found
      return new Response('Not Found', { status: 404 });
    }
  }
};
