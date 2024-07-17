// import cheerio from 'cheerio'
import { extract, extractFromHtml, addTransformations } from '@extractus/article-extractor'
import WPAPI from "wpapi";
import axios from 'axios'

export async function POST(request: Request) {

    const requestData = await request.json();
    const { url, noImage, draft, site } = requestData

    let wpImage = null;
    let media = null;


    const removeImage = noImage ? ([{
        patterns: [/amomama/i],
        pre: (document) => {
            document.querySelectorAll('div.ti').forEach(e => e.remove());
            return document;
        }
    }]) : [];


    addTransformations([...removeImage, 
        {
            patterns: [/.*/],
            pre: (document) => {
                const meta = document.querySelector('meta[property="og:image"]');
                if (!meta){
                    const img = document.querySelector('.wp-post-image')?.getAttribute('src');
                    wpImage = img;
                }
    
            },
    
        },
    ])




    const loginData = site == "F" ? ({
        endpoint: 'https://forever-love-animals.com/wp-json',
        username: 'ankit',
        password: 'Ankit@gear5!#'
    }) : ({
        endpoint: 'https://animalstrend.com/wp-json',
        username: 'nora',
        password: 'Leonora2001@!'
    });

    try {
        const article = await extract(url);

        const to = new WPAPI(loginData);

     

        try{
            const response = await axios.get(article.image || wpImage || '', { responseType: 'arraybuffer' });
            const fileBuffer = Buffer.from(response.data, 'binary');
            media = await to.media().file(fileBuffer, `${article.title}.jpg`).create();
        }catch(e) {
            console.log(e.message)
        }
    
        const newPost = await to.posts().create({
            title: article.title,
            content: article.content,
            status: draft ? 'draft' : 'publish',
            featured_media: media?.id
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

