import { jstToday, shiftDate } from './dates.js';
export const STORE_KEY = 'ex21-planner-v2';
export const CHECKS = ['公式サイトへログインできる','乗車日・区間・人数を確認した','対象区間・除外日・発売条件を公式で確認した','希望列車・座席・予算・代替候補を確認した'];
export function blankDraft() { return {from:'東京',to:'新大阪',date:shiftDate(jstToday(),35),mode:'train',trainType:'のぞみ',trainNumber:'',trainTime:'',timeBasis:'departure',timeFrom:'08:00',timeTo:'10:00',adults:1,children:0,seat:'指定なし',adjacent:false,baggage:false,budget:'',alternatives:'',notes:''}; }
const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(Date.parse(value)) && new Date(value+'T00:00:00Z').toISOString().slice(0,10)===value;
export function normalizeTrip(t) {
 if (!t || typeof t.id!=='string' || typeof t.from!=='string' || typeof t.to!=='string' || !validDate(t.date)) return null;
 return {...blankDraft(),...t,checks:Array.isArray(t.checks)?CHECKS.map((_,i)=>t.checks[i]===true):CHECKS.map(()=>false),done:t.done===true};
}
export function readStore(storage) {
 try {
  storage ||= globalThis.localStorage;
  const current=storage.getItem(STORE_KEY);
  if(current!==null){const data=JSON.parse(current);if(!data || !Array.isArray(data.trips)||!Array.isArray(data.routes))throw Error('format');return {trips:data.trips.map(normalizeTrip).filter(Boolean),routes:data.routes.filter(r=>r&&typeof r.id==='string'&&typeof r.from==='string'&&typeof r.to==='string'),draft:{...blankDraft(),...(data.draft||{})}};}
  const legacy=JSON.parse(storage.getItem('ex21-trips-v1')||'[]');
  return {trips:Array.isArray(legacy)?legacy.map(normalizeTrip).filter(Boolean):[],routes:[],draft:blankDraft()};
 }catch{return {trips:[],routes:[],draft:blankDraft(),loadError:'保存データを読み込めませんでした。元のデータは上書きしていません。'};}
}
export function validateDraft(d) {
 if(!d.from.trim()||!d.to.trim()||d.from.trim()===d.to.trim())return '出発駅と到着駅を別々に入力してください。';
 if(!validDate(d.date))return '有効な乗車日を入力してください。';
 if(!Number.isInteger(Number(d.adults))||!Number.isInteger(Number(d.children))||Number(d.adults)<0||Number(d.children)<0||Number(d.adults)+Number(d.children)<1||Number(d.adults)+Number(d.children)>6)return '人数はおとな・こども合わせて1〜6名にしてください。';
 if(d.mode==='train'&&!/^\d{1,4}$/.test(d.trainNumber))return '指定する列車の号数を数字で入力してください。';
 if(d.mode==='window'&&(!/^([01]\d|2[0-3]):[0-5]\d$/.test(d.timeFrom)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(d.timeTo)||d.timeFrom>d.timeTo))return '希望時間帯の開始と終了を確認してください（日付をまたぐ時間帯は分けて登録してください）。';
 if(d.budget!==''&&(!Number.isSafeInteger(Number(d.budget))||Number(d.budget)<0))return '予算は0円以上の整数で入力してください。';
 return '';
}
export function conditionText(t) {
 return [`${t.from} → ${t.to} / 乗車日 ${t.date}`,t.mode==='train'?`列車：${t.trainType} ${t.trainNumber||'未指定'}号${t.trainTime?' / 発車 '+t.trainTime:''}`:`${t.timeBasis==='arrival'?'到着':'出発'}時間帯：${t.timeFrom}〜${t.timeTo}`,`人数：おとな${t.adults}名・こども${t.children}名`,`座席：${t.seat}${t.adjacent?' / 並び席希望':''}${t.baggage?' / 特大荷物スペース希望':''}`,`合計予算：${t.budget===''?'指定なし':Number(t.budget).toLocaleString('ja-JP')+'円'}`,`代替候補：${t.alternatives||'未登録'}`,`メモ：${t.notes||'なし'}`].join('\n');
}
