import axios from "axios";
import crypto from "crypto";

const SUMSUB_BASE_URL = "https://api.sumsub.com";
const SUMSUB_APP_TOKEN = process.env.SUMSUB_TOKEN ?? "";
const SUMSUB_SECRET_KEY = process.env.SUMSUB_API_KEY ?? "";

// Configuración global de axios para SumSub
axios.defaults.baseURL = SUMSUB_BASE_URL;
axios.interceptors.request.use(createSignature, (error) => Promise.reject(error));

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

export async function createKyc(userId: string, userEmail: string): Promise<string> {
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

  const response = await axios.request(options);
  return response.data.id;
}

export async function getSdkLink(userId: string): Promise<string> {
    const requestUri = `/resources/sdkIntegrations/levels/BasicLevel/websdkLink`;
    const options = {
      method: "POST",
      url: `${SUMSUB_BASE_URL}${requestUri}?externalUserId=${userId}&ttlInSecs=86400`,
      headers: {
        "content-type": "application/json",
      },
    };
  
    const response = await axios.request(options);
    return response.data.url;
}
