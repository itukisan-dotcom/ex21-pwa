import { test } from 'node:test';
import assert from 'node:assert/strict';
import { blankDraft, readStore, validateDraft, STORE_KEY, conditionText } from './storage.js';
const storage=data=>({getItem:key=>data[key]??null});
test('旧版の乗車予定・購入済み状態を保持して移行',()=>{const trip={id:'old',from:'東京',to:'新大阪',date:'2026-12-11',done:true};const migrated=readStore(storage({'ex21-trips-v1':JSON.stringify([trip])}));assert.equal(migrated.trips[0].done,true);assert.equal(migrated.trips[0].adults,1);assert.deepEqual(migrated.trips[0].checks,[false,false,false,false]);});
test('予約条件・区間・チェック・下書きの再読み込み',()=>{const t={...blankDraft(),id:'new',mode:'window',checks:[true,false,true,false],budget:'26000',alternatives:'次の便'};const state={trips:[t],routes:[{id:'route',from:'東京',to:'名古屋'}],draft:{...t,to:'博多'}};const reloaded=readStore(storage({[STORE_KEY]:JSON.stringify(state)}));assert.equal(reloaded.routes[0].to,'名古屋');assert.equal(reloaded.trips[0].checks[2],true);assert.equal(reloaded.draft.to,'博多');assert.ok(conditionText(reloaded.trips[0]).includes('26,000円'));});
test('破損データを読み込んだ場合は保護用エラー',()=>{assert.ok(readStore(storage({[STORE_KEY]:'invalid'})).loadError);});
test('人数上限、時間帯逆転、同一区間、号数、予算を検証',()=>{const good={...blankDraft(),mode:'window'};assert.equal(validateDraft(good),'');for(const patch of [{adults:6,children:1},{adults:0,children:0},{adults:1.5},{from:'新大阪'},{timeFrom:'11:00',timeTo:'09:00'},{mode:'train',trainNumber:''},{budget:'2.5'}])assert.notEqual(validateDraft({...good,...patch}),'');assert.equal(validateDraft({...good,mode:'train',trainNumber:'21'}),'');});
