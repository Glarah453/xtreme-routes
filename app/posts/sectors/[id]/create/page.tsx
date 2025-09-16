






// export default async function Page() {
export default async function Page(props: { params: Promise<{ id: string }>  }) {
  const params = await props.params;
  const id = params.id;


  return (
    <div>Creacion de Sector en Post {id}</div>
  );
}
