import axios from "axios";
import crypto from "crypto";
import { NextResponse } from "next/server";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message?: string;
  error?: string;
};

const SUMSUB_BASE_URL = "https://api.sumsub.com";
const SUMSUB_APP_TOKEN = process.env.SUMSUB_TOKEN ?? "";
const SUMSUB_SECRET_KEY = process.env.SUMSUB_API_KEY ?? "";

axios.defaults.baseURL = SUMSUB_BASE_URL;
axios.interceptors.request.use(createSignature, function (error: any) {
  return Promise.reject(error);
});

// This function creates a signature for the request
function createSignature(config: any) {
  console.log("Creating a signature for the request...");
  const timestamp = Math.floor(Date.now() / 1000);
  const method = config.method.toUpperCase();
  const url =
    new URL(config.url, SUMSUB_BASE_URL).pathname +
    new URL(config.url, SUMSUB_BASE_URL).search;
  console.log("url", url);

  const signature = crypto.createHmac("sha256", SUMSUB_SECRET_KEY);
  signature.update(`${timestamp}${method}${url}`);

  if (config.data) {
    signature.update(config.data);
  }

  config.headers["X-App-Token"] = SUMSUB_APP_TOKEN;
  config.headers["X-App-Access-Sig"] = signature.digest("hex");
  config.headers["X-App-Access-Ts"] = timestamp.toString();

  return config;
}

export async function POST(req: NextApiRequest): Promise<NextResponse | void> {
  console.log("POST /api/get-kyc-access-token Wuhu !!!");
  try {
    const { userId } = req.body;

    //const userId = '0xc1d457128dEcAE1CC092728262469Ee796F1Ac45';
    const secretKey = SUMSUB_SECRET_KEY;
    const timestamp = Math.floor(Date.now() / 1000);
    const method = "GET";
    const requestUri = `/resources/applicants/-;externalUserId=${userId}/one`;

    const signaturePayload =
      `${timestamp}${method}${requestUri}`.toLocaleLowerCase();
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(signaturePayload)
      .digest("hex");

    const options = {
      method: "GET",
      url: `https://api.sumsub.com/resources/applicants/-;externalUserId=${userId}/one`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    const response = await axios.request(options);
    console.log("response", response);

    console.log("API response data:", response.data);
    return NextResponse.json(response.data, {
      status: 200,
    });
  } catch (error: any) {
    console.error(
      "Error requesting data:",
      error?.response?.data || error.message
    );

    if (error?.response?.data.description === "Applicant not found") {
      return NextResponse.json(
        { error: "Error Application not found KYC" },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
      }
    );
  }
}
