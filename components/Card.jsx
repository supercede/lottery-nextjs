export default function Card({ value, title }) {
  return (
    <div
      className=" h-auto px-6 py-4 mb-3 overflow-y-scroll bg-white border-0 rounded shadow-none drop-shadow-none max-w-[90vw]"
      style={{ wordBreak: "break-word" }}
    >
      <div className="flex flex-col items-center justify-center h-full ">
        {/* <div> */}
        <p className="text-3xl font-semibold tracking-normal text-center text-black align-middle ">
          {value}
        </p>
        <p className="mb-2 text-xl font-medium text-center text-black dark:text-gray-400">
          {title}
        </p>
        {/* </div> */}
      </div>
    </div>
  );
}
