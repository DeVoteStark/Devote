import {
  Account,
  ec,
  stark,
  RpcProvider,
  hash,
  cairo,
  CallData,
  CairoOption,
  CairoOptionVariant,
  CairoCustomEnum,
} from "starknet";
import crypto from "crypto";
import { createContract } from "./ETH";

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
  const DEVOTE_WALLET_ADDRESS = process.env.NEXT_PUBLIC_DEVOTE_PUBLIC_WALLET ?? "";
  const DEVOTE_WALLET_PRIVATE_KEY_ENCRYPTED = process.env.NEXT_PUBLIC_DEVOTE_SECRET_KEY_ENCRYPTED ?? "";

  const DEVOTE_WALLET_PRIVATE_KEY = getDecryptedPrivateKey(DEVOTE_WALLET_PRIVATE_KEY_ENCRYPTED, '1234');

  const provider = new RpcProvider({
    nodeUrl:
      "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/IQNV8HbIxfgGVkxJZyazEK38KIgLQCIn",
  });

  const devoteAccount = new Account(
    provider,
    DEVOTE_WALLET_ADDRESS,
    DEVOTE_WALLET_PRIVATE_KEY
  );

  const contractETH = createContract();
  contractETH.connect(devoteAccount);
  console.log("Devote Account", devoteAccount.address);
  const balance = await contractETH.balance_of(devoteAccount.address);
  console.log("Devote Account Balance", balance);

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

  contractETH.connect(devoteAccount);
  const sendETHCall = contractETH.populate("transfer", {
    recipient: AXcontractAddress,
    amount: cairo.uint256(35000000000000),
  });
  const res = await contractETH.transfer(sendETHCall.calldata);
  console.log("res", res);
  console.log("Transaction hash", res.transaction_hash);
  const resultSendETH = await provider.waitForTransaction(res.transaction_hash);
  console.log("resultSendETH", resultSendETH);

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
