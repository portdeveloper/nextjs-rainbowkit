"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useContractEvent,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { counterABI } from "../deployedContracts/generated";
import { useEffect, useState } from "react";
import { Log, LogTopic } from "viem";

const contractConfig = {
  address: "0x3656c2f6368c06649081a74fa85874f1645602f4",
  abi: counterABI,
} as const;


function Page() {
  const { isConnected } = useAccount();
  const [logs, setLogs] = useState<Log[]>([]);

  const unwatch = useContractEvent({
    ...contractConfig,
    eventName: "NumberIncremented",
    listener(log) {
      console.log(log);
    },
  });

  const { data: getNumber } = useContractRead({
    ...contractConfig,
    functionName: "getNumber",
  });

  const { config } = usePrepareContractWrite({
    ...contractConfig,
    functionName: "increment",
  });

  const { write: increment } = useContractWrite(config);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <ConnectButton />
      <h1 className="p-10 text-6xl text-gray-800">{getNumber?.toString()}</h1>
      {isConnected && (
        <>
          <button
            onClick={() => increment?.()}
            className="mt-4 px-4 py-2 text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
          >
            Increment
          </button>
        </>
      )}
      <div>
        {logs.map((log) => (
          <div key={log.transactionHash}>{log.transactionHash}</div>
        ))}
      </div>
    </div>
  );
}

export default Page;
