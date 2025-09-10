'use server';

import postgres from 'postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  Usuario,
  PostsMain,
  PostAllInfo,
  SectorAllInfoByPost,
  RoutesAllInfoByPost,
  Regiones,
  Comunas,
} from './definitions';
import { formatCurrency } from './utils';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });



export async function getUserByEmail(email: string): Promise<Usuario | null> {
  try {
    const result = await sql<Usuario[]>`
      SELECT id, displayname, email, rol, fecha_nacimiento, photourl, comuna_id, firebase_uid 
      FROM usuarios WHERE email = ${email} LIMIT 1
    `;
    return result.length > 0 ? result[0] : null;
  } catch (err) {
    console.error('Database Error: ', err);
    throw new Error('Failed to get User Info by Email');
  }
}



export async function fetchPostsMain() {
  try {
    const posts = await sql<PostsMain[]>`
      SELECT 
          p.id AS post_id,
          p.titulo,
          u.displayname as user,
          r.nombre as region,
          co.nombre as comuna,
          p.fecha_creacion,
          COUNT(DISTINCT ps.sector_id) AS cantidad_sectores,
          COUNT(DISTINCT pr.ruta_id) AS cantidad_rutas,
          ROUND(COALESCE(AVG(v.valor), 0), 1) AS promedio_valoraciones,
          COUNT(DISTINCT mg.usuario_id) AS cantidad_me_gusta,
          COUNT(DISTINCT c.id) AS cantidad_comentarios
      FROM 
          posts p
      LEFT JOIN 
          usuarios u on p.usuario_id = u.id
      LEFT JOIN
          comunas co on p.comuna_id = co.id 
      LEFT JOIN
          regiones r on co.region_id = r.id
      lEFT JOIN
          posts_sectores ps ON p.id = ps.post_id
      LEFT JOIN 
          posts_rutas pr ON p.id = pr.post_id
      LEFT JOIN 
          valoraciones v ON p.id = v.post_id
      LEFT JOIN 
          me_gusta mg ON p.id = mg.post_id
      LEFT JOIN 
          comentarios c ON p.id = c.post_id
      GROUP BY 
          p.id, p.titulo, u.displayname, r.nombre, co.nombre, p.fecha_creacion
      ORDER BY 
          p.id    
      LIMIT 20
    `;
    // const posts_main = posts.map((post) => ({
    //   ...post,
    // }));

    const posts_main = posts.map((post) => ({
      post_id: post.post_id,
      titulo: post.titulo,
      user: post.user,
      region: post.region,
      comuna: post.comuna,
      fecha_creacion: post.fecha_creacion ? String(post.fecha_creacion) : null,
      cantidad_sectores: post.cantidad_sectores,
      cantidad_rutas: post.cantidad_rutas,
      promedio_valoraciones: post.promedio_valoraciones,
      cantidad_me_gusta: post.cantidad_me_gusta,
      cantidad_comentarios: post.cantidad_comentarios
    }));

    return posts_main;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all posts for main.');
  }
}

export async function fetchPostAllInfoByID(id: string){
  try{
    const postInfo = await sql<PostAllInfo[]>`
      SELECT p.id, p.titulo, p.contenido, p.latitud, p.longitud, p.fecha_creacion, p.lastedit, 
             reg.id AS region_id, reg.nombre AS region_nombre,
             c.id AS comuna_id, c.nombre AS comuna_nombre,
             u.id AS usuario_id, u.displayname AS usuario_nombre, u.email AS usuario_email, u.photourl AS usuario_photourl,
              ROUND(COALESCE(AVG(v.valor), 0), 1) AS promedio_valoraciones,
              COUNT(DISTINCT mg.usuario_id) AS cantidad_me_gusta,
              COUNT(DISTINCT cc.id) AS cantidad_comentarios
      FROM posts p
      LEFT JOIN comunas c ON p.comuna_id = c.id
      LEFT JOIN regiones reg ON c.region_id = reg.id
      LEFT JOIN usuarios u ON p.usuario_id = u.id
      LEFT JOIN 
          valoraciones v ON p.id = v.post_id
      LEFT JOIN 
          me_gusta mg ON p.id = mg.post_id
      LEFT JOIN 
          comentarios cc ON p.id = cc.post_id
      WHERE p.id = ${id}
      GROUP BY 
          p.id, p.titulo, p.contenido, p.latitud, p.longitud, p.fecha_creacion, p.lastedit,
          reg.id, reg.nombre, c.id, c.nombre,
          u.id, u.displayname, u.email, u.photourl
    `;

    return postInfo;
  } catch (error) {
    console.error('Database Error', error);
    throw new Error('Falied to fetch Post Info by ID');
  } 
}


export async function fetchSectorAllInfoByPostID(id: string){
  try{
    const sectorInfoByPost = await sql<SectorAllInfoByPost[]>`
      SELECT  
          s.id, s.nombre, s.descripcion, s.image, s.latitud, s.longitud
      FROM posts p
      LEFT JOIN posts_sectores ps ON p.id = ps.post_id
      LEFT JOIN sectores s ON ps.sector_id = s.id
      WHERE p.id = ${id}
    `;

    return sectorInfoByPost;
  } catch (error) {
    console.error('Database Error', error);
    throw new Error('Falied to fetch Sector Info by PostID');
  } 
}



export async function fetchRoutesAllInfoByPostID(id: string){
  try{
    const routesInfoByPost = await sql<RoutesAllInfoByPost[]>`
      SELECT  
          r.id, r.nombre, r.descripcion, r.distancia, r.desnivel_acumulado, r.es_personalizada, r.privacidad
      FROM posts p
      LEFT JOIN posts_rutas pr ON p.id = pr.post_id
      LEFT JOIN rutas r ON pr.ruta_id = r.id
      WHERE p.id = ${id}
    `;

    return routesInfoByPost;
  } catch (error) {
    console.error('Database Error', error);
    throw new Error('Falied to fetch Routes Info by PostID');
  } 
}

export async function fetchSectorsMain(){
  try{
    const sector_main = await sql`
      SELECT * FROM sectores
    `;

    return sector_main;
  } catch (error) {
    console.error('Database Error', error);
    throw new Error('Failed to fetch Sectors Main');
  }
}


export async function fetchRoutesMain() {
  try{
    const routes_main = await sql`
      SELECT * FROM rutas
    `;

    return routes_main;
  } catch (error) {
    console.error('Database Error', error);
    throw new Error('Failed to fetch Sectors Main');
  }
}


export async function fetchAllRegiones() {
  try{
    const all_regiones = await sql<Regiones[]>`
      SELECT * FROM regiones
    `;

    return all_regiones;
  } catch (error) {
    console.error('Database Error', error);
    throw new Error('Failed to fetch All regiones');
  }
}


export async function fetchAllComunasByRegionID(id: string){
  try{
    const comunasByRegionID = await sql<Comunas[]>`
      SELECT  
          id, nombre
      FROM comunas
      WHERE region_id = ${id}
    `;

    return comunasByRegionID;
  } catch (error) {
    console.error('Database Error', error);
    throw new Error('Falied to fetch Comunas by RegionID');
  } 
}



export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue[]>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0][0].count ?? '0');
    const numberOfCustomers = Number(data[1][0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
