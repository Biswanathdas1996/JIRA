import { _transction } from "../CONTRACT-ABI/connect";
import uuid from "uuid/v4";
import { create } from "ipfs-http-client";
import { IPFSLink, IpfsViewLink } from "../config";
import { decode } from "js-base64";

const client = create(IPFSLink);
// ----------------------------
// function waitForElm(selector) {
//   return new Promise((resolve) => {
//     if (document.querySelector(selector)) {
//       return resolve(document.querySelector(selector));
//     }

//     const observer = new MutationObserver((mutations) => {
//       if (document.querySelector(selector)) {
//         resolve(document.querySelector(selector));
//         observer.disconnect();
//       }
//     });

//     observer.observe(document.body, {
//       childList: true,
//       subtree: true,
//     });
//   });
// }
///--------------------------

export const createTicket = async (history) => {
  history("/create-ticket");
  const id = uuid();
  const saveHtmlDescription = await client.add(
    `<p>Please enter a description</p>`
  );
  const saveHtmlAC = await client.add(`<p>Please enter a AC</p>`);
  const metaData = {
    id: id,
    name: "Dummy titile (Please update)",
    type: "story",
    priority: "high",
    storypoint: 2,
    description: IpfsViewLink(saveHtmlDescription.path),
    AC: IpfsViewLink(saveHtmlAC.path),
    linkedStories: JSON.stringify([]),
  };
  const resultsSaveMetaData = await client.add(JSON.stringify(metaData));
  const trackingData = JSON.stringify([
    {
      time: new Date(),
      status: `Story created with voice command`,
      updatedBy:
        localStorage.getItem("uid") && decode(localStorage.getItem("uid")),
    },
  ]);
  const responsedata = _transction(
    "createTicket",
    "",
    id,
    IpfsViewLink(resultsSaveMetaData.path),
    localStorage.getItem("uid"),
    trackingData
  );

  responsedata.then((data) => {
    console.log("--------->", data?.blockHash);
    if (data?.blockHash) {
      history(`/ticket/${id}`);
    }
  });

  return;
};
