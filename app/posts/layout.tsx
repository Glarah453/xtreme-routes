// import SideNav from '@/app/ui/dashboard/sidenav';
// import SideNavPost from '@/app/ui/posts/slidenav-post.tsx';

export const runtime = "nodejs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
    {/* <div className="flex h-screen flex-col md:flex-row md:overflow-hidden"> */}
      {/* <div className="w-full flex-none md:w-64"> */}
      {/*   <SideNavPost /> */}
      {/* </div> */}
      {/* <div className="flex-grow p-6 bg-gray-200 md:overflow-y-auto md:p-8"> */}
      {/*    {children} */}
      {/* </div> */}
      {children}
    </div>
  );
}
