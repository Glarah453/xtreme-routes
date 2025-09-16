








// export default async function Page() {
export default async function Page(props: { params: Promise<{ id: string }>  }) {
  const params = await props.params;
  const id = params.id;


  return (
    <div>Crear Ruta en Post {id}</div>
  );
}
