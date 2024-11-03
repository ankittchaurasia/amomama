import WPAPI from "wpapi";

const loginData = {
  endpoint: process.env.NEXT_PUBLIC_WP_ENDPOINT + '/wp-json',
  username: process.env.WP_USER,
  password: process.env.WP_PASS
}

export default async function Update(data:any) {
  const { id, link, message, title } = data;
  try {
    const to = new WPAPI(loginData);
    
    const res = await to.posts().id(id).update({
      title,
      acf:{link, excerpt:message}}
    );
    if(!res) return Response.json({ error: "Failed to update to wordpress" }, { status: 500 });
    return Response.json({ success: true }, { status: 200 });

  } catch (error:any) {
    console.log(error);
    return Response.json({ error: error.message || error }, { status: 500 });
  }
}