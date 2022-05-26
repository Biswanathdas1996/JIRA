export const Network = `rinkeby`;

export const EtherscanBaseAPI = `https://api-${Network}.etherscan.io/api`;

export const EtherscanAPIKEY = `WCVDU52748WW4F7EKDEDB89HKH41BIA4N2`;

export const IPFSLink = `https://ipfs.infura.io:5001/api/v0`;

// export const WalletPrivateKey =
//   "33e8389993eea0488d813b34ee8d8d84f74f204c17b95896e9380afc6a514dc7";
export const WalletPrivateKey =
  "82e4fb5555837b975e4402a02c2fbe230ae7d4d61574ee00ed2b1ff79be84195";

export const InfuraProjectId = `24022fda545f41beb59334bdbaf3ef32`;

// export const InfuraNodeURL = `https://${Network}.infura.io/v3/${InfuraProjectId}`;
export const InfuraNodeURL = `http://192.168.0.106:7545/`;

export const IpfsViewLink = (fingerprint) =>
  `https://ipfs.infura.io/ipfs/${fingerprint}`;

export const ViewTransctionDetailsLink = (transactionHash) =>
  `https://${Network}.etherscan.io/tx/${transactionHash}`;
