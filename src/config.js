export const Network = `goerli`;

export const EtherscanBaseAPI = `https://api-${Network}.etherscan.io/api`;

export const EtherscanAPIKEY = `WCVDU52748WW4F7EKDEDB89HKH41BIA4N2`;

export const IPFSLink = `https://ipfs.infura.io:5001/api/v0`;

export const WalletPrivateKey =
  "8c5948e0dbc4163b176ea8cfb7ca6a3d2e9c52d2d1df7c363fababb8f2eb6f42";

export const InfuraProjectId = `24022fda545f41beb59334bdbaf3ef32`;

export const InfuraNodeURL = `https://${Network}.infura.io/v3/${InfuraProjectId}`;

export const IpfsViewLink = (fingerprint) =>
  `https://ipfs.io/ipfs/${fingerprint}`;

export const ViewTransctionDetailsLink = (transactionHash) =>
  `https://${Network}.etherscan.io/tx/${transactionHash}`;
