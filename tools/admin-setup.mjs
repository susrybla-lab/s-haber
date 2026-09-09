import {createInterface} from 'node:readline/promises';
import {stdin,stdout} from 'node:process';
import {writeFile} from 'node:fs/promises';
import {randomBytes} from 'node:crypto';
import {passwordHash} from '../lib/auth.mjs';
const rl=createInterface({input:stdin,output:stdout});
const username=(await rl.question('Yönetici kullanıcı adı: ')).trim();rl.close();
if(!/^[a-zA-Z0-9._-]{3,50}$/.test(username))throw new Error('Kullanıcı adı 3–50 karakter; harf, rakam, nokta, tire veya alt çizgi olmalı.');
if(!stdin.isTTY)throw new Error('Şifre için bu aracı normal bir terminalde açın.');
function password(prompt){stdout.write(prompt);stdin.setRawMode(true);stdin.resume();stdin.setEncoding('utf8');return new Promise(resolve=>{let value='';const onData=chunk=>{for(const char of chunk){if(char==='\u0003'){stdin.setRawMode(false);process.exit(1);}if(char==='\r'||char==='\n'){stdin.off('data',onData);stdin.setRawMode(false);stdin.pause();stdout.write('\n');resolve(value);return;}if(char==='\u007f'||char==='\b'){value=value.slice(0,-1);}else if(char>=' ')value+=char;}};stdin.on('data',onData);});}
const first=await password('Şifre (yazarken görünmez, en az 12 karakter): ');
if(first.length<12||first.length>256)throw new Error('Şifre 12–256 karakter olmalı.');
const second=await password('Şifreyi tekrar yazın: ');if(first!==second)throw new Error('Şifreler eşleşmiyor.');
await writeFile(new URL('../.env.local',import.meta.url),`ADMIN_USERNAME=${username}\nADMIN_PASSWORD_HASH=${passwordHash(first)}\nSESSION_SECRET=${randomBytes(48).toString('hex')}\nGITHUB_REPOSITORY=susrybla-lab/s-haber\nGITHUB_BRANCH=main\n`,{flag:'wx',mode:0o600});
stdout.write('Hesap ayarları .env.local dosyasına kaydedildi. Netlify ortam ayarlarına aktarın. Bu dosyayı GitHub’a yüklemeyin.\n');
