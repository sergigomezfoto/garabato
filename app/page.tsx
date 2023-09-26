import Link from 'next/link';
import Button from '../components/design/Button';

const HomePage = () => {
  return (
    <>
      <h1 className="text-4xl mb-4 text-center">¡Bienvenido al juego!</h1>
      {/* <p>TODO:pequeñísimas instrucciones</p> */}
      <div className="mt-4">
        <Link href="/create">
          <Button text="crea una sala"/>
        </Link>
      </div>
    </>
  );
};

export default HomePage;
