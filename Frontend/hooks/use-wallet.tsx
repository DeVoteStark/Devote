import { useAccount } from "@starknet-react/core";
import * as React from "react";

export function useWallet() {
  const { address, isConnected, isDisconnected } = useAccount();
  const [smallAddress, setSmallAddress] = React.useState("");

  React.useEffect(() => {
    if (isConnected && address) {
      setSmallAddress(address.slice(0, 6) + "..." + address.slice(-4));
    }
  }, [address, isConnected]);

  React.useEffect(() => {
    if (isDisconnected) {
      setSmallAddress("");
    }
  }, [isDisconnected]);

  return { address, isConnected, isDisconnected, smallAddress };
}
