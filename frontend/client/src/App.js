import React, { Component } from 'react';
import EtherWallet from './contracts/EtherWallet.json';
import { getWeb3 } from './utils.js';
//import './App.css';

class App extends Component {
  state = {
    web3: undefined,
    accounts: [],
    currentAccount: undefined,
    contract: undefined,
    balance: undefined
  }

  async componentDidMount() {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();

    // const networkId = await web3.eth.net.getId();
    // const deployedNetwork = EtherWallet.networks[networkId];
    // const contract = new web3.eth.Contract(
    //   EtherWallet.abi,
    //   deployedNetwork && deployedNetwork.address,
    // );
    const deploymentKey = Object.keys(EtherWallet.networks)[0];
  const contract = new web3.eth.Contract(
    EtherWallet.abi,
    EtherWallet
      .networks[deploymentKey]
      .address
  );


    this.setState({ web3, accounts, contract });
  };

  async updateBalance() {
    const { contract } = this.state;
    const balance = await contract.methods.balanceOf().call();
    this.setState({ balance });
  };

  async deposit(e) {
    e.preventDefault();
    const { contract, accounts } = this.state;
    await contract.methods.deposit().send({
      from: accounts[0], 
      value: e.target.elements[0].value
    });
    this.updateBalance();
  }

  async send(e) {
    e.preventDefault();
    const { contract, accounts } = this.state;
    await contract.methods.send(e.target.elements[0].value, e.target.elements[1].value).send({
      from: accounts[0]
    });
    this.updateBalance();
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading...</div>;
    }

      const { balance } = this.state;

     return (
      <div>
        <h1>EtherWallet</h1>

        <div>
            <form onSubmit={e => this.deposit(e)} >
              <div>
                <label><h2>Deposit</h2></label>
                <input  type="number"  placeholder="enter amount" />
                <input type="submit" value ='Submit'/>              
              </div>
              
            </form>
        </div>

        

        <div>
            <form onSubmit={e => this.send(e)}>
              <div>
                <label><h2>Send</h2></label> 
                <input type=""  placeholder="enter address" />
                <input type="number"  placeholder="enter amount" />
                <input type="submit" value ='Submit'/></div>
            </form>
        </div>

        <div>
             <p><h3>Balance: <b>{balance}</b> wei </h3></p><br/>
        </div>

      </div>
    );
  }
}

export default App;
  