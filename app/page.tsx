import Link from 'next/link';

const HomePage = () => {
  return (
    <>
      <h1 className="text-4xl mb-4 text-center">Welcome to the game!</h1>
      <div>
        <Link href="/create">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2">
            Create
          </button>
        </Link>
        {/* <Link href="/join">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-2">
            Join
          </button>
        </Link> */}

      </div>
    </>
  );
};

export default HomePage;
