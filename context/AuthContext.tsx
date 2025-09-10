'use client';

// import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authClient } from '../app/lib/firebase_Client';
// import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
// import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { User as FirebaseUser, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
// import { cookies } from "next/headers"; // pero para cliente usamos localStorage
import { getUserByEmail } from "@/app/lib/data";
// import { getUserFromCookie } from "@/context/auth"; // lo veremos abajo
import { getUserFromCookie } from './auth'; // lo veremos abajo
import { Usuario } from "@/app/lib/definitions";
import { logOutUser } from '@/app/lib/actions'



// interface AuthContextType {
//   user: any;
//   usuarioData: Usuario | null;
//   loading: boolean;
//   signOut: () => Promise<void>;
// }


// const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthContextType = {
  user: FirebaseUser | null;
  usuarioData: Usuario | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  usuarioData: null,
  loading: true,
});


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [usuarioData, setUsuarioData] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authClient, async (firebaseUser) => {
      if(firebaseUser) {
        setUser(firebaseUser);

        if (firebaseUser?.email) {
          const dbUser = await getUserByEmail(firebaseUser.email);

          if (dbUser) {
            console.log("data Firebase user: ", dbUser)
            setUsuarioData(dbUser); // usuario ya registrado en DB
          } else {
            setUsuarioData(null); // no existe en DB → debe ir a register
          }
        } else {
          setUsuarioData(null);
        }

        setLoading(false);
      } else {
        // 1) Si no hay usuario de Firebase, revisar cookie con nuestro JWT
        const userEmail = await getUserFromCookie();
        // console.log(userEmail);
        const dbUser = await getUserByEmail(userEmail);
        if (dbUser) {
          setUser(null); // no es Firebase
          console.log("data Email Password user: ", dbUser)
          setUsuarioData(dbUser);
        } else {
          setUser(null);
          setUsuarioData(null);
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const sign_out = async () => {
    await signOut(authClient);
    await logOutUser(usuarioData.id)
    setUser(null);
    setUsuarioData(null);
  };

  return (
    <AuthContext.Provider value={{ user, usuarioData, loading, sign_out }}>
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
