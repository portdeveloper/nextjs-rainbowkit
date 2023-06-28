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
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
      <ConnectButton />
      <h1 className="p-10 text-9xl">{currentNumber?.toString()}</h1>
      {isConnected && (
        <div>
          <form
            className="flex flex-col items-center justify-center gap-3"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input
              type="number"
              value={newNumber.toString()}
              onChange={(e) => setNewNumber(BigInt(e.target.value))}
              className="w-64 px-2 py-1 text-2xl bg-white border-2 border-black focus:border-green-500 focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              onClick={() => setNumber?.()}
              className="w-48 h-12 px-4 py-2 text-2xl bg-black text-white border-2 border-black hover:bg-gray-700 focus:outline-none focus:ring-0"
            >
              Set Number
            </button>
          </form>
          <div className="flex gap-3 mt-3">
            <button
              onClick={() => increment?.()}
              className="w-48 h-12 text-2xl bg-black text-white border-2 border-black rounded-none hover:bg-gray-800 focus:outline-none focus:ring-0"
            >
              Increment
            </button>
            <button
              onClick={() => decrement?.()}
              className="w-48 h-12 text-2xl bg-black text-white border-2 border-black rounded-none hover:bg-gray-800 focus:outline-none focus:ring-0"
            >
              Decrement
            </button>
            <button
              onClick={() => reset?.()}
              className="w-48 h-12 text-2xl bg-black text-white border-2 border-black rounded-none hover:bg-gray-800 focus:outline-none focus:ring-0"
            >
              Reset
            </button>
          </div>
        </div>
      )}
      <div>
        {logs.map((log, i) => (
          <div key={i} className="mt-4">
            <div className="text-lg">Tx hash:{log[0].transactionHash}</div>
            <div className="text-lg">
              New number:{log[0].args.newNumber.toString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;
