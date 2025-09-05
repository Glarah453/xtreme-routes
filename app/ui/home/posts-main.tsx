'use client';

import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { PoatsMain } from '@/app/lib/definitions';

// import { PoatsMain } from '@/app/lib/definitions';
// import { fetchPostsMain } from '@/app/lib/data';
//
// export default async function PostsGrid() {

export default function PostsCarousel({ posts }: { posts: PoatsMain[] }) {
  // const posts_main: PostsMain[] = await fetchPostsMain();
  //
  // console.log(posts_main);
  //
  // const posts = Array.from({ length: 12 }, (_, i) => i + 1);

  // return (
  //   <div className="p-6">
  //     <h1 className="text-2xl font-bold mb-6">Posts</h1>
  //     <div
  //       className="
  //         grid gap-6
  //         grid-cols-1
  //         sm:grid-cols-2
  //         lg:grid-cols-3
  //       "
  //     >
  //       {posts.map((post) => (
  //         <div
  //           key={post}
  //           className="h-[400px] grid grid-rows-2 bg-white rounded-lg shadow-md p-6 flex items-center justify-center text-gray-800 font-semibold text-xl"
  //         >
  //           <div className="h-[178px] bg-gray rounded-lg shadow-md p-6 flex items-center justify-center text-gray-800 font-semibold text-xl">
  //             Image posts
  //           </div>
  //           <div className="h-[218px] bg-white rounded-lg shadow-md p-6 flex items-center justify-center text-gray-800 font-semibold text-xl">
  //             Post {post}
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );

  // return (
  //   <div className="w-full px-4 py-6">
  //     <Swiper
  //       modules={[Navigation]}
  //       navigation
  //       spaceBetween={20}
  //       breakpoints={{
  //         320: { slidesPerView: 1 }, // móviles
  //         640: { slidesPerView: 2 }, // tablets
  //         1024: { slidesPerView: 4 }, // escritorio
  //       }}
  //     >
  //       {posts.map((post) => (
  //         <SwiperSlide key={post.post_id}>
  //           <div className="bg-white rounded-lg shadow-md overflow-hidden">
  //             <img
  //               // src={post.img}
  //               alt={post.titulo}
  //               className="w-full h-48 object-cover"
  //             />
  //             <div className="p-4">
  //               <h3 className="font-semibold text-lg">{post.titulo}</h3>
  //               <p className="text-sm text-gray-600">{post.user}</p>
  //               <div className="flex items-center text-sm text-gray-500 mt-2">
  //                 <span>⭐ {post.promedio_valoraciones}</span>
  //                 <span className="mx-2">·</span>
  //                 <span>{post.region}</span>
  //                 <span className="mx-2">·</span>
  //                 <span>{post.comuna}</span>
  //                 <span className="mx-2">·</span>
  //                 <span>{post.fecha_creacion}</span>
  //               </div>
  //             </div>
  //           </div>
  //         </SwiperSlide>
  //       ))}
  //     </Swiper>
  //   </div>
  // );

  return (
    // <div className="w-full">
    <div >
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}  
        watchOverflow={true} // 👈 desactiva flechas si no hay overflow
        centerInsufficientSlides={true} // centra si hay pocas slides
        // slidesPerView={1} // 👈 valor por defecto (móvil)
        // breakpoints={{
        //   320: { slidesPerView: 1 },   // móvil
        //   640: { slidesPerView: 2 },   // tablet
        //   1024:{ slidesPerView: 3 },   // escritorio.medio
        //   1278:{ slidesPerView: 4 },
        // }}
        breakpoints={{
          320: { slidesPerView: 1, slidesPerGroup: 1, centeredSlides: true },
          640: { slidesPerView: 2, slidesPerGroup: 2 },
          1024: { slidesPerView: 3, slidesPerGroup: 3 },
          1440: { slidesPerView: 4, slidesPerGroup: 4 },
        }}
      >
        {posts.map((post) => (
          <SwiperSlide key={post.post_id} className="!w-auto">
            <Link href={`/posts/${post.post_id}`}>
              <article className="w-full h-full bg-gray rounded-2xl overflow-hidden shadow-sm border max-w-xs">
              {/* <article className="w-full h-full bg-gray rounded-2xl overflow-hidden shadow-sm border"> */}
                <div className="relative">
                  <img
                    // src={post.img}
                    alt={post.titulo}
                    className="w-full h-52 object-cover"
                  />
                  {/* Botón marcador (decorativo) */}
                  <button
                    type="button"
                    className="absolute top-3 right-3 bg-white/90 w-9 h-9 rounded-full grid place-content-center shadow"
                    aria-label="Guardar"
                  >
                    🔖
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-base leading-snug">
                    {post.titulo}
                  </h3>
                  <p className="text-sm text-gray-500">{post.user}</p>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                    <span>⭐ {post.promedio_valoraciones}</span>
                    <span>·</span>
                    <span>{post.region}</span>
                    <span>·</span>
                    <span>{post.comuna}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                    <span>·</span>
                    <span>{post.fecha_creacion}</span>
                    <span>·</span>
                  </div>
                </div>
              </article>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
