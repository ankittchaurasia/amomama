// import cheerio from 'cheerio'
import { extract } from '@extractus/article-extractor'
import WPAPI from "wpapi";
import axios from 'axios'

export async function POST(request: Request) {

    const requestData = await request.json();
    const { url } = requestData

    // const url = "https://news.amomama.com/426434-american-idol-star-and-grammy-winning.html"
    // const html = await fetch(url).then(response => response.text())
    
    try {
        const article = await extract(url)

        const to = new WPAPI({
            endpoint: 'https://forever-love-animals.com/wp-json',
            username: 'ankit',
            password: 'Ankit@gear5!#'
        });
    
        //upload featured image to wordpress
        const response = await axios.get(article.image, { responseType: 'arraybuffer' });
        const fileBuffer = Buffer.from(response.data, 'binary');
        let media = await to.media().file(fileBuffer, `${article.title}.jpg`).create();
    
        const newPost = await to.posts().create({
            title: article.title,
            content: article.content,
            status: 'publish',
            featured_media: media.id
        })
    
        let status = "error"
    
        if (newPost.id) {
            status = "success"
        }
        return new Response(JSON.stringify({status}), {
                headers: {
                    "content-type": "application/json",
                },
        })
    }catch(e){
        return new Response(JSON.stringify({status: "error", msg: e.message}), {
            headers: {
                "content-type": "application/json",
            },
        })
    }

}

