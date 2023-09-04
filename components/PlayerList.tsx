"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function PlayerList(props:any){
    const[playerList, setPlayerList] = useState([...props.matches])
    const [name, setName] = useState('');
    const supabase = createClientComponentClient();
    
    //console.log(`Lista${props.matches}`)
    //console.log(playerList)


    const add = async(nickname:String) => {
        let {data:newPlayer, error} = await supabase.from('matches').insert({name:nickname}).select();
        if(error){
            console.log(error);
        }
        //cuando cambia la lista (insert db) ya hace efecto el use effect(implica reload) por lo que setPlayerList([...playerList, newPlayer]) no es necesario;
    }

    const reload = async() => {
      const {data, error} = await supabase.from("matches").select();
      if(data){
        console.log(data);
        setPlayerList(data);      
      }
      if(error){
        console.log(error);
      };
    }

    useEffect(() => {
        const channel = supabase
        .channel("channel")
        .on("postgres_changes", 
          { event: "*", schema: "public", table: "matches" }, 
          (payload) => { 
            console.log('Change received!', payload); 
            reload(); 
          })
          .subscribe();   
          console.log(channel)
          return()=>{
            supabase.removeChannel(channel);
          }   
      }, [playerList])
    
      return(
        <>
        <div>
        <input className="text-black"
            type='text'
            placeholder='Name'
            value={name}
            onChange={(e) => {
                setName(e.target.value);
            }}
        />
        <button className="py-1 px3 rounded" onClick={() => add(name)}>Añadir</button>
        </div>
          <h1>LISTA</h1>
          {playerList.map((player) =>(
            <div>{player.name}</div>
          ))}
        </>
    )

}