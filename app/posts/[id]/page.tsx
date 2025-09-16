import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
// import SideNavMain from '@/app/ui/home/slidenav-main.tsx';
import SideNavPost from '@/app/ui/posts/slidenav-post.tsx';
import ImagesPosted from '@/app/ui/posts/images-main.tsx';
import SectorsInfo from '@/app/ui/posts/sectors-info.tsx';
import RoutesInfo from '@/app/ui/posts/routes-info.tsx';
import RatingsReviews from '@/app/ui/posts/ratings-reviews.tsx';
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
        <SideNavPost id={id} />
      </div>
      <div className="flex-grow p-6 bg-gray-200 md:overflow-y-auto md:p-8">
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className="bg-white p-4 shadow-md rounded-md m-2">
            <h1 className="text-lg font-semibold">Header</h1>
          </header>

          {/* Main */}
          <div className="flex flex-1 flex-col lg:flex-row gap-2 m-2">
            
            <main className="flex-1 bg-white p-4 rounded-md shadow-md">
              
              <h1>Pagina de posts {id}</h1>
              <ImagesPosted postInfo={postInfo} />

              

              <div className="p-2 m-2">
                <SectorsInfo sectorInfoByPost={sectorInfoByPost} />
                


                <RoutesInfo routesInfoByPost={routesInfoByPost} />
                


                <RatingsReviews />
                
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
  );
}
