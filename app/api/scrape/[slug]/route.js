import axios from 'axios';
import { load } from 'cheerio';
import data from '../data';

const headers = {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36',
    'Accept': 'text/html, */*; q=0.01',
}

export async function GET(request,{ params }) {
    const  { slug } = params;
    if(!data[slug]) return Response.json({ error: 'Data not found' }, { status: 404 });

    let page;
    const searchParams = request.nextUrl.searchParams
    page = searchParams.get('page')

    if(!page) page = 1;

    const timestamp = new Date().toISOString();

    try {
        const html = await axios.get(data[slug].url+page, {headers} );
        const $ = load(html.data);
        const cards = data[slug].cardwrapper($);
        const newsdata = cards.map((i, card) => {
            const image = data[slug].cardimage($, card);
            const title = data[slug].cardtitle($, card);
            const link = data[slug].cardlink($, card);
            return { title, image, link };
        }).get();
        return Response.json({ title: data[slug].title , entries:newsdata, page, timestamp });
    } catch (error) {
        console.error('Error fetching data:', error);
        return Response.json({ error: 'Failed to fetch data' }, { status: 500 });
    }

}