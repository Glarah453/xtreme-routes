'use client';

// import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authClient } from '../app/lib/firebase_Client';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { useRouter } from "next/navigation";
// import { cookies } from "next/headers"; // pero para cliente usamos localStorage
import { getUserByEmail } from "@/app/lib/data";
import { Usuario } from "@/app/lib/definitions";


// interface AuthContextType {
//   user: User | null;
//   usuarioData: { usuario_id: number; nombre: string; email: string; fecha_nacimiento: string; photoURL: string; comuna_id: number; edad?: number } | null;
//   loading: boolean;
// }
//
// export const AuthContext = createContext<AuthContextType>({ user: null, usuarioData: null, loading: true });
//
// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [usuarioData, setUsuarioData] = useState<AuthContextType['usuarioData']>(null);
//   const [loading, setLoading] = useState(true);
//
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(authClient, async (firebaseUser) => {
//       if (firebaseUser) {
//         try {
//           const idToken = await firebaseUser.getIdToken();
//           const response = await fetch(`/api/usuarios/${firebaseUser.uid}`, {
//             headers: { Authorization: `Bearer ${idToken}` },
//           });
//           if (response.ok) {
//             const data = await response.json();
//             setUsuarioData(data);
//           } else {
//             console.error('Error fetching usuario data:', await response.json());
//             setUsuarioData(null);
//           }
//           setUser(firebaseUser);
//         } catch (error) {
//           console.error('Error in auth state change:', error);
//           setUsuarioData(null);
//         }
//       } else {
//         setUser(null);
//         setUsuarioData(null);
//       }
//       setLoading(false);
//     });
//
//     return () => unsubscribe();
//   }, [])
//
//   return (
//     <AuthContext.Provider value={{ user, usuarioData, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


// type AuthContextType = {
//   user: User | null;
//   loading: boolean;
//   needsRegistration: boolean;
// };
//
// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loading: true,
//   needsRegistration: false,
// });
//
// export const useAuth = () => useContext(AuthContext);
//
// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [needsRegistration, setNeedsRegistration] = useState(false);
//
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(authClient, async (firebaseUser) => {
//       if (firebaseUser) {
//         try {
//           // 1. Obtener el token de Firebase
//           const idToken = await firebaseUser.getIdToken();
//
//           // 2. Llamar a la action `authenticate` en el servidor
//           const res = await fetch("/api/authenticate", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ idToken }),
//           });
//
//           const data = await res.json();
//
//           if (data.status === "NEEDS_REGISTRATION") {
//             setNeedsRegistration(true);
//             setUser(firebaseUser);
//           } else {
//             setNeedsRegistration(false);
//             setUser(firebaseUser);
//           }
//         } catch (err) {
//           console.error("Error en AuthContext authenticate:", err);
//           setUser(null);
//         }
//       } else {
//         setUser(null);
//       }
//
//       setLoading(false);
//     });
//
//     return () => unsubscribe();
//   }, []);
//
//   return (
//     <AuthContext.Provider value={{ user, loading, needsRegistration }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


interface AuthContextType {
  user: any;
  usuarioData: Usuario | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [usuarioData, setUsuarioData] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authClient, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser?.email) {
        const dbUser = await getUserByEmail(firebaseUser.email);

        if (dbUser) {
          setUsuarioData(dbUser); // usuario ya registrado en DB
        } else {
          setUsuarioData(null); // no existe en DB → debe ir a register
        }
      } else {
        setUsuarioData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(authClient);
    setUser(null);
    setUsuarioData(null);
  };

  return (
    <AuthContext.Provider value={{ user, usuarioData, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};














// // Tipado
// type UsuarioData = {
//   id: string;
//   nombre: string;
//   email: string;
//   edad?: number;
//   comuna_id?: number;
// };
//
// type AuthContextType = {
//   user: any;
//   usuarioData: UsuarioData | null;
//   loading: boolean;
//   signOut: () => Promise<void>;
// };
//
// const AuthContext = createContext<AuthContextType | undefined>(undefined);
//
// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<any>(null);
//   const [usuarioData, setUsuarioData] = useState<UsuarioData | null>(null);
//   const [loading, setLoading] = useState(true);
//
//   useEffect(() => {
//     // Listener de firebase
//     const unsubscribe = onAuthStateChanged(authClient, async (firebaseUser) => {
//       if (firebaseUser) {
//         setUser(firebaseUser);
//
//         // opcional: pedir datos a tu API interna
//         const res = await fetch("/api/getUserData?email=" + firebaseUser.email);
//         if (res.ok) {
//           const data = await res.json();
//           setUsuarioData(data);
//         }
//       } else {
//         setUser(null);
//         setUsuarioData(null);
//       }
//       setLoading(false);
//     });
//
//     return () => unsubscribe();
//   }, []);
//
//   const signOut = async () => {
//     await firebaseSignOut(authClient); // cerrar en Firebase
//     setUser(null);
//     setUsuarioData(null);
//     // limpiar cookie en backend
//     await fetch("/api/logout", { method: "POST" });
//   };
//
//   return (
//     <AuthContext.Provider value={{ user, usuarioData, loading, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
//
// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used inside AuthProvider");
//   return context;
// }
//




















































// export const AuthContext = createContext<any>(null);
//
// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(authClient, async (firebaseUser) => {
//       if (firebaseUser) {
//         const idToken = await firebaseUser.getIdToken();
//         const res = await fetch("/api/authenticate", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ idToken }),
//         });
//
//         const data = await res.json();
//
//         if (data.status === "NEEDS_REGISTRATION") {
//           // 🚨 aquí hacemos el redirect manual
//           router.push(
//             `/register?uid=${data.uid}&email=${data.email}&displayName=${data.name}&photoURL=${data.picture}`
//           );
//           setUser(null);
//         } else {
//           setUser(data);
//         }
//       } else {
//         setUser(null);
//       }
//       setLoading(false);
//     });
//
//     return () => unsubscribe();
//   }, [router]);
//
//   return (
//     <AuthContext.Provider value={{ user, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
//
// export const useAuth = () => useContext(AuthContext);
