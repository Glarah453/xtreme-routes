// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.


export type Usuario = {
  id: number;
  displayname: string;
  email: string;
  password: string;
  fecha_nacimiento: string;
  firebase_uid: string;
  comuna_id: number;
  photoURL: string;
}

export type UsuarioAuth = {
  id: number;
  displayname: string;
  email: string;
  password: string;
  photoURL: string;
};


export type Regiones = {
  id: number;
  nombre: string;
}

export type Comunas = {
  id: number;
  nombre: string;
  region_id: number;
}


export type PostsMain = {
  post_id: number;
  titulo: string;
  user: string;
  region: string;
  comuna: string;
  fecha_creacion: string;
  cantidad_sectores: number;
  cantidad_rutas: number;
  promedio_valoraciones: number;
  cantidad_me_gusta: number;
  cantidad_comentarios: number;
}


export type PostAllInfo = {
  post_id: number;
  titulo: string;
  contenido: string;
  latitud: string;
  longitud: string;
  fecha_creacion: string;
  lastedit: string;
  region: string;
  comuna: string;
  user: string;
  cantidad_sectores: number;
  cantidad_rutas: number;
  promedio_valoraciones: number;
  cantidad_me_gusta: number;
  cantidad_comentarios: number;
}

export type SectorAllInfoByPost = {
  id: number;
}

export type RoutesAllInfoByPost = {
  id: number;
}



export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};
