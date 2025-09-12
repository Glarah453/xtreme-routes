import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import SideNavMain from '@/app/ui/home/slidenav-main.tsx';
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
    


    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        {/* <SideNav /> */}
        <SideNavMain />
      </div>
      <div className="flex-grow p-6 bg-gray-200 md:overflow-y-auto md:p-8">
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className="bg-white p-4 shadow-md rounded-md m-2">
            <h1 className="text-lg font-semibold">Header</h1>
          </header>

          {/* Main */}
          <div className="flex flex-1 flex-col lg:flex-row gap-2 m-2">
            {/* Sidebar */}
            {/* <aside className="w-1/4 bg-gray-800 p-4 rounded-md shadow-md"> */}
            {/*   <h2 className="font-medium mb-2">Sidebar</h2> */}
            {/*   <p className="text-sm text-gray-300">Contenido del sidebar</p> */}
            {/* </aside> */}
            {/* <SideNavMain /> */}

            {/* Content */}
            <main className="flex-1 bg-white p-4 rounded-md shadow-md">
              {/* <h2 className="font-medium mb-2">Content</h2> */}
              {/* <p className="text-sm text-gray-600"> */}
              {/*   Aquí va el contenido principal.   */}
              {/*   Agrega suficiente texto o elementos para que se genere scroll y */}
              {/*   así el footer se vea al final. */}
              {/* </p> */}
              <h1>Pagina de posts {id}</h1>
              <div className=" m-2">
                <h2 className="font-medium mb-2">Info Post</h2>
                {postInfo.map((post) => (
                  <div key={post.id}>
                    <h1 className="font-medium mb-2">{post.titulo}</h1>
                    <h4>{post.contenido}</h4>
                  </div>
                ))}
              </div>
              {/* <div className="h-96 mt-4 bg-gray-200 rounded-md flex items-center justify-center"> */}
              {/*   Bloque de ejemplo (para simular contenido largo) */}
              {/* </div> */}
              {/* <div class="flex gap-[25px] flex-row md:flex-column flex-wrap md:flex-nowrap justify-center items-start content-start p-3"> */}
              {/*   <div className="w-[650px] h-[500px] grow bg-gray-200 p-2 ">1</div> */}
              {/*   <div className="w-[650px] h-[500px] grow bg-gray-200 p-2 ">2</div> */}
              {/*   <div className="w-170 h-[500px] grow bg-gray-200 p-2 ">3</div> */}
              {/*   <div className="w-170 h-[500px] grow bg-gray-200 p-2 ">4</div> */}
              {/*   <div className="w-170 h-[500px] grow bg-gray-200 p-2 ">5</div> */}
              {/*   <div className="w-170 h-[500px] grow bg-gray-200 p-2 ">6</div> */}
              {/*   <div className="w-170 h-[500px] grow bg-gray-200 p-2 ">7</div> */}
              {/*   <div className="w-170 h-[500px] grow bg-gray-200 p-2 ">8</div> */}
              {/* </div> */}


              {/* <PostGrid /> */}
              {/* <PostsCarousel posts={posts_main} /> */}
              {/* <SectionContent /> */}

              <div>
                
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

            </main>
          </div>

          {/* Footer */}
          <footer className="bg-white p-4 shadow-md rounded-md m-2 text-center">
            <p className="text-sm text-gray-600">Footer</p>
          </footer>
        </div>
      </div>
    </div>

  )
}
