import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Web3Button } from '@web3modal/react';
import { useAccount, useBalance, useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import { BigNumber, ethers } from 'ethers';
import { formatEther } from 'ethers/lib/utils.js';

const abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdrawal","type":"event"},{"inputs":[],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];
function App() {
  const [count, setCount] = useState(0);
  const account = useAccount();

  const balance = useBalance(
    {}
  );

  // Base URL em WEB2 , aqui pegamos o endereço do contrato
  const {data: getBalanceContract} = useContractRead({

    address: "0xD358434cBbDB230AA5d4b5C2211d2a2040D2929d",
    abi: abi, //Se for utilizar apenas um método do ABI, devo pegar a parte dessa função do ABI e colocar diretamente no UsecONTRACTRead
    functionName: 'getBalance',
    watch: true,
    overrides: {
      from: account ? account.address : undefined
    }
    // Sempre atualiza pro usuário ( Watch )

  })

  // use Preapre Contract Write pega erros antes do cacra realizar a trnsação
  const {config, error} = usePrepareContractWrite({
    address: '0xD358434cBbDB230AA5d4b5C2211d2a2040D2929d',
    abi: abi,
    functionName: 'deposit',
    overrides: {
      from: account ? account.address : undefined,
      value: ethers.utils.parseEther(count.toString())
      // Tem que converter o que o usuário digitou em BigNumber() ( ParseETher())
    }
  })

  const {config: configWithdraw, } = usePrepareContractWrite({
    address: '0xD358434cBbDB230AA5d4b5C2211d2a2040D2929d',
    abi: abi,
    functionName: 'deposit',
    overrides: {
      from: account ? account.address : undefined,
      value: ethers.utils.parseEther(count.toString())
      // Tem que converter o que o usuário digitou em BigNumber() ( ParseETher())
    }
  })

  //Write interagir com o contrato
  const {write} = useContractWrite(config);



  console.log(balance.data);

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1></h1> 
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <br/>
      <p>{formatEther(getBalanceContract?.toString() ?? BigNumber.from(0))}</p>
      <br />
      <input type={'number'} value={count} onChange={(e) => setCount(Number(e.target.value))}/> 
      <Web3Button/>
      <button
        onClick={() => {
          write?.();
        }}
      >
        Depositar ETH
      </button>

      {/* <button
        onClick={() => {
          writeWithdraw?.();
        }}
      >
        Depositar ETH
      </button> */}
    </div>

  );
}

export default App;
