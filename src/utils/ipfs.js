import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";

const client = new Web3Storage({
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDEzMkRhNjE2N2U0OTY2Y2M2ODBlMjNlNzdjMmM5NjI2YWZFQjkyNzMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjAxOTIxNjI3MDEsIm5hbWUiOiJ0ZXN0In0.nrWyG-RPCty28GQLPOfjCacYoOoURarCyo6nh3t0QCY",
});

export const uploadFileToIpfs = async (file) => {
  const fileName = file[0].name;
  const results = await client.put(file, {});

  return {
    path: results,
    name: fileName,
    link: `https://${results}.ipfs.dweb.link/${fileName}`,
  };
};

export const createAnduploadFileToIpfs = async (metaData) => {
  const blob = new Blob([JSON.stringify(metaData)], {
    type: "application/json",
  });

  const files = [
    new File(["contents-of-file-1"], "plain-utf8.txt"),
    new File([blob], "ipfs.json"),
  ];

  const resultsSaveMetaData = await client.put(files, {});

  return {
    path: resultsSaveMetaData,
    link: `https://${resultsSaveMetaData}.ipfs.dweb.link/ipfs.json`,
  };
};

export const getIpfsUrI = (fingerprint) => {
  return `https://ipfs.infura.io/ipfs/${fingerprint}`;
};
