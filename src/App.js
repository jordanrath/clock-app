import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

const STATUS = {
  start: "Start",
  stop: "Stop"
};

const CLOCKPHASES = {
  break: "Break",
  session: "Session"
};

const initialTime = 1500;

const useInterval= (callback, tickCadence) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

useEffect(() => {
  const clockTick = () => {
    savedCallback.current();
  }
  if (tickCadence !== null) {
    let intervalId = setInterval(clockTick, tickCadence);
    return () => clearInterval(intervalId);
  }
}, [tickCadence]);
}

const twoDigits = (num) => String(num).padStart(2, "0");

const App = () => {
  const [secondsRemaining, setSecondsRemaining] = useState(initialTime);
  const [status, setStatus] = useState(STATUS.stop)
  const [breakTime, setBreakTime] = useState(5);
  const [sessionTime, setSessionTime] = useState(25);
  const [clockPhase, setClockPhase] = useState(CLOCKPHASES.session);

  const secondsToDisplay = useMemo(() => secondsRemaining % 60, [secondsRemaining]);
  const minutesRemaining = useMemo(() => (secondsRemaining - secondsToDisplay) / 60, [secondsRemaining, secondsToDisplay]);
  const minutesToDisplay = useMemo(() => minutesRemaining % 61, [minutesRemaining]);

  const playSound = () => {
    const alarmSound = document.getElementById('beep');
    alarmSound.play();
  }

  const handleStart = () => {
    if (status === STATUS.stop) {
      setStatus(STATUS.start);
      if (minutesRemaining === 0 && secondsRemaining === 0) {
        setClockPhase(CLOCKPHASES.session);
        setSecondsRemaining(sessionTime * 60);
      }
    } else {
      setStatus(STATUS.stop);
    } 
  };

  const handleStop = useCallback(() => {
    setStatus(STATUS.stop);
  }, [setStatus]);

  const handleReset = useCallback(() => {
    setStatus(STATUS.stop);
    setBreakTime(5);
    setSessionTime(25);
    setSecondsRemaining(initialTime);
    setClockPhase(CLOCKPHASES.session);
    
    const alarmSound = document.getElementById('beep');
    alarmSound.pause();
    alarmSound.currentTime = 0;
  }, [
    setStatus, 
    setBreakTime, 
    setSessionTime, 
    setSecondsRemaining, 
    setClockPhase,
  ]);

  useInterval(() => {
    if (secondsRemaining > 0) {
      setSecondsRemaining(secondsRemaining - 1);
    } else if (secondsRemaining === 0 && minutesRemaining === 0) {
      playSound();
      if (clockPhase === CLOCKPHASES.break) {
        setClockPhase(CLOCKPHASES.session);
        setSecondsRemaining(sessionTime * 60);
      } else {
        setSecondsRemaining(breakTime * 60);
        setClockPhase(CLOCKPHASES.break);
      }
    }
  },
    status === STATUS.start ? 1000  : null
  );

  const addSessionUpdate = useCallback(() => {
    if (status === STATUS.stop && sessionTime <= 59) {
      setSecondsRemaining(secondsRemaining + 60);  
      setSessionTime(sessionTime + 1);
    }
    if (status === STATUS.start) {
      setSecondsRemaining(secondsRemaining);
      setSessionTime(sessionTime + 0);
    }
  }, [
    setSecondsRemaining, 
    setSessionTime, 
    sessionTime, 
    secondsRemaining, 
    status
  ]);

  const subtractSessionUpdate = useCallback(() => {
    if (status === STATUS.stop && secondsRemaining > 0 && sessionTime > 1) {
      const newSecondsRemaining = secondsRemaining - 60;
      const newSessionTime = sessionTime - 1;
      setSecondsRemaining(newSecondsRemaining);
      setSessionTime(newSessionTime);
    }
  }, [
    setSecondsRemaining, 
    setSessionTime, 
    secondsRemaining, 
    sessionTime, 
    status
  ]);

  const addBreakUpdate = useCallback(() => {
    breakTime <= 59 ? setBreakTime(breakTime + 1) : setBreakTime(60);   
  }, [
    breakTime, 
    setBreakTime
  ]);

  const subtractBreakUpdate = useCallback(() => {
    breakTime > 1 ? setBreakTime(breakTime - 1) : setBreakTime(1);
  }, [
    breakTime, 
    setBreakTime
  ]);

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
          addOnClick={addBreakUpdate}
          subtractOnClick={subtractBreakUpdate}
        />
        <TimerControl 
          titleText='Session Length'
          titleId='session-label'
          titleClassName='session-label-style'
          incrementId='session-increment'
          decrementId='session-decrement'
          lengthId='session-length'
          length={sessionTime}
          addOnClick={addSessionUpdate}
          subtractOnClick={subtractSessionUpdate}
        />
        </div>
        <div className="clock-countdown">
          <div className="timer-container">
            <h1 id='timer-label'>{clockPhase}</h1>
            <div id='time-left'>       
              <span>
                  {twoDigits(minutesToDisplay)}:{twoDigits(secondsToDisplay)}
              </span>
            </div>
          </div>
          <div id='buttons' className="clock-countdown-buttons">
            <button id='start_stop' onClick={handleStart}>
              <span className="material-symbols-outlined">
                play_arrow
              </span>
            </button>
            <button id='stop' onClick={handleStop}>
              <span className="material-symbols-outlined">
                stop
              </span>
            </button>
            <button id='reset' onClick={handleReset}>
              <span className="material-symbols-outlined">
                replay
              </span>
            </button>
          </div>
        </div>
        <audio 
            id='beep'
            preload="auto"
            src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
          />
    </div>
  );
};

export default App;
