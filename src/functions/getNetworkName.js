export const getNetworkName = (networkId) => {
  switch (networkId) {
    case 1:
      return "mainnet";

    case 2:
      return "morden";

    case 3:
      return "ropsten";

    case 4:
      return "rinkeby";

    case 137:
      return "Matic Mainnet";

    case 80001:
      return "Matic Mumbai Testnet";

    default:
      return "Unknown";
  }
};
