import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <nav className="flex flex-col items-center justify-center p-5 border-b-2 xs:flex-row">
      <h1 className="p-4 text-3xl font-bold">Ajasare Crypto Lottery</h1>
      <div className="px-4 py-2 ml-auto sm:ml-0">
        <ConnectButton moralisAuth={false} />
      </div>
    </nav>
  );
}
