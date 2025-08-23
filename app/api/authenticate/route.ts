'use server';

import { NextResponse } from "next/server";
import { authenticate } from "@/app/lib/actions";


// POST /api/authenticate
export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json(
        { error: "Missing idToken" },
        { status: 400 }
      );
    }

    // Reusamos tu función authenticate con un FormData simulado
    const formData = new FormData();
    formData.append("provider", "google");
    formData.append("idToken", idToken);

    const result = await authenticate(undefined, formData);

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error("Error en /api/authenticate:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}
