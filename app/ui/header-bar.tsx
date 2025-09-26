

import Search from '@/app/ui/search';
import { MapsViews } from '@/app/ui/home/buttons';

export default async function Header(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {

  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  // const totalPages = await fetchInvoicesPages(query);

  return (
    <header className="bg-white p-4 shadow-md rounded-md m-2">
      {/* <h1 className="text-lg font-semibold">Header</h1> */}
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-2">
        <Search placeholder="Buscar Publcaciones, Sectores, Rutas, Usuarios..." />
        <MapsViews />
      </div>
    </header>
  );
}
