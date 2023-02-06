import { useState, useEffect } from 'react';
import {ReactComponent as Pin} from './pin.svg';
import {ReactComponent as Repeat} from './repeat.svg';

import './App.css';

function App() {
  const [sounds, setSounds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/sounds');
      const data = await response.json();
      for (let i = 0; i < data.length; i++) {
        data[i].playing = false;
        data[i].pin = false;
        data[i].loop = false;
      }
      setSounds(data);
    }
    fetchData();
  }, []);

  const onControlClicked = (name) => {
    const sound = sounds.find((sound) => sound.name === name);
    if (!sound.audio) {
      const audio = new Audio(sound.url);
      audio.preload = 'auto';
      sound.audio = audio;
      audio.addEventListener('ended', () => {
        sound.playing = false;
        setSounds((prev) => prev.map(item => item.name === name ? sound : item));
      });
      setSounds((prev) => prev.map(item => item.name === name ? sound : item));
    }
    if (sound.playing) {
      sound.audio.pause();
      sound.audio.currentTime = 0;
      sound.audio.playing = false;
      sound.playing = false;
    } else {
      sound.audio.play();
      sound.audio.playing = true;
      sound.playing = true;
    }
    setSounds((prev) => prev.map(item => item.name === name ? sound : item));
  }

  const onPinClicked = (name) => {
    const sound = sounds.find((sound) => sound.name === name);
    if (sound.pin) {
      sound.pin = false;
    } else {
      sound.pin = true;
    }
    setSounds((prev) => prev.map(item => item.name === name ? sound : item));
  }

  const onRepeatClicked = (name) => {
    const sound = sounds.find((sound) => sound.name === name);
    if (sound.loop) {
      sound.loop = false;
      sound.audio.loop = false;
    } else {
      sound.audio.loop = true;
      sound.loop = true;
    }
    setSounds((prev) => prev.map(item => item.name === name ? sound : item));
  }

  const fillContainer = sound => {
    return (
      <div key={sound.name} className={sound.playing ? "playing player" : "player"}>
      <button className="sound" onClick={() => onControlClicked(sound.name)}>{sound.name}</button>
      <div className="control">
        <button className="btn" onClick={() => onPinClicked(sound.name)}>
          <Pin fill={sound.pin ? 'red' : 'black'}/>
        </button>
        <button className="btn" onClick={() => onRepeatClicked(sound.name)}>
          <Repeat fill={sound.loop ? 'green' : 'black'}/>
        </button>
      </div>
    </div>
    )
  }

  return (
    <div className="App container">
      <h1>Looped</h1>
      <div className="content">
        {sounds.filter(sound => sound.loop == true).map((sound) => fillContainer(sound))}
      </div>
      <h1>Pinned</h1>
      <div  className="content">
        {sounds.filter(sound => sound.pin == true).map((sound) => fillContainer(sound))}
      </div>
      <h1>Soundboard</h1>
      <div className="content">
        {sounds.map((sound) => fillContainer(sound))}
      </div>
    </div>
  )
}

export default App
