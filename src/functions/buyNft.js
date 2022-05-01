import { _fetch, _account, _paid_transction } from "../CONTRACT-ABI/connect";

export const buyNft = async (tokenId) => {
  try {
    const price = await _fetch("getNftPrice", tokenId);
    const owner = await _fetch("ownerOf", tokenId);
    const account = await _account();
    const responseData = await _paid_transction(
      Number(price),
      "buyNft",
      owner,
      account,
      Number(tokenId)
    );
    return responseData;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};
