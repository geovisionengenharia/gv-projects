const required=['DATABASE_URL','SESSION_SECRET','DEMO_CEO_PASSWORD','DEMO_ADMIN_PASSWORD','DEMO_TECH_PASSWORD'];
const missing=required.filter(k=>!process.env[k]);
if(missing.length){console.error(`Missing required environment variables: ${missing.join(', ')}`);process.exit(1)}
if(process.env.SESSION_SECRET.length<32){console.error('SESSION_SECRET must have at least 32 characters.');process.exit(1)}
for(const k of ['DEMO_CEO_PASSWORD','DEMO_ADMIN_PASSWORD','DEMO_TECH_PASSWORD']){if(process.env[k].length<12){console.error(`${k} must have at least 12 characters.`);process.exit(1)}}
console.log('Environment validation passed.');
