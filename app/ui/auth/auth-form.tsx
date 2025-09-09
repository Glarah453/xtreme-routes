"use client";

import '@/app/ui/auth/auth-form.css'
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authenticate, registerUser } from "@/app/lib/actions";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { authClient } from "@/app/lib/firebase_Client";
import { Button } from "@/app/ui/button";


import { fetchAllRegiones, fetchAllComunasByRegionID } from '@/app/lib/data'



export default function AuthForm() {
  const router = useRouter();
  const search = useSearchParams();

  const [error, setError] = useState<string | null>(null);
  const [googleError, setGoogleError] = useState<string | null>(null);


  const [active, setActive] = useState(false); // false = login, true = register
  const [prefill, setPrefill] = useState<{ uid?: string; email?: string; name?: string; photoURL?: string }>({});

  const [region, setRegion] = useState("");

  const [optionsRegiones, setOptionsRegiones] = useState([]);
  const [optionsComunas, setOptionsComunas] = useState([]);

  useEffect(() => {
    fetchAllRegiones()
      .then((data) => {
        // const arrayRg = data.response;
        // const arrayRg = data[0];
        const mappedOptions = data.map((item) => (
          <option key={item.id} value={item.id}>
            {item.nombre} 
          </option>
        ));

        setOptionsRegiones(mappedOptions);
      })
      .catch((error) => {
        console.error('Error al obtener los datos del primer select:', error);
      });

  }, []);

  useEffect(() => {
    if(!region) return;

    fetchAllComunasByRegionID(region)
      .then((data) => {
        // const arrayCm = data.response;
        // const arrayCm = data[0];
        const mappedOptions = data.map((item) => (
          <option key={item.id} value={item.id}>
            {item.nombre}
          </option>
        ));

        setOptionsComunas(mappedOptions);
      })
      .catch((error) => {
        console.error('Error al obtener los datos del segundo select:', error);
      });

  }, [region]);




  const handleLogin = async (formData: FormData) => {
    // formData.append("provider", "password");
    const res = await authenticate(undefined, formData);
    if (res?.needsRegistration) {
      // setPrefill({ uid: res.uid, email: res.email, name: res.name, photoURL: res.picture });
      setPrefill({ email: res.email });
      setActive(true);
    } else if (res?.success) {
      router.push("/dashboard");
    } else if (res?.error) {
      setError(res.error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(authClient, provider);
      const idToken = await result.user.getIdToken();

      const fd = new FormData();
      fd.append("provider", "google");
      fd.append("idToken", idToken);

      const res = await authenticate(undefined, fd);

      if (res?.needsRegistration) {
        setPrefill({ uid: res.uid, email: res.email, name: res.name, photoURL: res.picture });
        setActive(true);
      } else if (res?.success) {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRegister = async (formData: FormData) => {
    // aquí llamas a tu registerUser de actions.ts
    // si es exitoso => router.push("/dashboard")
    formData.append('uid', prefill.uid ?? "");
    formData.append('picture', prefill.photoURL ?? "");

    // console.log(formData.entries)
    const formValues: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      formValues[key] = value as string;
    }
    console.log('Datos del formulario:', formValues);

    // const res = await registerUser(undefined, formData);
    //
    // if (res.success) {
    //   router.push("/");
    // } else {
    //   setError("Error registering user");
    // }
    //

  };

  return (
    <div className={`container relative ${active ? "active" : ""}`}>
      {/* LOGIN */}
      <div className="form-box login">
        <form action={handleLogin}>
          <h1>Login</h1>
          <div className="input-box">
            <input type="email" name="email" placeholder="Email" required />
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box">
            <input type="password" name="password" placeholder="Password" required />
            <i className="bx bxs-lock-alt"></i>
          </div>
          <Button className="btn w-full">
            Login <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <p>or login with social platforms</p>
          <div className="social-icons">
            {/* <button type="button" onClick={handleGoogleLogin}> */}
            {/*   <i className="bx bxl-google"></i> */}
            {/* </button> */}
            <Button onClick={handleGoogleLogin} className="w-full bg-red-700 hover:bg-red-500">
              Sign in with Google <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
            </Button>
          </div>
        </form>
      </div>

      {/* REGISTER */}
      <div className="form-box register">
        <form action={handleRegister}>
          <h1>Registro de Usuario</h1>
          <div className="input-box-register">
            <input
              type="text"
              name="name"
              placeholder="Username"
              defaultValue={prefill.name}
              required
            />
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box-register">
            <input
              type="email"
              name="email"
              placeholder="Email"
              defaultValue={prefill.email}
              required
            />
            <i className="bx bxs-envelope"></i>
          </div>
          <div className="input-box-register">
            <input
              type="date"
              name="birthdate"
              placeholder="Fecha de Nacimiento"
              // defaultValue={prefill.email}
              required
            />
            <i className="bx bxs-cake"></i>
          </div>
          {/* <div className="input-box-register"> */}
          {/*   <input */}
          {/*     type="text" */}
          {/*     name="picture" */}
          {/*     placeholder="Foto de Perfil" */}
          {/*     defaultValue={prefill.photoURL} */}
          {/*     required */}
          {/*   /> */}
          {/*   <i className="bx bxs-image-alt"></i> */}
          {/* </div> */}
          <div className="input-box-register">
            <select
              type="number"
              name="region"
              placeholder="Region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              // defaultValue={prefill.photoURL}
              required
            >
              <option value="">Selecciona una Región</option>
              {optionsRegiones}
            </select>
            <i className="bx bxs-image-alt"></i>
          </div>
          <div className="input-box-register">
            <select
              type="number"
              name="comuna"
              placeholder="Comuna"
              // defaultValue={prefill.email}
              required
            >
              <option value="">Selecciona una Comuna</option>
              {optionsComunas}
            </select>
            <i className="bx bxs-map-pin"></i>
          </div>
          <div className="input-box-register">
            <input type="password" name="password" placeholder="Password" minLength={6} required />
            <i className="bx bxs-lock-alt"></i>
          </div>
          <Button className="btn w-full">
            Register  <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
        </form>
      </div>

      {/* TOGGLE PANELS */}
      <div className="toggle-box">
        <div className="toggle-panel toggle-left">
          <h1>Hello, Welcome!</h1>
          <p>Don't have an account?</p>
          <button type="button" onClick={() => setActive(true)} className="btn register-btn">
            Register
          </button>
        </div>
        <div className="toggle-panel toggle-right">
          <h1>Welcome Back!</h1>
          <p>Already have an account?</p>
          <button type="button" onClick={() => setActive(false)} className="btn login-btn">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

