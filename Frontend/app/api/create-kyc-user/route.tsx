// api/create-kyc-user/route.ts
import axios from "axios";
import crypto from "crypto";
import { NextResponse } from "next/server";
import connectToDb from "../../../lib/mongodb/mongodb";
import User from "../../../models/user";

const SUMSUB_BASE_URL = "https://api.sumsub.com";
const SUMSUB_APP_TOKEN = process.env.SUMSUB_TOKEN ?? "";
const SUMSUB_SECRET_KEY = process.env.SUMSUB_API_KEY ?? "";

// Configuración global de axios para SumSub
axios.defaults.baseURL = SUMSUB_BASE_URL;
axios.interceptors.request.use(createSignature, (error) => Promise.reject(error));

/**
 * Función que crea la firma requerida para las solicitudes a SumSub.
 */
function createSignature(config: any) {
  const timestamp = Math.floor(Date.now() / 1000);
  const method = config.method.toUpperCase();
  const url =
    new URL(config.url, SUMSUB_BASE_URL).pathname +
    new URL(config.url, SUMSUB_BASE_URL).search;
  const signature = crypto.createHmac("sha256", SUMSUB_SECRET_KEY);
  signature.update(`${timestamp}${method}${url}`);
  if (config.data) {
    const dataString = JSON.stringify(config.data);
    signature.update(dataString);
  }
  config.headers["X-App-Token"] = SUMSUB_APP_TOKEN;
  config.headers["X-App-Access-Sig"] = signature.digest("hex");
  config.headers["X-App-Access-Ts"] = timestamp.toString();
  return config;
}

/**
 * Endpoint POST:
 * 1. Recibe { userId, userEmail } en el body.
 * 2. Llama a SumSub para crear un applicant (KYC) usando el userId y userEmail.
 * 3. Obtiene el kycId (response.data.id) y actualiza el usuario en la base de datos.
 */
export async function POST(req: Request): Promise<NextResponse | void> {
  try {
    const body = await req.json();
    const { userId, userEmail }: { userId: string; userEmail: string } = body;
    
    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: "userId and userEmail are required" },
        { status: 400 }
      );
    }

    // Construimos la URL y opciones para la solicitud a SumSub
    const requestUri = `/resources/applicants`;
    const options = {
      method: "POST",
      url: `${SUMSUB_BASE_URL}${requestUri}?levelName=BasicLevel`,
      headers: {
        "content-type": "application/json",
      },
      data: {
        externalUserId: userId,
        email: userEmail,
        fixedInfo: {
          country: "CRI",
        },
      },
    };

    console.log("SumSub options:", options);
    const response = await axios.request(options);
    console.log("SumSub response data:", response.data);

    // Obtenemos el kycId de la respuesta
    const kycId = response.data.id;
    if (!kycId) {
      return NextResponse.json(
        { error: "No kycId returned from SumSub" },
        { status: 500 }
      );
    }

    // Conectamos a la base de datos y actualizamos el usuario con el kycId
    await connectToDb();
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { kycId },
      { new: true, runValidators: true }
    ).exec();

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found for updating KYC" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "KYC created and user updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(
      "Error creating KYC:",
      error?.response?.data || error.message
    );
    if (error?.response?.data?.description === "Applicant not found") {
      return NextResponse.json(
        { error: "Applicant not found in SumSub" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
