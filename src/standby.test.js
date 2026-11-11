import {test} from 'node:test';
import assert from 'node:assert/strict';
import {crossedAlert,clockSample,clockValid,clockNow} from './standby.js';
test('アラートの閾値を一度だけ通知、非表示から復帰時も連打しない',()=>{assert.equal(crossedAlert(61,60),60);assert.equal(crossedAlert(60,60),null);assert.equal(crossedAlert(61,9),10);assert.equal(crossedAlert(11,-3),0);assert.equal(crossedAlert(61,59,[60]),null);assert.equal(crossedAlert(9,61),null);assert.equal(crossedAlert(null,59),null);});
test('時刻参照は秒精度と往復遅延を考慮',()=>{const s=clockSample({date:'Thu, 12 Nov 2026 01:00:00 GMT',age:'0',rtt:200,receivedWall:100,receivedMono:500});assert.equal(s.epoch,Date.parse('2026-11-12T01:00:00Z')+600);assert.equal(s.uncertainty,600);assert.equal(clockNow(s,1500,1100),s.epoch+1000);});
test('キャッシュ済み・過大遅延・不正時刻を補正に使わない',()=>{for(const patch of [{age:'1'},{rtt:2100},{date:null},{age:'bad'}])assert.throws(()=>clockSample({date:'Thu, 12 Nov 2026 01:00:00 GMT',rtt:100,age:0,receivedWall:0,receivedMono:0,...patch}));});
test('補正は5分で失効し、端末時計の変化でも失効',()=>{const s={epoch:1000,mono:0,wall:100};assert.equal(clockValid(s,299999,300099),true);assert.equal(clockValid(s,300000,300100),false);assert.equal(clockValid(s,1000,6000),false);assert.equal(clockNow(s,300000,300100),300100);});
