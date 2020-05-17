import React, { useEffect, useState } from 'react';
import EtherWallet from './contracts/EtherWallet.json';
import { getWeb3 } from './utils.js';
//import './App.css';

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [currentAccount, setCurrentAccount] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  

  useEffect(() => {
    const init = async () => {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();

    const networkId = await web3.eth.net.getId();
    const deployedNetwork = EtherWallet.networks[networkId];
    const contract = new web3.eth.Contract(
      EtherWallet.abi,
      deployedNetwork && deployedNetwork.address,
    );
  
    setWeb3(web3);
    setAccounts(accounts);
    setContract(contract);
  }
  init();
    window.ethereum.on('accountsChanged', accounts => {
      setAccounts(accounts);
    });
}, []);

  useEffect(() => {
    if(typeof contract !== 'undefined' && typeof web3 !== 'undefined') {
      updateBalance();
    }
  }, [accounts, contract, web3]);

  async function updateBalance() {
    const balance = await contract.methods.balanceOf().call();
   setBalance(balance);
  };

  async function deposit(e) {
    e.preventDefault();
    await contract.methods.deposit().send({
      from: accounts[0], 
      value: e.target.elements[0].value
    });
    await updateBalance();
  }

  async function send(e) {
    e.preventDefault();
    const address = e.target.elements[0].value;
    const amount =  e.target.elements[1].value;
    await contract.methods.send(address, amount).send({
      from: accounts[0]
    });
    await updateBalance();
  }

  
    if (!web3) {
      return <div>Loading...</div>;
    }

      ///const { balance } = this.state;

     return (
      <div>
        <h1>EtherWallet</h1>

        <div>
            <form onSubmit={e => deposit(e)} >
              <div>
                <label><h2>Deposit</h2></label>
                <input  type="number"  placeholder="enter amount" />
                <input type="submit" value ='Submit'/>              
              </div>
              
            </form>
        </div>

        

        <div>
            <form onSubmit={e => send(e)}>
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

export default App;
  