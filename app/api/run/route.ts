// import cheerio from 'cheerio'
import { extract, addTransformations } from '@extractus/article-extractor'
import WPAPI from "wpapi";
import axios from 'axios'

export async function POST(request: Request) {

    const requestData = await request.json();
    const { url, noImage, draft } = requestData

    if(noImage){
        addTransformations([{
            patterns: [/amomama/i],
            pre: (document) => {
                document.querySelectorAll('div.pi').forEach(e => e.remove());
                return document;
            }
        }])
    }

    try {
        const article = await extract(url);
       
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
            status: draft ? 'draft' : 'publish',
            featured_media: media.id
        })
    
        let status = "error"
    
        if (newPost.id) {
            status = "success"
        }
        return Response.json({ status })
    }catch(e){
        return Response.json({ status: "error", msg: e.message })
    }

}

