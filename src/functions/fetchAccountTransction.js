import Address from "../CONTRACT-ABI/Address.json";
import { EtherscanBaseAPI, EtherscanAPIKEY } from "../config";
export function frtchAccounttransction() {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  return fetch(
    `${EtherscanBaseAPI}?module=account&action=tokennfttx&contractaddress=${Address}&page=1&offset=10000&sort=asc&apikey=${EtherscanAPIKEY}`,
    requestOptions
  );
}
