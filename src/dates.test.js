import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deadline, expired, jstToday, calendar } from './dates.js';
test('21日前を年・月・うるう年をまたいで計算',()=>{assert.equal(deadline('2027-01-10'),'2026-12-20');assert.equal(deadline('2028-03-21'),'2028-02-29');});
test('締切は日本時間23:30',()=>{assert.equal(expired('2026-12-02',new Date('2026-11-11T14:30:00Z')),false);assert.equal(expired('2026-12-02',new Date('2026-11-11T14:30:01Z')),true);});
test('端末のタイムゾーンによらず日本の日付',()=>assert.equal(jstToday(new Date('2026-11-11T15:00:00Z')),'2026-11-12'));
test('カレンダーは日本時間22:00で文字をエスケープ',()=>{const s=calendar({id:'test',from:'東京,駅',to:'新大阪',date:'2026-12-02'});assert.ok(s.includes('DTSTART:20261111T130000Z'));assert.ok(s.includes('東京\\,駅'));});
