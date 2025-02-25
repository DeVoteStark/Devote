import { loginStatus } from "@/interfaces/Login";
import {
  encryptData,
  getDecryptedPrivateKey,
} from "@/lib/starknet/createWallet";
import { useEffect, useState } from "react";
import { Account, RpcProvider } from "starknet";

export function useWallet() {
  const [connectionStatus, setConnectionStatus] = useState<loginStatus>(
    loginStatus.PENDING
  );
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [account, setAccount] = useState<Account | undefined>(undefined);

  useEffect(() => {
    const cachedKey = localStorage.getItem("encryptedPrivateKey");
    const cachedAccountAddress = localStorage.getItem("publicKey");

    if (cachedKey && cachedAccountAddress) {
      connectWallet(cachedKey, "secret", cachedAccountAddress);
    } else {
      setConnectionStatus(loginStatus.DISCONECTED);
    }
  }, []);

  const connectWallet = (
    encryptedPrivateKey: string,
    pin: string,
    accountAddress: string
  ) => {
    const provider = new RpcProvider({
      nodeUrl:
        "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/IQNV8HbIxfgGVkxJZyazEK38KIgLQCIn",
    });
    if (accountAddress && account) {
      setConnectionStatus(loginStatus.CONNECTED);
    } else {
      // initialize existing account
      try {
        const decryptedPrivateKey = getDecryptedPrivateKey(
          encryptedPrivateKey,
          pin
        );
        console.log("Decrypted private key", decryptedPrivateKey);
        const account = new Account(
          provider,
          accountAddress,
          decryptedPrivateKey
        );
        if (account) {
          console.log("Account initialized", account);
          setAddress(accountAddress);
          setConnectionStatus(loginStatus.CONNECTED);
          setAccount(account);

          const newEncryptedPrivateKey = encryptData(
            decryptedPrivateKey,
            "secret"
          );

          localStorage.setItem("encryptedPrivateKey", newEncryptedPrivateKey);
          localStorage.setItem("publicKey", accountAddress);
        }
      } catch (error) {
        console.error("Error initializing account", error);
        setConnectionStatus(loginStatus.ERROR);
      }
    }
  };

  const disconnectWallet = () => {
    setConnectionStatus(loginStatus.DISCONECTED);
    setAddress(undefined);
    setAccount(undefined);
    localStorage.removeItem("encryptedPrivateKey");
    localStorage.removeItem("publicKey");
  };

  return {
    connectWallet,
    disconnectWallet,
    connectionStatus,
    address,
    account,
  };
}
