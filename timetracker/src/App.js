import './App.css';
import React from 'react';
import Form from './Form';
import Entries from './Entries';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      entries: [],
      clients: []
    }
  }

  sumTimes(hours1, time2) {
    const [hours2, minutes2, seconds2] = time2.split(':');
    const totalHours2 = parseInt(hours2) + parseInt(minutes2) / 60 + parseInt(seconds2) / 3600;
    const totalHours = parseFloat(hours1) + totalHours2
    const formattedTime = totalHours.toFixed(2);
    return formattedTime
  }
  
  callbackEntry = (client, project, start, end, diff) => {
    const { clients } = this.state;
    const { entries } = this.state;
    const index = clients.findIndex(c => c.client === client);
    // Adds to clients state updated hours for client
    if (index >= 0) {
      const newClients = [...clients];
      newClients[index] = {
        ...clients[index],
        totalHours: this.sumTimes(newClients[index].totalHours, diff)
      };
      this.setState({ clients: newClients});
    }
    // Adds to entries state a new entry
    const newEntries = [...entries];
    const newEntry = {
      client: client,
      project: project,
      startTime: start,
      endTime: end,
      timeDiff: diff
    };
    newEntries.push(newEntry);
    this.setState({ entries: newEntries });
  }
  

  clientsAppCallback = (allClients) => {
    const newClientsAdded = this.state.clients.reduce((acc, obj) => {
      const existingObj = acc.find(item => item.client === obj.client);
      if (!existingObj) {
        acc.push(obj);
      }
      return acc;
    }, allClients);
    this.setState({clients: newClientsAdded, project: ''});
  }

  entriesUpdateCallback = (updatedEntries) => {
    const newEntries = updatedEntries.reduce((acc, obj) => {
      const existingObjIndex = acc.findIndex(item => (item.client === obj.client && item.startTime === obj.startTime));
      if (existingObjIndex !== -1) {
        acc[existingObjIndex] = obj;
      } else {
        acc.push(obj);
      }
      return acc;
    }, []);
    this.setState({entries: newEntries});
  }
  

  render() {
    return (
      <div className="client-1">
        <Form entriesCallback={this.callbackEntry} clients={this.state.clients}/>
        <Entries 
          clients={this.state.clients}
          entries={this.state.entries}
          clientsCallback={this.clientsAppCallback}
          entriesCallback={this.entriesUpdateCallback}/>
      </div>
    );
  }
}

export default App;