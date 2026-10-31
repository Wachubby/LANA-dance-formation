import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const initialDancers = [
  {id:'1',name:'1',color:'#e53935',x:50,y:18,facing:0},
  {id:'2',name:'2',color:'#f4c430',x:35,y:36,facing:0},
  {id:'3',name:'3',color:'#f06292',x:65,y:36,facing:0},
  {id:'4',name:'4',color:'#43a047',x:25,y:62,facing:0},
  {id:'5',name:'5',color:'#8e5bb7',x:75,y:62,facing:0}
];

const snapshots = [
  {id:1,beat:0,label:'開始'}, {id:2,beat:16,label:'16'}, {id:3,beat:32,label:'32'},
  {id:4,beat:48,label:'48'}, {id:5,beat:64,label:'64'}, {id:6,beat:80,label:'80'}
];

function Dancer({d,state,onClick}) {
  return <button className={`dancer ${state}`} style={{left:`${d.x}%`,top:`${d.y}%`}} onClick={onClick} aria-label={`${d.name}を選択`}>
    <span className="nose" style={{transform:`translateX(-50%) rotate(${d.facing}deg)`,borderBottomColor:d.color}} />
    <span className="dot" style={{background:d.color}}>{d.name}</span>
  </button>;
}

function App(){
  const [mode,setMode] = useState('edit');
  const [selected,setSelected] = useState(null);
  const [snapshot,setSnapshot] = useState(1);
  const [zoom,setZoom] = useState('full');
  const [playing,setPlaying] = useState(false);
  const [bpm,setBpm] = useState(120);
  const [dancers] = useState(initialDancers);

  useEffect(()=>{
    const remembered = localStorage.getItem('lana-selected-dancer');
    if (remembered && dancers.some(d=>d.id===remembered)) setSelected(remembered);
  },[dancers]);

  const chooseDancer = id => {
    const next = selected===id ? null : id;
    setSelected(next);
    if(next) localStorage.setItem('lana-selected-dancer',next);
    else localStorage.removeItem('lana-selected-dancer');
  };

  const selectedDancer = useMemo(()=>dancers.find(d=>d.id===selected),[selected,dancers]);
  const nextGhost = selectedDancer ? {...selectedDancer,x:Math.max(10,selectedDancer.x-18),y:Math.min(82,selectedDancer.y+12),facing:90} : null;

  return <main className={`app ${mode}`}>
    <header>
      <div className="brand"><span>LANA</span> Dance Formation</div>
      <nav>
        <button className={mode==='view'?'active':''} onClick={()=>setMode('view')}>VIEW</button>
        {mode==='edit' && <button className="active">EDIT</button>}
        {mode==='edit' && <div className="bpm">BPM <button onClick={()=>setBpm(Math.max(40,bpm-1))}>−</button><b>{bpm}</b><button onClick={()=>setBpm(Math.min(300,bpm+1))}>＋</button></div>}
        <button>ファイル</button>
        {mode==='edit' && <button>設定</button>}
      </nav>
    </header>

    <section className="workspace">
      <aside className="members">
        <h3>メンバー</h3>
        {dancers.map(d=><button key={d.id} className={selected===d.id?'chosen':''} onClick={()=>chooseDancer(d.id)}>
          <i style={{background:d.color}}>{d.name}</i><span>メンバー {d.name}</span>
        </button>)}
        {selected && <button className="show-all" onClick={()=>chooseDancer(selected)}>全員表示</button>}
      </aside>

      <div className="stage-wrap">
        <div className="audience">↑ 客席</div>
        <div className="stage-size">10 m × 8 m</div>
        <div className="stage">
          {selectedDancer && <svg className="route" viewBox="0 0 100 100" preserveAspectRatio="none"><line x1={selectedDancer.x} y1={selectedDancer.y} x2={nextGhost.x} y2={nextGhost.y}/></svg>}
          {nextGhost && <div className="ghost" style={{left:`${nextGhost.x}%`,top:`${nextGhost.y}%`}}><span className="ghost-nose" style={{transform:`translateX(-50%) rotate(${nextGhost.facing}deg)`}}/><span>{nextGhost.name}</span></div>}
          {dancers.map(d=><Dancer key={d.id} d={d} state={selected ? (selected===d.id?'selected':'dimmed') : 'normal'} onClick={()=>chooseDancer(d.id)}/>)}
          {selectedDancer && <div className="focus-label">選択中：メンバー {selectedDancer.name}　→　点線は次の位置</div>}
        </div>
      </div>

      {mode==='edit' && <aside className="tools">
        <section><h3>フォーメーション</h3><div className="tool-grid three"><button>━<small>Line</small></button><button>∨<small>V</small></button><button>○<small>Circle</small></button></div></section>
        <section><h3>移動・向き</h3><div className="tool-grid four"><button>↗<small>直線</small></button><button>⌁<small>カーブ</small></button><button>⟳<small>スピン</small></button><button>↑<small>客席向き</small></button></div></section>
        <section className="checkpoint"><div><button>↶<small>戻す</small></button><button className="save">保存</button><button>↷<small>やり直す</small></button></div></section>
      </aside>}
    </section>

    <section className="timeline">
      <div className="timeline-head"><b>スナップショット</b><div><button className={zoom==='full'?'active':''} onClick={()=>setZoom('full')}>FULL</button><button className={zoom==='zoom'?'active':''} onClick={()=>setZoom('zoom')}>ZOOM 32</button></div></div>
      {zoom==='zoom' && <div className="beat-scale"><span>0</span><span>8</span><span>16</span><span>24</span><span>32</span></div>}
      <div className="filmstrip">{snapshots.map(s=><button key={s.id} className={snapshot===s.id?'current':''} onClick={()=>setSnapshot(s.id)}><div className="thumb-stage"><i/><i/><i/><i/><i/></div><span>{s.id}・{s.label}</span></button>)}</div>
      <div className="transport"><button onClick={()=>setSnapshot(Math.max(1,snapshot-1))}>◀ 前</button><button className="play" onClick={()=>setPlaying(!playing)}>{playing?'Ⅱ':'▶'}</button><button onClick={()=>setSnapshot(Math.min(snapshots.length,snapshot+1))}>次 ▶</button><span>Snapshot {snapshot} / {snapshots.length}</span>{mode==='edit' && <button className="add">＋ スナップショット</button>}</div>
    </section>
  </main>;
}

createRoot(document.getElementById('root')).render(<App/>);
