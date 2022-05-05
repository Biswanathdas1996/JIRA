export const EtherscanBaseAPI = `https://api-rinkeby.etherscan.io/api`;
export const EtherscanAPIKEY = `WCVDU52748WW4F7EKDEDB89HKH41BIA4N2`;
export const IPFSLink = `https://ipfs.infura.io:5001/api/v0`;

export const IpfsViewLink = (fingerprint) =>
  `https://ipfs.infura.io/ipfs/${fingerprint}`;

export const ViewTransctionDetailsLink = (transactionHash) =>
  `https://rinkeby.etherscan.io/tx/${transactionHash}`;
