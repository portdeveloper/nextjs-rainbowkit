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
  address: "0xd607596aD942973261b239e2BD3903cbE06acFD8",
  abi: counterABI,
} as const;

function Page() {
  const { isConnected } = useAccount();
  const [logs, setLogs] = useState<any[]>([]);
  const [currentNumber, setCurrentNumber] = useState<bigint | undefined>(undefined); // new state variable

  const unwatch = useContractEvent({
    ...contractConfig,
    eventName: "NumberChanged",
    listener(log) {
      console.log(log);
      setLogs((currentLogs) => [...currentLogs, log]);
      setCurrentNumber(log[0].args.newNumber); // update currentNumber with newNumber from event
    },
  });

  const { data: initialNumber } = useContractRead({
    ...contractConfig,
    functionName: "getNumber",
  });

  useEffect(() => {
    if (initialNumber != undefined) {
      setCurrentNumber(initialNumber);
    }
  }, [initialNumber]);

  const { config: incrementConfig } = usePrepareContractWrite({
    ...contractConfig,
    functionName: "increment",
  });

  const { write: increment } = useContractWrite(incrementConfig);

  const { config:decrementConfig } = usePrepareContractWrite({
    ...contractConfig,
    functionName: "decrement",
  });

  const { write: decrement } = useContractWrite(decrementConfig);

  useEffect(() => {
    return () => {
      unwatch?.();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <ConnectButton />
      <h1 className="p-10 text-6xl text-gray-800">
        {currentNumber?.toString()}
      </h1>
      {isConnected && (
        <>
          <button
            onClick={() => increment?.()}
            className="mt-4 px-4 py-2 text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
          >
            Increment
          </button>
          <button
            onClick={() => decrement?.()}
            className="mt-4 px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
          >
            Decrement
          </button>
        </>
      )}
      <div>
        {logs.map((log, i) => (
          <div key={i}>{log[0].transactionHash}</div>
        ))}
      </div>
    </div>
  );
}

export default Page;
