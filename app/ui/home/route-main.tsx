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

export default function RoutesCarousel({ routes }: { routes: PoatsMain[] }) {


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
        {routes.map((route) => (
          <SwiperSlide key={route.id} className="!w-auto">
            {/* <Link href={`/posts/${sector.id}`}> */}
              <article className="w-full h-full bg-gray rounded-2xl overflow-hidden shadow-sm border max-w-xs">
              {/* <article className="w-full h-full bg-gray rounded-2xl overflow-hidden shadow-sm border"> */}
                <div className="relative">
                  <img
                    // src={post.img}
                    alt={route.nombre}
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
                    {route.nombre}
                  </h3>
                  {/* <p className="text-sm text-gray-500">{sector.user}</p> */}
                  {/**/}
                  {/* <div className="flex items-center gap-2 text-sm text-gray-600 mt-2"> */}
                  {/*   <span>⭐ {post.promedio_valoraciones}</span> */}
                  {/*   <span>·</span> */}
                  {/*   <span>{post.region}</span> */}
                  {/*   <span>·</span> */}
                  {/*   <span>{post.comuna}</span> */}
                  {/* </div> */}
                  {/* <div className="flex items-center gap-2 text-sm text-gray-600 mt-2"> */}
                  {/*   <span>·</span> */}
                  {/*   <span>{post.fecha_creacion}</span> */}
                  {/*   <span>·</span> */}
                  {/* </div> */}
                </div>
              </article>
            {/* </Link> */}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
