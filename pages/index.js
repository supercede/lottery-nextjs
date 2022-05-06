import { MoralisProvider, useMoralis } from "react-moralis";
import Header from "../components/Header";
import LotteryEntrance from "../components/LotteryEntrance";
import styles from "../styles/Home.module.css";

const supportedChains = ["31337", "4"];

export default function Home() {
  const { isWeb3Enabled, chainId } = useMoralis();

  return (
    <div className={`${styles.container} text-white min-h-screen h-full `}>
      <Header />
      {isWeb3Enabled ? (
        <div className="flex flex-row mx-auto my-16 max-w-7xl">
          {supportedChains.includes(parseInt(chainId).toString()) ? (
            // <div >
            <LotteryEntrance className="p-8 " />
          ) : (
            // </div>
            <div>{`Please switch to a supported chainId. The supported Chain Ids are: ${supportedChains}`}</div>
          )}
        </div>
      ) : (
        <div>No Metamask wallet detected</div>
      )}
    </div>
  );
}
