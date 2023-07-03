import React from 'react';

/**
 * The Time component that accumulates time for a particular session.
 */
class Time extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            seconds: 0,
            formattedTime: '00:00:00'
        }
        this.updateTimer = this.updateTimer.bind(this);
        this.subTime = this.subTime.bind(this);
        this.addTime = this.addTime.bind(this);
        this.intervalID = -1;
    }

    getFormattedElapsed() {
        const hours = Math.floor(this.state.seconds / 3600);
        const minutes = Math.floor((this.state.seconds % 3600) / 60);
        const secondsRemaining = this.state.seconds % 60;
    

        const formattedTime = 
          (hours < 10 ? "0" + hours : hours) + ":" + 
          (minutes < 10 ? "0" + minutes : minutes) + ":" + 
          (secondsRemaining < 10 ? "0" + secondsRemaining : secondsRemaining);
    
        return formattedTime;
    }

    updateTimer() {
      if (this.props.started) {
        let newTime = this.getFormattedElapsed();
        let updated_seconds = this.state.seconds + 1;
        this.setState({ seconds: updated_seconds, formattedTime: newTime });
      } else {
        clearInterval(this.intervalID);
      }
    }
      
    componentDidUpdate(prevProps) {
      if (prevProps.started !== this.props.started) {
        if (this.props.started) {
          this.intervalID = setInterval(() => this.updateTimer(), 1000);
        } else {
          clearInterval(this.intervalID);
          this.props.timeDiffCallback(this.state.formattedTime);
          this.setState({ seconds: 0, formattedTime: '00:00:00' });
        }
      }
    }
      
    componentWillUnmount() {
      clearInterval(this.intervalID);
    }


    addTime() {
      // Add 5 minutes
      let newSeconds = this.state.seconds + 300
      this.setState({seconds: newSeconds})
    }

    subTime() {
      // removes 5 minutes if negative then make 0
      let newSeconds = this.state.seconds - 300
      if (newSeconds < 0) {
        this.setState({seconds: 0})
      }
      else {
        this.setState({seconds: newSeconds})
      }
    }

    render () {
      return (
        <>
          <button 
              className="counter-ele clock-button-style clock-button-up-down" 
              id="clock-button-start-stop" 
              value="start"
              onClick={this.addTime}>+5 Minutes</button>
          <button 
              className="counter-ele clock-button-style clock-button-up-down" 
              id="clock-button-start-stop" 
              value="start"
              onClick={this.subTime}>-5 Minutes</button>
          <div className="counter-ele counter">
            <b className="timer-ele">Start:</b>
            <p className="timer-ele" id="start-time">{this.props.startTime}</p>
            <p className="timer-ele" id="timer">{this.state.formattedTime}</p>
          </div>
        </>

      );
    }
    
}



export default Time;