import { EtherscanBaseAPI, EtherscanAPIKEY } from "../config";
export function fetchWallatTransction(account) {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  return fetch(
    `${EtherscanBaseAPI}?module=account&action=txlist&address=${account}&sort=desc&page=1&offset=10&apikey=${EtherscanAPIKEY}`,
    requestOptions
  );
}
