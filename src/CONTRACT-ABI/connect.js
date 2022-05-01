import _ from "lodash";
import Web3 from "web3";
import ABI from "./NFT.json";
import ADDRESS from "./Address.json";

window?.ethereum?.request({
  method: "eth_requestAccounts",
});

const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(ABI, ADDRESS);

export const _transction = async (service, ...props) => {
  const callService = _.get(contract, ["methods", service]);
  const accounts = await web3.eth.getAccounts();
  const responseData = await callService(...props)
    .send({
      from: accounts[0],
      value: 0,
    })
    .then((data) => data)
    .catch((error) => {
      const errorData = { error };
      return { error: errorData.error };
    });
  return responseData;
};

export const _paid_transction = async (cost, service, ...props) => {
  const callService = _.get(contract, ["methods", service]);
  const accounts = await web3.eth.getAccounts();
  const responseData = await callService(...props)
    .send({
      from: accounts[0],
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
  const accounts = await web3.eth.getAccounts();
  return accounts[0];
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
