import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";
import { encode } from "js-base64";

const client = new Web3Storage({
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDEzMkRhNjE2N2U0OTY2Y2M2ODBlMjNlNzdjMmM5NjI2YWZFQjkyNzMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjAxOTIxNjI3MDEsIm5hbWUiOiJ0ZXN0In0.nrWyG-RPCty28GQLPOfjCacYoOoURarCyo6nh3t0QCY",
});

const uploadToDatabase = (data) => {
  var formdata = new FormData();
  formdata.append("data", data);

  var requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow",
  };

  return fetch("https://sosal.in/endpoints/ipfs/add-Ipfs.php", requestOptions)
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => error);
};

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
  const fileId = await uploadToDatabase(JSON.stringify(metaData));
  console.log(fileId);

  return {
    path: fileId,
    link: `https://sosal.in/endpoints/ipfs/fetch-ipfs.php?id=${fileId}`,
  };
};
