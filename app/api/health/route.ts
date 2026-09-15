import {NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';
export async function GET(){
  try{
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({status:'ok',database:'ok',release:'1.0.0-rc.2',timestamp:new Date().toISOString()},{headers:{'Cache-Control':'no-store'}});
  }catch{
    return NextResponse.json({status:'degraded',database:'error',release:'1.0.0-rc.2',timestamp:new Date().toISOString()},{status:503,headers:{'Cache-Control':'no-store'}});
  }
}
