import React, { useState } from "react";

//samepage components for the sake of codepen
const TimerControl = ({ titleId, titleClassName, titleText, incrementId, decrementId, lengthId, length, addOnClick, subtractOnClick }) => {
    return (
      <div className="time-control">
        <div id={titleId} className={titleClassName}>
          {titleText}
        </div>
        <div className="button-control">
          <button id={incrementId} value='+' onClick={addOnClick}>
            <span className="material-symbols-outlined">
              arrow_upward
            </span>
          </button>
          <div id={lengthId}>{length}</div>
          <button id={decrementId} value='-' onClick={subtractOnClick}>
            <span className="material-symbols-outlined">
              arrow_downward
            </span>
          </button>
        </div>
      </div>
    )
}

const App = () => {
  const [breakTime, setBreakTime] = useState(5);
  const [sessionTime, setSessionTime] = useState(25);

  // const handleIncrement = (event) => {
  //   setBreakTime(breakTime + 1)
  //   setSessionTime(sessionTime + 1)
  //   console.log(event.target.value)
  // }

  // const handleDecrement = () => {
  //   setSessionTime(breakTime - 1)
  // }

  return (
    <div className="clock-container">
      <div className="clock-title">Pomodoro Clock</div>
      <div className="timer-controls-container">
        <TimerControl 
          titleText='Break Length'
          titleId='break-label'
          titleClassName='break-label-style'
          incrementId='break-increment'
          decrementId='break-decrement'
          lengthId='break-length'
          length={breakTime}
          // click={breakTime}
          addOnClick={() => {setBreakTime(breakTime + 1)}}
          subtractOnClick={() => {breakTime > 0 ? setBreakTime(breakTime - 1) : setBreakTime(0)}}
        />
        <TimerControl 
          titleText='Session Length'
          titleId='session-label'
          titleClassName='session-label-style'
          incrementId='session-increment'
          decrementId='session-decrement'
          lengthId='session-length'
          length={sessionTime}
          // click={sessionTime}
          addOnClick={() => {setSessionTime(sessionTime + 1)}}
          subtractOnClick={() => {sessionTime > 0 ? setSessionTime(sessionTime - 1) : setSessionTime(0)}}
        />
        </div>
        <div className="clock-countdown">
          <div id='timer-label'>
            <h1>Current Session</h1>
            <div id='time-left'>
              <h1>25:00</h1>
            </div>
          </div>
          <div id='start_stop' className="clock-countdown-buttons">
            <button id='start'>
              <span className="material-symbols-outlined">
                play_arrow
              </span>
            </button>
            <button id='stop'>
              <span className="material-symbols-outlined">
                stop
              </span>
            </button>
            <button id='reset'>
              <span className="material-symbols-outlined">
                replay
              </span>
            </button>
          </div>
        </div>  
    </div>
  );
}

export default App;
