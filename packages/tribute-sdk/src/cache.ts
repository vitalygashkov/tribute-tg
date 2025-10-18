const getCache = async (): Promise<Cache | undefined> => {
  const hasCaches = 'caches' in globalThis || !!caches;
  if (!hasCaches) return undefined;
  if ('default' in caches) return caches.default as Cache;
  return (await caches.open('default')) as unknown as Cache;
};

export const fetchWithCache = async (
  request: RequestInfo | URL,
  { maxAge }: { maxAge: number } = { maxAge: 300 } // 5 minutes in seconds
): Promise<Response> => {
  const cache = await getCache();
  const cached = await cache?.match(request);
  if (cached) {
    return new Response(cached.body, cached);
  } else {
    const response = await fetch(request);
    const cacheable = new Response(response.body, response);
    cacheable.headers.append('Cache-Control', `s-maxage=${maxAge}`);
    await cache?.put(request, cacheable.clone());
    return cacheable;
  }
};
