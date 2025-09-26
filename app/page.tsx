// import AcmeLogo from '@/app/ui/acme-logo';
// import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
// import Image from 'next/image';
import Header from '@/app/ui/header-bar';
import SideNavMain from '@/app/ui/home/slidenav-main.tsx';
// import PostGrid from '@/app/ui/home/posts-main.tsx';
// import PostsCarousel from "@/app/ui/home/posts-main.tsx";
import SectionContent from "@/app/ui/home/content-main.tsx";

// import dynamic from 'next/dynamic';
// import { PoatsMain } from '@/app/lib/definitions';
// import { fetchPostsMain } from '@/app/lib/data';

// const PostsCarousel = dynamic(() => import('@/app/ui/home/posts-main'), {
//   ssr: false,
// });

export default async function Page() {

  // const posts_main: PostsMain[] = await fetchPostsMain();
  // const posts_main = await fetchPostsMain();

  // console.log(posts_main);


  
  // return (
  //   <div className="flex gap-[2%] flex-wrap content-start flex-row">
  //     <div className="w-full h-[5%]">Header</div>
  //     <div className="w-1/4 h-3/4">Sidebar</div>
  //     <div className="grow h-3/4">Content</div>
  //     <div className="w-full h-[5%]">Footer</div>
  //   </div>
  // );


  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        {/* <SideNav /> */}
        <SideNavMain />
      </div>
      <div className="flex-grow p-6 bg-gray-200 md:overflow-y-auto md:p-8">
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <Header />
          {/* <header className="bg-white p-4 shadow-md rounded-md m-2"> */}
          {/*   <h1 className="text-lg font-semibold">Header</h1> */}
          {/* </header> */}

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
              <h2 className="font-medium mb-2">Content</h2>
              <p className="text-sm text-gray-600">
                Aquí va el contenido principal.  
                Agrega suficiente texto o elementos para que se genere scroll y
                así el footer se vea al final.
              </p>
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
              <SectionContent />

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
