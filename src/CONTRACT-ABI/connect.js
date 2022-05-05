import _ from "lodash";
import Web3 from "web3";
import ABI from "./JIRA.json";
import ADDRESS from "./Address.json";

const myPrivateKeyHex =
  "8c5948e0dbc4163b176ea8cfb7ca6a3d2e9c52d2d1df7c363fababb8f2eb6f42";

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://rinkeby.infura.io/v3/24022fda545f41beb59334bdbaf3ef32`
  )
);

const signer = web3.eth.accounts.privateKeyToAccount(myPrivateKeyHex);
web3.eth.accounts.wallet.add(signer);

// const myAccount = web3.eth.accounts.privateKeyToAccount(myPrivateKeyHex);

// Interact with existing, already deployed, smart contract on Ethereum mainnet
const contract = new web3.eth.Contract(ABI, ADDRESS);

console.log(contract);

export const _transction = async (service, ...props) => {
  const callService = _.get(contract, ["methods", service]);

  const tx = callService(...props);

  const responseData = await tx
    .send({
      from: signer.address,
      // gas: await tx.estimateGas(),
      gas: "4700000",
      value: 0,
    })
    // .then((data) => data)
    .once("transactionHash", (txhash) => {
      console.log(`Mining transaction ...`);
      console.log(txhash);
      return txhash;
    })
    .catch((error) => {
      const errorData = { error };
      return { error: errorData.error };
    });
  return responseData;
};

export const _paid_transction = async (cost, service, ...props) => {
  const callService = _.get(contract, ["methods", service]);

  const responseData = await callService(...props)
    .send({
      from: signer.address,
      value: cost,
    })
    .then((data) => data)
    .catch((error) => {
      const errorData = { error };
      return { error: errorData.error };
    });
  return responseData;
};

export const _account = async () => {
  // const accounts = await web3?.eth.accounts._provider.selectedAddress;

  return signer.address;
};

export const _fetch = async (service, ...props) => {
  const callService = _.get(contract, ["methods", service]);
  let data;
  if (props) {
    data = await callService(...props).call();
  } else {
    data = await callService().call();
  }

  return data;
};
