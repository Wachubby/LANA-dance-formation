import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const initialDancers = [
  ['L','Lana','ラナ','#ff5b8f',42,14,0], ['M','Mina','ミナ','#3989d8',25,20,315],
  ['S','Sakura','さくら','#9a63d8',66,20,45], ['Y','Yui','ゆい','#efb52e',24,48,180],
  ['R','Riko','りこ','#35b878',49,46,0], ['A','Airi','あいり','#f07835',72,48,0],
  ['H','Hina','ひな','#35a5d8',34,72,0], ['K','Koto','こと','#e14c58',58,72,0]
].map(([id,name,jp,color,x,y,facing]) => ({id,name,jp,color,x,y,facing}));

const formations = ['Line','V','Inverted V','Triangle','Diamond','Circle'];
const thumbs = [1,2,3,4,5,6,7,8,9,10,11,12];

function Dancer({d, selected, onClick}) {
  return <button className={'dancer '+(selected?'selected':'')} style={{left:`${d.x}%`,top:`${d.y}%`}} onClick={onClick} title={`${d.name} (${d.jp})`}>
    <span className="nose" style={{transform:`translateX(-50%) rotate(${d.facing}deg)`, borderBottomColor:d.color}} />
    <span className="dot" style={{background:d.color}}>{d.id}</span>
  </button>
}

function App(){
  const [mode,setMode] = useState('edit');
  const [selected,setSelected] = useState('L');
  const [snapshot,setSnapshot] = useState(3);
  const [zoom,setZoom] = useState('full');
  const [playing,setPlaying] = useState(false);
  const [bpm,setBpm] = useState(120);
  const [dancers] = useState(initialDancers);
  const selectedDancer = useMemo(()=>dancers.find(d=>d.id===selected),[selected,dancers]);

  return <main className={'app '+mode}>
    <header>
      <div className="brand"><span>Lana</span> Dance Formation</div>
      <nav>
        <button className={mode==='view'?'active':''} onClick={()=>setMode('view')}>View Mode</button>
        {mode==='edit' && <button className="active">Edit Mode</button>}
        <button className="media">▶ Media</button>
        {mode==='edit' && <div className="bpm">BPM <button onClick={()=>setBpm(bpm-1)}>−</button><b>{bpm}</b><button onClick={()=>setBpm(bpm+1)}>+</button></div>}
        <button>⚙ Settings</button><button>EN / 日本語</button>
      </nav>
    </header>

    <section className="workspace">
      <aside className="members">
        <h3>Dancers / メンバー</h3>
        {dancers.map(d=><button key={d.id} className={selected===d.id?'chosen':''} onClick={()=>setSelected(d.id)}>
          <i style={{background:d.color}}>{d.id}</i><span>{d.name} <small>({d.jp})</small></span><em>◉</em>
        </button>)}
      </aside>

      <div className="stage-wrap">
        <div className="stage-label top">Upstage（後ろ）</div>
        <div className="stage-label left">Stage Left（左）</div>
        <div className="stage-label right">Stage Right（右）</div>
        <div className="stage-label bottom">Downstage（前）</div>
        <div className="stage">
          {dancers.map(d=><Dancer key={d.id} d={d} selected={selected===d.id} onClick={()=>setSelected(d.id)}/>)}
          {selectedDancer && <div className="focus-label">Selected: {selectedDancer.name}</div>}
        </div>
      </div>

      {mode==='edit' && <aside className="tools">
        <div className="tabs"><b>Formations</b><span>Moves</span></div>
        <h4>Preset Formations</h4>
        <div className="formation-grid">{formations.map((f,i)=><button key={f}><span className={'mini mini-'+i}>•••••</span>{f}</button>)}</div>
        <h4>Movement Paths</h4>
        <div className="move-grid"><button>↗<small>Straight</small></button><button>⌁<small>Curve</small></button><button>✎<small>Draw</small></button><button>＋<small>Save</small></button></div>
        <div className="library"><b>My Library</b><p>Reusable formations & paths</p><button>Open Library JSON</button></div>
      </aside>}
    </section>

    <section className="timeline">
      <div className="timeline-head"><b>52 Snapshots</b><div><button className={zoom==='full'?'active':''} onClick={()=>setZoom('full')}>FULL</button><button className={zoom==='zoom'?'active':''} onClick={()=>setZoom('zoom')}>ZOOM 32</button></div></div>
      {zoom==='zoom' && <div className="beats">{Array.from({length:32},(_,i)=><span key={i} className={(i%8===0)?'accent':''}>{(i%8)+1}</span>)}</div>}
      <div className="filmstrip">
        {thumbs.map(n=><button key={n} className={snapshot===n?'current':''} onClick={()=>setSnapshot(n)}><div className="thumb-stage"><i/><i/><i/><i/><i/></div><span>{n}</span></button>)}
        <button className="more">…</button>
      </div>
      <div className="transport"><button>−5</button><button className="play" onClick={()=>setPlaying(!playing)}>{playing?'Ⅱ':'▶'}</button><button>+5</button><span>Snapshot {snapshot} of 52</span>{mode==='edit' && <><button className="edit-action">＋ Snapshot</button><button className="edit-action">Undo</button><button className="edit-action">Redo</button></>}</div>
    </section>
  </main>
}

createRoot(document.getElementById('root')).render(<App/>);
