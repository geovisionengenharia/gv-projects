import {NextResponse} from 'next/server';
import {authenticate,encodeSession} from '@/lib/auth';
export async function POST(req:Request){
  const {email,password}=await req.json();
  const user=authenticate(String(email||''),String(password||''));
  if(!user)return NextResponse.json({error:'Credenciais inválidas'},{status:401});
  const token=await encodeSession(user);
  const res=NextResponse.json({ok:true,user});
  res.cookies.set('gv_session',token,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*12});
  return res;
}
