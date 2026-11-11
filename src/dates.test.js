import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deadline, expired, jstToday, calendar, releaseDate, releaseAt, countdown } from './dates.js';
test('21日前を年・月・うるう年をまたいで計算',()=>{assert.equal(deadline('2027-01-10'),'2026-12-20');assert.equal(deadline('2028-03-21'),'2028-02-29');});
test('締切は日本時間23:30',()=>{assert.equal(expired('2026-12-02',new Date('2026-11-11T14:30:00Z')),false);assert.equal(expired('2026-12-02',new Date('2026-11-11T14:30:01Z')),true);});
test('端末のタイムゾーンによらず日本の日付',()=>assert.equal(jstToday(new Date('2026-11-11T15:00:00Z')),'2026-11-12'));
test('カレンダーは日本時間22:00で文字をエスケープ',()=>{const s=calendar({id:'test',from:'東京,駅',to:'新大阪',date:'2026-12-02'});assert.ok(s.includes('DTSTART:20261111T130000Z'));assert.ok(s.includes('東京\\,駅'));});
test('発売開始日は前月同日、日付がなければ当月1日',()=>{for(const [date,expected] of [['2027-01-15','2026-12-15'],['2027-03-28','2027-02-28'],['2027-03-29','2027-03-01'],['2027-03-31','2027-03-01'],['2028-03-29','2028-02-29'],['2028-03-30','2028-03-01'],['2027-05-31','2027-05-01'],['2027-07-31','2027-07-01'],['2027-10-31','2027-10-01'],['2027-12-31','2027-12-01']])assert.equal(releaseDate(date),expected);});
test('発売は日本時間10時、カウントダウンはゼロで止まる',()=>{assert.equal(releaseAt('2026-12-12').toISOString(),'2026-11-12T01:00:00.000Z');assert.deepEqual(countdown('2026-12-12',new Date('2026-11-11T00:59:59Z')),{days:1,hours:0,minutes:0,seconds:1});assert.deepEqual(countdown('2026-12-12',new Date('2026-11-12T01:00:01Z')),{days:0,hours:0,minutes:0,seconds:0});});
