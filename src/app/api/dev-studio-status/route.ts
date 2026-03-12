export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return new Response(null, { status: 404 });
  }

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    const controller = new AbortController();
    // const timeoutId = setTimeout(() => controller.abort(), 3000);
    timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch('http://localhost:2022/.well-known/novu', {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    // clearTimeout(timeoutId);
    const raw = await response.text();

    if (response.ok) {
      // const data = await response.json();
      // const data = JSON.parse(raw);
      // if (data.port && data.route) {
      //   return Response.json({ connected: true, data });
      // }
      try {
        const data = JSON.parse(raw) as { port?: unknown; route?: unknown };
        if (data.port && data.route) {
          return Response.json({ connected: true, data });
        }
      } catch {
        return Response.json({
          connected: false,
          error: raw || 'Invalid JSON from Novu Dev Studio',
        });
      }
    }

    return Response.json({
      connected: false,
      // error: await response.text(),
      error: raw,
    });
  } catch (error) {
    return Response.json({
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}
