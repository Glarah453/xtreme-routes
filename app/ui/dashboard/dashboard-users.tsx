"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

import CardWrapper from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton
} from '@/app/ui/skeletons';
// import { AuthContext } from '@/context/AuthContext';
import { useAuth } from '@/context/AuthContext';
import { authClient } from '@/app/lib/firebase_Client';
import { Suspense, useEffect } from "react";

// type DashboardClientProps = {
//   numberOfInvoices: number;
//   numberOfCustomers: number;
//   totalPaidInvoices: number;
//   totalPendingInvoices: number;
// };
//
// export default function DashboardUserPage({
//   numberOfInvoices,
//   numberOfCustomers,
//   totalPaidInvoices,
//   totalPendingInvoices,
// }: DashboardClientProps) {

export default function DashboardUserPage() {

  // const { user, usuarioData, loading } = useContext(AuthContext);
  const { user, usuarioData, loading, sign_out } = useAuth();
  const router = useRouter();
  // const { user, setUser } = useAuth();


  // const handleSignOut = async () => {
  //   await signOut(authClient);
  //   router.push('/');
  // };

  // console.log("datos: ", user, usuarioData, loading)
  console.log("datos: ",  user, usuarioData, loading, sign_out);
  // console.log(usuarioData);

  useEffect(() => {
    if (!loading && (!user || !usuarioData)) {
      // router.replace("/login"); // importante: replace en vez de push
      router.replace("/auth"); // importante: replace en vez de push
    }
  }, [user, usuarioData, loading, router]);

  if (loading) return <p>Cargando...</p>;
  if (!user || !usuarioData) return null; // ya redirige en el useEffect

  const handleSignOut = async () => {
    await sign_out();
    // router.push("/login");
    router.push("/");
  };  


  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard Page
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* <Suspense fallback={<CardsSkeleton />}> */}
        {/*   <CardWrapper /> */}
        {/* </Suspense> */}
      </div>
      <div>
        <h1>Bienvenido, {usuarioData.displayname}</h1>
        <p>Email: {usuarioData.email}</p>
        <p>Edad: {usuarioData.edad}</p>
        <p>Comuna ID: {usuarioData.comuna_id}</p>
        <button onClick={handleSignOut}>Cerrar Sesión</button>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* <Suspense fallback={<RevenueChartSkeleton />}> */}
        {/*   <RevenueChart /> */}
        {/* </Suspense> */}
        {/* <Suspense fallback={<LatestInvoicesSkeleton />}> */}
        {/*   <LatestInvoices /> */}
        {/* </Suspense> */}
      </div>
    </main>
  );
}
