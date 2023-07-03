import React from 'react';

/**
 * The client modal section where one can add new clients and see how many accumulated hours 
 * you had a client. These values can be modified when entries are are altered.
 */
class Client extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newClient: ''
    };
    this.handleAddClient = this.handleAddClient.bind(this);
    this.addClientToClients = this.addClientToClients.bind(this);
  }

  handleAddClient(event) {
    this.setState({
      newClient: { client: event.target.value, totalHours: 0 },
    });
  }
  
  addClientToClients() {
    const newClient = this.state.newClient;
    const updatedClients = [...this.props.clients, newClient];
    this.setState({ newClient: '' }, () => {
      this.props.updateClientsCallback(updatedClients);
    });
  }

  render() {
    const { clients } = this.props;
    return (
      <div className="popup-box">
        <div className="box">
          <span className="close-icon" onClick={this.props.handleClose}>
            x
          </span>
          <b>My Clients:</b>
          <table className="styled-table client-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Total Hours</th>
              </tr>
            </thead>
            <tbody className="entries-table-body">
              {clients.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.client}</td>
                  <td>{entry.totalHours}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {this.props.content}
          <div className="client-add">
            <b>Add New Client:</b>
            <input
              type="text"
              className="add-client-input"
              name="client-name"
              onChange={this.handleAddClient}></input>
            <button
              className="clock-button-style clock-button-up-down"
              onClick={this.addClientToClients}>
              Add Client
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Client;
