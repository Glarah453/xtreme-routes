'use client';

import Link from 'next/link';
import NavLinks from '@/app/ui/home/nav-links';
import NavLinksUser from '@/app/ui/home/nav-user-links';
import UserMenu from '@/app/ui/user-menu';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon,ArrowRightIcon } from '@heroicons/react/24/outline';
// import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useRouter } from "next/navigation";
import { useAuth } from '@/context/AuthContext';
import { authClient } from '@/app/lib/firebase_Client';
import { signOut } from '@/auth';

export default function SideNavMain() {

  const { user, usuarioData, loading, sign_out } = useAuth();
  const router = useRouter();
  // const { user, setUser } = useAuth();


  // const handleSignOut = async () => {
  //   await signOut(authClient);
  //   router.push('/');
  // };

  if(!user || !usuarioData){
    console.log("datos Null: ", user, usuarioData, loading)
  } else {
    console.log("datos process: ...........");
    console.log("user: ", user);
    console.log("usuarioData: ", usuarioData)
  }
  // console.log("datos: ",  user, usuarioData, loading, sign_out);
  // console.log(usuarioData);

  // useEffect(() => {
  //   if (!loading && (!user || !usuarioData)) {
  //     // router.replace("/login"); // importante: replace en vez de push
  //     router.replace("/auth"); // importante: replace en vez de push
  //   }
  // }, [user, usuarioData, loading, router]);

  // if (loading) return <p>Cargando...</p>;
  // if (!user || !usuarioData) return null; // ya redirige en el useEffect

  const handleSignOut = async () => {
    await sign_out();
    // router.push("/login");
    router.push("/");
  };  

  if (loading) {
    return (
      <div className="p-4 text-sm text-gray-500">Cargando...</div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white px-3 py-4 md:px-2">
    {/* <aside className="lg:w-1/6 bg-white p-4 rounded-md shadow-md"> */}
      {user || usuarioData ? 
        (
          <Link
            className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
            href="/"
          >
            <div className="w-32 text-white md:w-40">
              <AcmeLogo />
            </div>
          </Link>
        ) : (
          <Link
            className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
            href="/"
          >
            <div className="w-32 text-white md:w-40">
              <AcmeLogo />
            </div>
          </Link>
        )
      }
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        {/* {user || usuarioData ?  */}
        {/*   ( */}
        {/*     <NavLinksUser id={usuarioData.id} /> */}
        {/*   ) : ( */}
        {/*     <NavLinks /> */}
        {/*   ) */}
        {/* } */}
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
            {/* <form */}
            {/*   action={handleSignOut} */}
            {/* > */}
            {/*   <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"> */}
            {/*     <PowerIcon className="w-6" /> */}
            {/*     <div className="hidden md:block">Sign Out</div> */}
            {/*   </button> */}
            {/* </form> */}
        {user || usuarioData ? 
          (
            
            <UserMenu />
          ) : (
            <Link
               href="/auth"
               // className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
               className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-blue-500 p-3 text-white font-medium hover:bg-blue-400 hover:text-white-500 md:flex-none md:text-base md:justify-start md:p-2 md:px-3"
                
            >
              <span>Sign In</span> <ArrowRightIcon className="ml-auto w-6 text-gray-50" />
            </Link>
          )
        }
      </div>
    </div>
    // </aside>
  );
}
