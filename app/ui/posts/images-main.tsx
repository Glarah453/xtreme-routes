
import { PostMain } from '@/app/lib/definiitions';

export default async function ImagesPosted({ postInfo }: { postInfo: PostMain[] }) {


  return (
    <div className="p-2 m-2">
      <h2 className="font-medium mb-2">Info Post</h2>
      {postInfo.map((post) => (
        <div key={post.id}>
          <h1 className="font-medium mb-2">{post.titulo}</h1>
          
          <div className="p-2 m-2">
            <div className="grid grid-cols-6 grid-rows-4 gap-4">
              <div className="col-span-4 row-span-4 bg-gray-100">1</div>
              <div className="col-span-2 row-span-2 col-start-5 bg-gray-100">2</div>
              <div className="col-span-2 row-span-2 col-start-5 row-start-3 bg-gray-100">3</div>
            </div>
          </div>
          <div className="p-2 m-2">
            <div className="grid grid-cols-6 grid-rows-4 gap-4">
              <div className="col-span-3 row-span-4 bg-gray-100">
                1
                <h4>{post.contenido}</h4>
              </div>
              <div className="col-span-2 col-start-5 bg-gray-100">2</div>
              <div className="col-span-2 row-span-3 col-start-5 row-start-2 bg-gray-100">3</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
