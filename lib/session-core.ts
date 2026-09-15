export type Role='CEO'|'ADMIN'|'TECHNICAL';
export type Session={name:string;email:string;role:Role;exp:number};
const enc=new TextEncoder();
const b64=(bytes:Uint8Array)=>{let s='';for(const b of bytes)s+=String.fromCharCode(b);return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')};
const unb64=(s:string)=>{s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';const raw=atob(s);return Uint8Array.from(raw,c=>c.charCodeAt(0))};
async function key(secret:string){return crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign','verify'])}
export async function signSession(session:Omit<Session,'exp'>,secret:string,ttlSeconds=60*60*12){const payload={...session,exp:Math.floor(Date.now()/1000)+ttlSeconds};const body=b64(enc.encode(JSON.stringify(payload)));const sig=new Uint8Array(await crypto.subtle.sign('HMAC',await key(secret),enc.encode(body)));return `${body}.${b64(sig)}`}
export async function verifySession(token:string|undefined,secret:string):Promise<Session|null>{if(!token)return null;const [body,sig]=token.split('.');if(!body||!sig)return null;try{const ok=await crypto.subtle.verify('HMAC',await key(secret),unb64(sig),enc.encode(body));if(!ok)return null;const s=JSON.parse(new TextDecoder().decode(unb64(body))) as Session;if(!s.exp||s.exp<Math.floor(Date.now()/1000))return null;if(!['CEO','ADMIN','TECHNICAL'].includes(s.role))return null;return s}catch{return null}}
