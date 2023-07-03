import React from 'react'
import Time from './Time';

/**
 * The Form component where you configure the client you are meeting with and the project you are 
 * working on together, this will then be configured as an entry in Entries 
 */
class Form extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            started: false,
            editing: false,
            startTime: '00:00:00',
            endTime: '00:00:00',
            client: '',
            project: '',
            timeDiff: '00:00:00'
        };
        this.updateForm = this.updateForm.bind(this);
        this.handleClientChange = this.handleClientChange.bind(this);
        this.handleProjectChange = this.handleProjectChange.bind(this);
    }

    calculateEndTime(startTime, timeDiff) {
        const [hours, minutes, seconds, period] = startTime.split(/:|\s/);
        let startHour = parseInt(hours, 10);
        if (period === 'PM' && startHour !== 12) {
          startHour += 12;
        }
        let startTimeInMs = (startHour * 60 * 60 * 1000) + 
            (parseInt(minutes, 10) * 60 * 1000) + (parseInt(seconds, 10) * 1000);
      
        let timeDiffInMs = (parseInt(timeDiff.split(':')[0]) * 60 * 60 * 1000) +
          (parseInt(timeDiff.split(':')[1]) * 60 * 1000) +
          (parseInt(timeDiff.split(':')[2]) * 1000);
      
        let endTimeInMs = startTimeInMs + timeDiffInMs;
        let endTime = new Date(endTimeInMs).toLocaleTimeString('en-US', { hour12: true, timeZone: "UTC"});
        return endTime;
    }

    calculateCurrentTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();
        let amOrPm = hours >= 12 ? 'PM' : 'AM';
    
        hours = hours % 12;
        hours = hours ? hours : 12;
    
        var time = 
            (hours < 10 ? '0' + hours : hours) + ':' +
            (minutes < 10 ? '0' + minutes : minutes) + ':' +
            (seconds < 10 ? '0' + seconds : seconds) + ' ' +
            amOrPm;
        return time
    }

    handleClientChange(e) {
        this.setState({ client: e.target.value });
    }
    
    handleProjectChange(event) {
        this.setState({ project: event.target.value });
    }

    callbackTimeDiff = (time) => {
        let finalTime = this.calculateEndTime(this.state.startTime, time)
        this.setState({endTime: finalTime, timeDiff: time, timeChange: 0}, () => {
            this.props.entriesCallback(
                this.state.client, 
                this.state.project, 
                this.state.startTime, 
                this.state.endTime, 
                this.state.timeDiff);
        });
    }
    
    updateForm() {
        let currentTime = this.calculateCurrentTime()
        if(this.state.started === false) {
            let button = document.querySelector(".counter-ele.clock-button-start");
            button.innerHTML = "Stop";
            button.classList.remove("clock-button-start");
            button.classList.add("clock-button-stop");
            if(this.props.clients.length > 0 && this.state.client !== '') {
                this.setState({started: true, startTime: currentTime, endTime: '00:00:00', timeDiff: '00:00:00'});
            } else {
                this.setState({started: true, startTime: currentTime, endTime: '00:00:00', timeDiff: '00:00:00', client: this.props.clients[0].client});
            }
        }
        else {
            let button = document.querySelector(".counter-ele.clock-button-stop");
            button.innerHTML = "Start";
            button.classList.remove("clock-button-stop");
            button.classList.add("clock-button-start");
            this.setState({started: false});
        }
    }

    render() {
        return(
            <div className="input-counter-header">
                <label className="counter-ele label-counter"><b>Client: </b></label>
                <select className="counter-ele input-counter" onChange={(e) => this.handleClientChange(e)}>
                    {this.props.clients.map((entry, index) => (
                        <option key={index} value={entry.client}>{entry.client}</option>
                    ))}
                </select>
                <label className="counter-ele label-counter"><b>Project: </b></label>
                <input 
                    className="counter-ele input-counter" 
                    type="text" 
                    id="pname" 
                    name="pname" 
                    placeholder="Enter Project" 
                    value={this.state.project}
                    onChange={this.handleProjectChange}
                />
                <button 
                    className="counter-ele clock-button-style clock-button-start" 
                    id="clock-button-start-stop" 
                    value="start" 
                    onClick={this.updateForm}>Start</button>

                <Time 
                    startTime={this.state.startTime}
                    started={this.state.started} 
                    timeDiffCallback={this.callbackTimeDiff}/>
            </div>
        );
    }
    
}

export default Form;