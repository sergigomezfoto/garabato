/*import UserID from "@/components/UserID";
import PlayerList from "@/components/prueba";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <UserID/>
      <PlayerList />
    </div>
  )
}*/

import PlayerList from '@/components/PlayerList';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function Home() {
  const supabase = createServerComponentClient({ cookies }) //función q me da acceso a la cookies

  const { data: matches, error } = await supabase.from("matches").select();

  if (!matches) {
    return <div>{error?.toString()}</div>;
  }

  if (matches.length===0) {
    return <div>No files</div>;
  }

  return (
    <>
      <PlayerList matches = {matches}/>
    </>
  )
}

