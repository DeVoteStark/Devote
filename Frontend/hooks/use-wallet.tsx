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
    const RPC_KEY = process.env.NEXT_PUBLIC_METAMASK_RPC_SECRET_KEY ?? "";

    //console.log("The RPC key is:", RPC_KEY);
    // connect provider
    const provider = new RpcProvider({
      nodeUrl: `https://starknet-sepolia.infura.io/v3/${RPC_KEY}`,
    });
    if (accountAddress && account) {
      setConnectionStatus(loginStatus.CONNECTED);
    } else {
      // initialize existing account
      try {
        const privateKey = getDecryptedPrivateKey(encryptedPrivateKey, pin);

        const account = new Account(
          provider,
          accountAddress,
          "0x74eb96b1cd467291d2b28472971d91082039c702c30c064dde76000e33b112249efab77b950bf14c752e71e2ef5b95352055bd4426a96631c9fd336566a9453e24a8623810001c4af2a83d296e792727"
        );
        if (account) {
          //console.log("Account initialized", account);
          setAddress(accountAddress);
          setConnectionStatus(loginStatus.CONNECTED);
          setAccount(account);

          const newEncryptedPrivateKey = encryptData(privateKey, "secret");

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
