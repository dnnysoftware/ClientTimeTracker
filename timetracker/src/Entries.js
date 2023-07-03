import React from 'react';
import Client from './Client';

class Entries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMore: false,
      isOpen: false,
      editIndex: null,
      isEditing: false
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      if (this.props.entries.length > 4) {
        if (document.querySelector(".show-more") === null && !this.state.showMore) {
          this.setState({ showMore: true });
        }
      }
    }
  }
  
  allClientsCallback = (allClients) => {
      const newClientsAdded = this.props.clients.reduce((acc, obj) => {
        const existingObj = acc.find(item => item.client === obj.client);
        if (!existingObj) {
          acc.push(obj);
        }
        return acc;
      }, allClients);
      this.props.clientsCallback(newClientsAdded);
  }

  togglePopup = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  handleEdit(index) {
    this.setState({ editIndex: index, isEditing: true });
  }
  
  handleSave(index) {
    this.setState({ editIndex: null, isEditing: false });
  }

  handleTyping(e, index) {
    const newEntries = [...this.props.entries];
    newEntries[index] = {
      ...newEntries[index],
      [e.target.name]: e.target.value
    };
    this.props.entriesCallback(newEntries)
  }


  handleDelete(index) {
    const newEntries = [...this.props.entries];
    const removed = newEntries[index];
    newEntries.splice(index, 1);
    this.props.entriesCallback(newEntries);
    this.subtractHoursClient(removed.client, removed.timeDiff);
  }

  subTimes(hours1, time2) {
    const [hours2, minutes2, seconds2] = time2.split(':');
    const totalHours2 = parseInt(hours2) + parseInt(minutes2) / 60 + parseInt(seconds2) / 3600;
    const totalHours = parseFloat(hours1) - totalHours2
    const formattedTime = totalHours.toFixed(2);
    if(formattedTime < 0) {
      return 0;
    }
    return formattedTime
  }

  subtractHoursClient(client, timeDiff) {
    const index = this.props.clients.findIndex(c => c.client === client);
    if (index >= 0) {
      const newClients = [...this.props.clients];
      const totalHours = this.subTimes(newClients[index].totalHours, timeDiff);
      newClients[index] = {
        ...newClients[index],
        totalHours: totalHours
      };
      this.props.clientsCallback(newClients);
    }
  }
  

  render() {
    return (
      <>
        <div className="entries">
          <button 
            className='entry-area clock-button-style clock-button-up-down'
            onClick={this.togglePopup}>Clients</button>
          {this.state.isOpen && <Client 
            handleClose={this.togglePopup} 
            updateClientsCallback={this.allClientsCallback} 
            clients={this.props.clients}/>}
          <div>
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Project</th>
                  <th>Start Time</th>
                  <th>Stop Time</th>
                  <th>Time Elapsed</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody className="entries-table-body">
                {this.props.entries.slice(0, !this.state.showMore ? this.props.entries.length : 5).map((entry, index) => (
                <tr key={index}>
                  <td>{index === this.state.editIndex ? 
                    <input 
                      type="text" 
                      className="input-entry" 
                      name="client"
                      value={entry.client} 
                      onChange={(e) => this.handleTyping(e, index)} /> : entry.client}
                  </td>
                  <td>{index === this.state.editIndex ? 
                    <input 
                      type="text" 
                      className="input-entry" 
                      name="project"
                      value={entry.project} 
                      onChange={(e) => this.handleTyping(e, index)}/> : entry.project}
                  </td>
                  <td>{index === this.state.editIndex ? 
                    <input 
                      type="text" 
                      className="input-entry" 
                      name="startTime"
                      value={entry.startTime} 
                      onChange={(e) => this.handleTyping(e, index)}/> : entry.startTime}
                  </td>
                  <td>{index === this.state.editIndex ? 
                    <input 
                      type="text" 
                      className="input-entry" 
                      name="endTime"
                      value={entry.endTime} 
                      onChange={(e) => this.handleTyping(e, index)}/> : entry.endTime}
                  </td>
                  <td>{index === this.state.editIndex ? 
                    <input 
                      type="text" 
                      className="input-entry" 
                      name="timeDiff"
                      value={entry.timeDiff} 
                      onChange={(e) => this.handleTyping(e, index)}/> : entry.timeDiff}
                  </td>
                  <td>
                    {index === this.state.editIndex ? (
                      <button className="clock-button-up-down btn-entry" onClick={() => this.handleSave(index)}>Save</button>
                    ) : (
                      <button className="clock-button-up-down btn-entry" onClick={() => this.handleEdit(index)}>Edit</button>
                    )}
                  </td>
                  <td>
                    <button className="clock-button-up-down btn-entry" onClick={() => this.handleDelete(index)}>Delete</button>
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
            <div>
              {this.state.showMore && (
                <button 
                  className="show-more clock-button-style clock-button-up-down" 
                  onClick={() => this.setState({ showMore: false })}>
                  Show More
                </button>
              )}
                {!this.state.showMore && this.props.entries.length > 5 && (
                <button 
                  className="show-more clock-button-style clock-button-up-down" 
                  onClick={() => this.setState({ showMore: true })}>
                  Show Less
                </button>
              )}
            </div>
          </div>
        </div>

      </>
    );
  }
}

export default Entries;
