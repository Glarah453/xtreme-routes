
import { Metadata } from 'next';

import { 
  fetchPostAllInfoByID, 
  fetchSectorAllInfoByPostID, 
  fetchRoutesAllInfoByPostID 
} from '@/app/lib/data';

export default async function Page(props: { params: Promise<{ id: string }> }) {

  const params = await props.params;
  console.log(params.id);
  const id = params.id;

  const [postInfo, sectorInfoByPost, routesInfoByPost] = await Promise.all([
    fetchPostAllInfoByID(id),
    fetchSectorAllInfoByPostID(id),
    fetchRoutesAllInfoByPostID(id)
  ]);  

  console.log("post info: ", postInfo);
  console.log("sectors info by post: ", sectorInfoByPost),
  console.log("routes info by post: ", routesInfoByPost);


  return (
    <div>
      <h1>Pagina de posts {id}</h1>
      <div>
        <h2>Info Post</h2>
        {postInfo.map((post) => (
          <div key={post.id}>
            <h3>{post.titulo}</h3>
            <h4>{post.contenido}</h4>
          </div>
        ))}
      </div>
      <div>
        <h2>Sectores del Post</h2>
        {sectorInfoByPost.map((sector) => (
          <div key={sector.id}>
            <h3>{sector.nombre}</h3>
            <h4>{sector.descripcion}</h4>
          </div>
        ))}
      </div>
      <div>
        <h2>Rutas del Post</h2>
        {routesInfoByPost.map((ruta) => (
          <div key={ruta.id}>
            <h3>{ruta.nombre}</h3>
            <h4>{ruta.descripcion}</h4>
          </div>
        ))}
      </div>

    </div>
  )
}
