import Link from 'next/link';
import type { ReactNode } from 'react';

export function Shell({children,active}:{children:ReactNode,active:string}){
  const nav=[['CEO Dashboard','/'],['CRM','/crm'],['Clientes','/clientes'],['Projetos','/projetos'],['Agenda','/agenda'],['Calendário','/calendario'],['Financeiro','/financeiro'],['DRE','/dre'],['Contabilidade','/contabilidade'],['Equipe','/equipe'],['Auditoria','/auditoria']];
  return <div className="app"><aside><div className="brand">GV Projects<small>GEOVISION</small></div>{nav.map(([n,h])=><Link className={n===active?'active':''} href={h} key={n}>{n}</Link>)}</aside><main>{children}</main></div>
}
