import React, { useCallback, useEffect, useRef, useState } from "react";

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


const STATUS = {
  started: "Started",
  stopped: "Stopped"
};

const CLOCKPHASES = {
  break: "break",
  session: "session"
};

const initialTime = 1500;

const App = () => {
  const [secondsRemaining, setSecondsRemaining] = useState(initialTime);
  const [status, setStatus] = useState(STATUS.stopped)
  const [breakTime, setBreakTime] = useState(5);
  const [sessionTime, setSessionTime] = useState(25);
  const [clockPhase, setClockPhase] = useState(CLOCKPHASES.session);

    //try useMemo on these 3 consts --- in separate useMemos
  const secondsToDisplay = secondsRemaining % 60;
  const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60;
  const minutesToDisplay = minutesRemaining % 61;


  const handleStart = () => {
    if (status === STATUS.stopped) {
      setStatus(STATUS.started);
      if (minutesRemaining === 0 && secondsRemaining === 0) {
        setClockPhase(CLOCKPHASES.session);
        setSecondsRemaining(sessionTime * 60);
      }
    } 
    if (status !== STATUS.stopped) {
      setStatus(STATUS.stopped);
    }
  };

  //make handle functions into useCallback hooks --- all of them in separate useCallbacks... makes them not get rebuilt every update
  const handleStop = useCallback(() => {
    setStatus(STATUS.stopped);
  }, [setStatus]);

  const handleReset = () => {
    setStatus(STATUS.stopped);
    setBreakTime(5);
    setSessionTime(25);
    setSecondsRemaining(initialTime);
    setClockPhase(CLOCKPHASES.session);
  };

  useInterval(() => {
    if (secondsRemaining >= 0) {
      setSecondsRemaining(secondsRemaining - 1);
    } else {
      setStatus(STATUS.stopped);
    }
  },
    status === STATUS.started ? 100 : null
  )

  //all of these in useCallbacks
  const addSessionUpdate = () => {
    console.log(status)
    // setStatus(STATUS.stopped)
    if (status === 'Stopped' && sessionTime <= 59) {
      setSecondsRemaining(secondsRemaining + 60);
      console.log(secondsRemaining)
      setSessionTime(sessionTime + 1);
    }
    if (status === 'Started') {
      setSecondsRemaining(secondsRemaining);
      setSessionTime(sessionTime + 0);
    }
  }

  const subtractSessionUpdate = () => {
    if (status === 'Stopped' && secondsRemaining > 0 && sessionTime > 1) {
      setSecondsRemaining(secondsRemaining - 60);
      setSessionTime(sessionTime - 1)
    }
    if (status === 'Started') {
      setSecondsRemaining(secondsRemaining);
      setSessionTime(sessionTime + 0);
    }
  }

  const addBreakUpdate = () => {
    breakTime <= 59 ? setBreakTime(breakTime + 1) : setBreakTime(60)    
  }

  const subtractBreakUpdate = () => {
    breakTime > 1 ? setBreakTime(breakTime - 1) : setBreakTime(1);
  }

  useEffect(() => {
    console.log(clockPhase)
    if (secondsRemaining === 0 && minutesRemaining === 0) {
      if (clockPhase === CLOCKPHASES.break) {
        setStatus(STATUS.stopped)
      } else {
        setSecondsRemaining(breakTime * 60);
        setClockPhase(CLOCKPHASES.break);
      }
    }
  }, [secondsRemaining, minutesRemaining, setStatus, clockPhase, setSecondsRemaining, breakTime]);

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
          <div id='timer-label'>
            <h1>Current Session</h1>
            <div id='time-left'>       
              {/* {(minutesToDisplay > 0 || secondsToDisplay >= 0) ? (
                <span>
                  {twoDigits(minutesToDisplay)}:{twoDigits(secondsToDisplay)}
                </span>
              ) : (
                <span>
                  {twoDigits(setSecondsRemaining(breakTime * 60))}
                </span>
              )} */}
              <span>
                  {twoDigits(minutesToDisplay)}:{twoDigits(secondsToDisplay)}
              </span>

              {/* {(twoDigits(minutesToDisplay) > 0 || twoDigits(secondsToDisplay) >= 0) ? (
                <span>
                  {twoDigits(minutesToDisplay)}:{twoDigits(secondsToDisplay)}
                </span>
              ) : (
              (twoDigits(minutesToDisplay) >= 0 || twoDigits(secondsToDisplay) >= 0) ? (
                <span>
                  {twoDigits(setSecondsRemaining(breakTime * 60))}
                </span>
              ) : (
                <span>
                  00:00
                </span>
              )
              )} */}

              {/* {(twoDigits(minutesToDisplay) >= 0 || twoDigits(secondsToDisplay) >= 0) ? (
                <span>
                  {twoDigits(minutesToDisplay)}:{twoDigits(secondsToDisplay)}
                </span>
              ) : (
                (twoDigits(minutesToDisplay) === 0 || twoDigits(secondsToDisplay) === 0)
              ) ? (
                <span>
                  {twoDigits(setSecondsRemaining(breakTime * 60))}
                </span>
                ) : (
                  <span>
                    {twoDigits(minutesToDisplay)}:{twoDigits(secondsToDisplay)}
                  </span>
              )} */}
            </div>
          </div>
          <div id='start_stop' className="clock-countdown-buttons">
            <button id='start' onClick={handleStart}>
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
    </div>
  );
}

const useInterval= (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

useEffect(() => {
  const tick = () => {
    savedCallback.current();
  }
  if (delay !== null) {
    let id = setInterval(tick, delay);
    return () => clearInterval(id);
  }
}, [delay]);
}

const twoDigits = (num) => String(num).padStart(2, "0");

export default App;
