
import { SectorAllInfoByPost } from '@/app/lib/definitions';


export default async function SectorsInfo({ sectorInfoByPost }: { sectorInfoByPost: SectorAllInfoByPost[] }) {

  return (
    <div className="p-2 m-2">
      <div className="grid grid-cols-6 grid-rows-6 gap-4">
        <div className="col-span-3 row-span-6 bg-gray-100">
          1
          <h1>Sectores del Post</h1>
          {sectorInfoByPost.map((sector) => (
            <div key={sector.id}>
              <h2>{sector.nombre}</h2>
              <h3>{sector.descripcion}</h3>
            </div>
          ))}
        </div>
        <div className="col-span-3 row-span-6 col-start-4 bg-gray-100">2</div>
      </div>
    </div>
  );
}
