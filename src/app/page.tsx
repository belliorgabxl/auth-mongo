

export default function Home() {
  return (
  <div className="py-5 w-full h-screen bg-white px-5">
    <div className="w-full flex gap-5 justify-start px-5">
      <a href="/login" className="text-blue-600 border border-gray-200 px-10 rounded-md py-1 hover:bg-slate-400 hover:text-white">
        Sign-In
      </a>
      <a href="/signup" className="text-blue-600 border border-gray-200 px-10 rounded-md py-1 hover:bg-slate-400 hover:text-white">
        Sign-Up
      </a>
    </div>
    <div className="my-5 grid place-content-center w-full bg-blue-100">
      <h1 className="text-6xl w-full px-20 font-bold bg-blue-950 text-center py-20 text-white grid place-items-center rounded-sm">Home Page</h1>
    </div>
    
  </div>
  );
}
