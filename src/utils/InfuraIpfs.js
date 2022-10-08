import { ipfsClient, urlSource, create } from "ipfs-http-client";

const projectId = "2ENJNApS1b4iJpeuqLVJ3R5L8tA";
const projectSecret = "3033c823589d6d88d296f3d9a0094e79";
export const createAnduploadFileToIpfs = async (metaData) => {
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

  const file = await client.add(
    urlSource(
      "https://ipfs.io/ipfs/QmTCparuvt3dub5U3uFocjrqXbGhKoYZmT5Kf6y9tjzhR9?filename=lime_cay.jpg"
    )
  );
  console.log(file);

  return {
    path: file.path,
    link: `https://ipfs.io/ipfs/${file.path}`,
  };
};
