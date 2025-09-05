import PostsCarousel from "@/app/ui/home/posts-main.tsx";
import SectorsCarousel from "@/app/ui/home/sector-main.tsx";
import RoutesCarousel from "@/app/ui/home/route-main.tsx";
// import { PoatsMain } from '@/app/lib/definitions';
import { 
  fetchPostsMain, 
  fetchSectorsMain, 
  fetchRoutesMain 
} from '@/app/lib/data';


export default async function SectionContent() {


  const posts_main = await fetchPostsMain();
  const sector_main = await fetchSectorsMain();
  const routes_main = await fetchRoutesMain();

  // console.log("sectores: ", sector_main);
  // console.log("rutas: ", routes_main);

  return(
    <>

      <PostsCarousel posts={posts_main} />
      <br />
      <SectorsCarousel sectors={sector_main} />
      <br />
      <RoutesCarousel routes={routes_main} />
    </>
  )
}
