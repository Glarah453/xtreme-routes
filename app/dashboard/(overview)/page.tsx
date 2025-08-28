// 'use client';
//
// import { useContext } from "react";
// import { useRouter } from "next/navigation";
// import { signOut } from "firebase/auth";
//
// // import { Card } from '@/app/ui/dashboard/cards';
// import CardWrapper from '@/app/ui/dashboard/cards';
// import RevenueChart from '@/app/ui/dashboard/revenue-chart';
// import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
// import { lusitana } from '@/app/ui/fonts';
// import { fetchCardData } from '@/app/lib/data';
// import { Suspense } from 'react';
// import {
//   RevenueChartSkeleton,
//   LatestInvoicesSkeleton,
//   CardsSkeleton
// } from '@/app/ui/skeletons';
// import { Metadata } from 'next'; 
// import { AuthContext } from '@/context/AuthContext';
// import { authClient } from '@/app/lib/firebase_Client';
//
// export const metadata: Metadata = {
//   title: 'Dashboard',
// };
//
// // export const runtime = "nodejs";
//
// export default async function Page() {
//   const { user, usuarioData, loading } = useContext(AuthContext);
//   const router = useRouter();
//
//   const handleSignOut = async () => {
//     await signOut(auth);
//     router.push('/');
//   };
//
//   if (loading) return <p>Cargando...</p>;
//   if (!user || !usuarioData) return <p>No autenticado</p>;
//
//
//   const {
//     numberOfInvoices,
//     numberOfCustomers,
//     totalPaidInvoices,
//     totalPendingInvoices,
//   } = await fetchCardData(); // wait for fetchLatestInvoices() to finish
//
//   return (
//     <main>
//       <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
//         Dashboard Page
//       </h1>
//       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//         <Suspense fallback={<CardsSkeleton />}>
//           <CardWrapper />
//         </Suspense>
//       </div>
//       <div>
//         <h1>Bienvenido, {usuarioData.nombre}</h1>
//         <p>Email: {usuarioData.email}</p>
//         <p>Edad: {usuarioData.edad}</p>
//         <p>Comuna ID: {usuarioData.comuna_id}</p>
//         <button onClick={handleSignOut}>Cerrar Sesión</button>
//       </div>
//       <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
//         <Suspense fallback={<RevenueChartSkeleton />}>
//           <RevenueChart />
//         </Suspense>
//         <Suspense fallback={<LatestInvoicesSkeleton />}>
//           <LatestInvoices />
//         </Suspense>
//       </div>
//     </main>
//   );
// }

// import { fetchCardData } from '@/app/lib/data';
import DashboardUserPage from '@/app/ui/dashboard/dashboard-users';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};


export default async function Page() {
  // 🚀 Todo lo que sea data fetching en el servidor
  // const {
  //   numberOfInvoices,
  //   numberOfCustomers,
  //   totalPaidInvoices,
  //   totalPendingInvoices,
  // } = await fetchCardData();

  return (
    <>
      <DashboardUserPage  />
        {/* numberOfInvoices={numberOfInvoices} */}
        {/* numberOfCustomers={numberOfCustomers} */}
        {/* totalPaidInvoices={totalPaidInvoices} */}
        {/* totalPendingInvoices={totalPendingInvoices} */}
      {/* /> */}
    </>
  );
}
