import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {verifySession,Role} from './lib/session-core';
const financePrefixes=['/financeiro','/contabilidade','/dre'];
const ceoPrefixes=['/equipe','/auditoria'];
const allowed=(role:Role,path:string)=>!(ceoPrefixes.some(x=>path.startsWith(x))&&role!=='CEO')&&!(financePrefixes.some(x=>path.startsWith(x))&&role==='TECHNICAL');
export async function middleware(req:NextRequest){
 const p=req.nextUrl.pathname;
 if(p.startsWith('/login')||p.startsWith('/api/auth')||p.startsWith('/api/health')||p.startsWith('/_next'))return NextResponse.next();
 const secret=process.env.SESSION_SECRET||(process.env.NODE_ENV==='production'?'':'DEV_ONLY_CHANGE_ME_BEFORE_DEPLOY');
 if(!secret){if(p.startsWith('/api/'))return NextResponse.json({error:'Servidor não configurado'},{status:503});return NextResponse.redirect(new URL('/login',req.url));}
 const s=await verifySession(req.cookies.get('gv_session')?.value,secret);
 if(!s){if(p.startsWith('/api/'))return NextResponse.json({error:'Não autenticado'},{status:401});return NextResponse.redirect(new URL('/login',req.url));}
 if(!allowed(s.role,p)){if(p.startsWith('/api/'))return NextResponse.json({error:'Sem permissão'},{status:403});return NextResponse.redirect(new URL('/',req.url));}
 const h=new Headers(req.headers);h.set('x-gv-user-email',s.email);h.set('x-gv-user-role',s.role);return NextResponse.next({request:{headers:h}});
}
export const config={matcher:['/((?!favicon.ico).*)']};
