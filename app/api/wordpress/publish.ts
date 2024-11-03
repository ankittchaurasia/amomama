import WPAPI from "wpapi";
import axios from "axios";


export default async function Publish(data:any) {
  const { domain, title, content, excerpt, featuredImage, slug, fbImage } = data;
  if(!domain || !title || !content) return Response.json({ error: 'Missing title, content' }, { status: 400 });
  
  const loginData = domain == "1" ? ({
    endpoint: 'https://forever-love-animals.com/wp-json',
    username: 'ankit',
    password: 'Ankit@gear5!#'
  }) : ({
    endpoint: 'https://animalstrend.com/wp-json',
    username: 'nora',
    password: 'Leonora2001@!'
  });

  let media = null;


  try {
    const to = new WPAPI(loginData);

      if(featuredImage){
        const imgres = await axios.get(featuredImage, { responseType: 'arraybuffer' });
        const bufferImg:any = Buffer.from(imgres.data, 'binary');

        media = await (to.media().file(bufferImg, `${Date.now()}.jpg`) as any).create();
      }

    const postData:any = { title, content, status: 'publish', slug }
    if(media) postData.featured_media = media.id;
    if(excerpt) postData.acf = { excerpt };
    if(fbImage) postData.acf = { image: fbImage };

    const newPost = await to.posts().create(postData);
    
    if(newPost.id) return Response.json({ postid: newPost.id, link: newPost?.link }, { status: 200 });
    else return Response.json({ error: "Failed to publish to WordPress" },{ status: 400 });


  } catch (error:any) {
    console.log(error);
    return Response.json({ error: error.message || error }, { status: 500 });
  }
}