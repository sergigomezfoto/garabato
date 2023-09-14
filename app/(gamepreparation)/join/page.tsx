'use client'
import { useState, useEffect } from 'react';
import InitialUserForm from '../../../components/InitialUserForm';
import WaitingRoom from '../../../components/WaitingRoom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

const JoinPage = ({searchParams}:{searchParams:{sala:string, master:boolean}}) => {
  console.log("salaId", searchParams.sala);
  const id = searchParams.sala;
  const master = searchParams.master;
  console.log("master", searchParams.master.toString());
  const [salaID, setSalaID] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  
  //const [salaClosed, setSalaClosed] = useState<boolean | null>(null);


  if (master===false ) {
    return (
        <div className="flex flex-col items-center justify-center ">
        <div className="w-full max-w-xs">
          <form className="flex flex-col items-center space-y-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 text-center" htmlFor="salaID">
                Únete a una sala
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="salaID"
                type="text"
                placeholder="nombre de la sala"
                value={salaID}
                onChange={(e) => setSalaID(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={()=>setHasJoined(true)}
              >
                Join
              </button>
            </div>
          </form>
        </div>
      </div>)
  }

  else{
    return ( 
      <div>
        {hasJoined ? (
          <>
          <p>Master- {master.toString()}</p>
          <WaitingRoom sala={id} />
          </>
         
        ) : (
          <>
          <p>Master-{master.toString()}</p>
          <InitialUserForm sala={id} onJoin={() => {setHasJoined(true)} }/>
          </>
          
        )}
      </div>
    );

  }
  
  
}
export default JoinPage;
