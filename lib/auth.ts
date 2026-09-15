import { cookies } from 'next/headers';
import {Role,Session,signSession,verifySession} from './session-core';
export type {Role,Session};
const envPassword=(key:'DEMO_CEO_PASSWORD'|'DEMO_ADMIN_PASSWORD'|'DEMO_TECH_PASSWORD',devFallback:string)=>{const value=process.env[key];if(value)return value;return process.env.NODE_ENV==='production'?'':devFallback;};
const USERS:Record<string,{password:string;name:string;role:Role}>={
  'ceo@gv.local':{password:envPassword('DEMO_CEO_PASSWORD','gv-ceo-2026'),name:'Vinícius A. Nogueira',role:'CEO'},
  'admin@gv.local':{password:envPassword('DEMO_ADMIN_PASSWORD','gv-admin-2026'),name:'Administrativo',role:'ADMIN'},
  'tecnico@gv.local':{password:envPassword('DEMO_TECH_PASSWORD','gv-tech-2026'),name:'Equipe Técnica',role:'TECHNICAL'},
};
const secret=()=>process.env.SESSION_SECRET||(process.env.NODE_ENV==='production'?'':'DEV_ONLY_CHANGE_ME_BEFORE_DEPLOY');
export function authenticate(email:string,password:string):Omit<Session,'exp'>|null{const u=USERS[email.toLowerCase()];return u&&u.password&&u.password===password?{email:email.toLowerCase(),name:u.name,role:u.role}:null}
export async function getSession(){const s=secret();if(!s)return null;return verifySession((await cookies()).get('gv_session')?.value,s)}
export async function encodeSession(s:Omit<Session,'exp'>){const sec=secret();if(!sec)throw new Error('SESSION_SECRET não configurado');return signSession(s,sec)}
export const canSeeFinance=(r:Role)=>r==='CEO'||r==='ADMIN';
export const canManageUsers=(r:Role)=>r==='CEO';
