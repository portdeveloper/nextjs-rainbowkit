"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { counterABI } from "../deployedContracts/generated";

function Page() {
  const { isConnected } = useAccount();

  const { config } = usePrepareContractWrite({
    address: "0x01DA679D78186b830b9aD3dA8EFAe3A826061Cec",
    abi: counterABI,
    functionName: "increment",
  });

  const { write: increment, isLoading, isSuccess } = useContractWrite(config);

  return (
    <div>
      <ConnectButton />
      <h1 className="text-3xl">asdasdasdasdasdasd</h1>
      {isConnected && <button onClick={() => increment?.()}>Increment</button>}
    </div>
  );
}

export default Page;
