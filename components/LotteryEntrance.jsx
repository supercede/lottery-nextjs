import { useState, useEffect } from "react";

import { ethers } from "ethers";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useNotification } from "web3uikit";
import { contractAddresses, abi } from "../constants";
import Card from "./Card";

export default function LotteryEntrance() {
  const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const [entranceFee, setEntranceFee] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0");
  const [numberOfPlayers, setNumberOfPlayers] = useState("0");

  const dispatch = useNotification();

  const chainId = parseInt(chainIdHex);

  const lotteryAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress, // specify the networkId
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getPlayersNumber } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress, // specify the networkId
    functionName: "getRecentWinner",
    params: {},
  });

  const {
    runContractFunction: enterLottery,
    data: enterTxResponse,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "enterLottery",
    msgValue: entranceFee,
    params: {},
  });

  async function updateUIValues() {
    const entranceFeeFromCall = (await getEntranceFee()).toString();
    const numPlayersFromCall = (await getPlayersNumber()).toString();
    const recentWinnerFromCall = await getRecentWinner();
    setEntranceFee(entranceFeeFromCall);
    setNumberOfPlayers(numPlayersFromCall);
    setRecentWinner(recentWinnerFromCall);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUIValues();
    }
  }, [isWeb3Enabled]);

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Transaction Notification",
      position: "topR",
      icon: "bell",
    });
  };

  // Probably could add some error handling
  const handleSuccess = async (tx) => {
    await tx.wait(1);
    updateUIValues();
    handleNewNotification(tx);
  };

  return (
    <div className="w-full p-5">
      {lotteryAddress ? (
        <>
          <button
            className="flex items-center px-6 py-2 mx-auto ml-auto text-sm transition-colors duration-300 rounded shadow-lg text-violet-100 bg-violet-500 hover:bg-violet-600 shadow-violet-400"
            // px-6 py-2 text-sm transition-colors duration-300 rounded rounded-full shadow-xl text-violet-100 bg-violet-500 hover:bg-violet-600 shadow-violet-400
            onClick={async () =>
              await enterLottery({
                // onComplete:
                // onError:
                onSuccess: handleSuccess,
              })
            }
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <div className="w-8 h-8 border-b-2 rounded-full animate-spin spinner-border"></div>
            ) : (
              <>
                Enter Lottery
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 ml-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </>
            )}
          </button>
          <div className="flex flex-col items-center justify-center max-w-5xl mx-auto">
            {/* <div className="flex flex-col items-center">
              <h3>Entrance Fee: </h3>
              {ethers.utils.formatUnits(entranceFee, "ether")} ETH
            </div> */}
            <div className="flex flex-col mt-16 space-x-4 xs:flex-row">
              <Card
                title={"Entrance Fee"}
                value={`${ethers.utils.formatUnits(entranceFee, "ether")} ETH`}
              />
              {/* <div className="flex flex-col items-center">
              <h3>The current number of players is: </h3>
              {numberOfPlayers}
            </div> */}
              <Card
                title={
                  Number(numberOfPlayers) === 1 ? "Participant" : "Participants"
                }
                value={numberOfPlayers}
              />
              {/* <div className="flex flex-col items-center">
              <h3>The most recent winner was: </h3>
              {recentWinner}
            </div> */}
            </div>
            <div className="">
              <Card title={"Last Winner"} value={recentWinner} />
            </div>
          </div>
        </>
      ) : (
        <div>Please connect to a supported chain </div>
      )}
    </div>
  );
}
