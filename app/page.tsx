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

const contractConfig = {
  address: "0xd607596aD942973261b239e2BD3903cbE06acFD8",
  abi: counterABI,
} as const;

function Page() {
  const { isConnected } = useAccount();
  const [logs, setLogs] = useState<any[]>([]);
  const [currentNumber, setCurrentNumber] = useState<bigint | undefined>(
    undefined
  );
  const [newNumber, setNewNumber] = useState<bigint>(0n);

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

  const { config: decrementConfig } = usePrepareContractWrite({
    ...contractConfig,
    functionName: "decrement",
  });

  const { write: decrement } = useContractWrite(decrementConfig);

  const { config: resetConfig } = usePrepareContractWrite({
    ...contractConfig,
    functionName: "reset",
  });

  const { write: reset } = useContractWrite(resetConfig);

  const { config: setNumberConfig } = usePrepareContractWrite({
    ...contractConfig,
    functionName: "setNumber",
    args: [newNumber],
  });

  const { write: setNumber } = useContractWrite(setNumberConfig);

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
        <div>
          {/* insert form below to set a number function: setNumber */}

          <form
            className="flex items-center justify-center gap-7"
            onSubmit={(e) => {
              e.preventDefault();
              //setNumber?.();
            }}
          >
            <input
              type="number"
              value={newNumber.toString()}
              onChange={(e) => setNewNumber(BigInt(e.target.value))}
              className="w-1/4 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-green-500 focus:outline-none focus:ring"
            />
            <button
              type="submit"
              onClick={() => setNumber?.()}
              className=" px-2 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
            >
              Set Number
            </button>
          </form>
          <div className="flex gap-7">
            <button
              onClick={() => increment?.()}
              className="mt-4 px-4 py-4 text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
            >
              Increment
            </button>
            <button
              onClick={() => decrement?.()}
              className="mt-4 px-4 py-4 text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
            >
              Decrement
            </button>
            <button
              onClick={() => reset?.()}
              className="mt-4 px-4 py-4 text-white bg-gray-500 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
            >
              Reset
            </button>
          </div>
        </div>
      )}
      <div>
        {logs.map((log, i) => (
          <div key={i}>
            <div>Tx hash:{log[0].transactionHash}</div>
            <div>New number:{log[0].args.newNumber.toString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;
