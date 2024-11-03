import Publish from "./publish";
// import Delete from "./delete";
import Update from "./update";

export async function POST(request: Request) {
  try {
    const {action, ...data} = await request.json();

    if(action === 'publish') return await Publish(data);
    else if(action === 'update') return await Update(data);
    // else if(action === 'delete') return await Delete(data);
    else return Response.json({ error: 'Invalid action' }, { status: 400 });


  } catch (error:any) {
    return Response.json({ error: error.message || error }, { status: 500 });
  }
}
