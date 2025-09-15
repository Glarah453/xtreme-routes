import RoutesAllInfoByPost from '@/app/lib/definitions';



export default async function RoutesInfo({ routesInfoByPost }: { routesInfoByPost: RoutesAllInfoByPost[] }) {
  
  return (
    <div className="grid grid-cols-6 grid-rows-6 gap-4">
      <div className="col-span-4 row-span-6 bg-gray-100">
        3
      </div>
      <div className="col-span-2 row-span-6 col-start-5 bg-gray-100">
        4
        <h2>Rutas del Post</h2>
        {routesInfoByPost.map((ruta) => (
          <div key={ruta.id}>
            <h3>{ruta.nombre}</h3>
            <h4>{ruta.descripcion}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}
