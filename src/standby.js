export const ALERT_SECONDS = [300, 60, 10, 0];
export function crossedAlert(previous, current, sent = []) {
 if (!Number.isFinite(previous) || !Number.isFinite(current) || current >= previous) return null;
 const crossed = ALERT_SECONDS.filter(s=>previous>s && current<=s && !sent.includes(s));
 return crossed.length ? Math.min(...crossed) : null;
}
export function clockSample({date,age,rtt,receivedWall,receivedMono}) {
 const server=Date.parse(date);
 if(!Number.isFinite(server)||!Number.isFinite(rtt)||rtt<0||rtt>2000||Number(age||0)>0||!Number.isFinite(Number(age||0)))throw Error('新鮮な時刻を取得できませんでした');
 const epoch=server+500+rtt/2;
 return {epoch,mono:receivedMono,wall:receivedWall,offset:epoch-receivedWall,uncertainty:500+rtt/2,rtt};
}
export function clockValid(sample,mono,wall) {
 return !!sample && mono>=sample.mono && mono-sample.mono<300000 && Math.abs((wall-sample.wall)-(mono-sample.mono))<2000;
}
export function clockNow(sample,mono,wall) {return clockValid(sample,mono,wall)?sample.epoch+mono-sample.mono:wall;}
export async function sampleServerClock(fetcher=fetch) {
 const samples=[];
 for(let i=0;i<3;i++){
  const start=performance.now();
  try{const response=await fetcher(`${import.meta.env.BASE_URL}index.html?clock=${crypto.randomUUID()}`,{method:'HEAD',cache:'no-store',signal:AbortSignal.timeout(3500)});
   const end=performance.now(),wall=Date.now();
   if(!response.ok)continue;
   samples.push(clockSample({date:response.headers.get('date'),age:response.headers.get('age'),rtt:end-start,receivedMono:end,receivedWall:wall}));
  }catch{/* Try the next of three bounded samples. */}
 }
 if(!samples.length)throw Error('時刻補正に失敗しました。端末時刻で表示します。接続して再試行してください。');
 return samples.sort((a,b)=>a.rtt-b.rtt)[0];
}
