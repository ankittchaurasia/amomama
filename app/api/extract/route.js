import { extract } from '@extractus/article-extractor'
import { LRUCache } from 'lru-cache';

const cache = new LRUCache({ max: 100 });

async function cachedExtract(urlparams) {
  if (cache.has(urlparams)) return cache.get(urlparams);

  const result = await extract(urlparams);
  cache.set(urlparams, result);
  return result;
}

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams
    const urlparams = searchParams.get('url')

    if(!urlparams) return Response.json({ error: 'URL not found' }, { status: 404 });

    try{
        const decodedUrl =  Buffer.from(urlparams, 'base64').toString('utf-8');
        new URL(decodedUrl); //to check if url is valid
        const result = await cachedExtract(decodedUrl);

        return Response.json(result);
    }catch(error){
        console.log('Extract', error.message);
        return Response.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}