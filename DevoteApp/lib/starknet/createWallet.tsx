import {
  Account,
  ec,
  stark,
  RpcProvider,
  hash,
  CallData,
  CairoOption,
  CairoOptionVariant,
  CairoCustomEnum,
} from "starknet";
import crypto from "crypto";

const algorithm = "aes-256-ecb"; // Encryption algorithm

// Derive encryption key from data
export const getHashFromString = (data: string) => {
  return crypto.createHash("sha256").update(data).digest();
};

// Encrypt the data using the derived key
export const encryptData = (dataToEncrypt: string, pin: string) => {
  const key = getHashFromString(pin);
  const cipher = crypto.createCipheriv(algorithm, key, Buffer.alloc(0));
  let encrypted = cipher.update(dataToEncrypt, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

// Decrypt the data using the derived key
export const decryptData = (encryptedData: string, pin: string): string => {
  const key = getHashFromString(pin);
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.alloc(0));
  let decrypted = decipher.update(encryptedData, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
};

export const getDecryptedPrivateKey = (
  encryptedPrivateKey: string,
  pin: string
) => {
  return decryptData(encryptedPrivateKey, pin);
};

export const generatePrivateKeyEncrypted = (pin: string): string => {
  const privateKey = stark.randomAddress();
  const encryptedPrivateKey = encryptData(privateKey, pin);
  console.log("✅ Encrypted private key:", encryptedPrivateKey);
  return encryptedPrivateKey;
};

export const getFutureWalletAdressFromPrivateKey = (
  encryptedPrivateKey: string,
  pin: string
) => {
  const privateKey = decryptData(encryptedPrivateKey, pin);

  const starkKeyPubAX = ec.starkCurve.getStarkKey(privateKey);

  const argentXaccountClassHash =
    "0x036078334509b514626504edc9fb252328d1a240e4e948bef8d0c08dff45927f";
  const axSigner = new CairoCustomEnum({
    Starknet: { pubkey: starkKeyPubAX },
  });
  const axGuardian = new CairoOption<unknown>(CairoOptionVariant.None);
  const AXConstructorCallData = CallData.compile({
    owner: axSigner,
    guardian: axGuardian,
  });
  const AXcontractAddress = hash.calculateContractAddressFromHash(
    starkKeyPubAX,
    argentXaccountClassHash,
    AXConstructorCallData,
    0
  );
  console.log("✅ Precalculated account address:", AXcontractAddress);
  return AXcontractAddress;
};

export const generateAndDeployNewWalletFromPrivateKey = async (
  encryptedPrivateKey: string,
  pin: string,
  variable?: string
) => {
  const RPC_KEY = process.env.NEXT_PUBLIC_METAMASK_RPC_SECRET_KEY ?? "";

  console.log("The RPC key is:", RPC_KEY);
  // connect provider
  const provider = new RpcProvider({
    nodeUrl:
      "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/IQNV8HbIxfgGVkxJZyazEK38KIgLQCIn",
  });

  //new Argent X account v0.4.0
  const argentXaccountClassHash =
    "0x036078334509b514626504edc9fb252328d1a240e4e948bef8d0c08dff45927f";

  const privateKey = decryptData(encryptedPrivateKey, pin);
  console.log("Decrypted private key", privateKey);

  const starkKeyPubAX = ec.starkCurve.getStarkKey(privateKey);

  // Calculate future address of the ArgentX account
  const axSigner = new CairoCustomEnum({
    Starknet: { pubkey: starkKeyPubAX },
  });
  const axGuardian = new CairoOption<unknown>(CairoOptionVariant.None);
  const AXConstructorCallData = CallData.compile({
    owner: axSigner,
    guardian: axGuardian,
  });
  const AXcontractAddress = hash.calculateContractAddressFromHash(
    starkKeyPubAX,
    argentXaccountClassHash,
    AXConstructorCallData,
    0
  );
  console.log("Precalculated account address=", AXcontractAddress);

  const accountAX = new Account(provider, AXcontractAddress, privateKey);

  const deployAccountPayload = {
    classHash: argentXaccountClassHash,
    constructorCalldata: AXConstructorCallData,
    contractAddress: AXcontractAddress,
    addressSalt: starkKeyPubAX,
  };

  const { transaction_hash: AXdAth, contract_address: AXcontractFinalAddress } =
    await accountAX.deployAccount(deployAccountPayload);
  console.log("✅ ArgentX wallet deployed at:", AXcontractFinalAddress, AXdAth);
  return AXcontractFinalAddress;
};
