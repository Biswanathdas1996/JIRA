import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";
import { ipfsClient, urlSource, create } from "ipfs-http-client";

const projectId = "2ENJNApS1b4iJpeuqLVJ3R5L8tA";
const projectSecret = "3033c823589d6d88d296f3d9a0094e79";

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

  const files = new File([blob], "ipfs.json");

  const auth =
    "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

  const client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  });

  const file = await client.add(files);
  console.log(file);

  return {
    path: file.path,
    link: `https://infura-ipfs.io/ipfs/${file.path}`,
  };
};
