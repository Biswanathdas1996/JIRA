import { _transction } from "../CONTRACT-ABI/connect";
import uuid from "uuid/v4";
import { create } from "ipfs-http-client";
import { IPFSLink, IpfsViewLink } from "../config";
import { decode } from "js-base64";
import swal from "sweetalert";

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

export const actionFunctions = (history, expression) => {
  switch (expression) {
    case "create-story":
      return createDynamicTicket(history, `story`, `medium`);
    case "create-bug":
      return createDynamicTicket(history, `bug`, `high`);
    case "log-out":
      return logout();
    case "create-sprint":
      return createSprint();

    default:
  }
};
const logout = () => {
  localStorage.clear();
  window.location.href = `/login`;
};

const createSprint = async () => {
  swal({
    title: `Please wait!`,
    text: `Creating a sprint, please update the details as needed.`,
    icon: "https://www.boasnotas.com/img/loading2.gif",
    dangerMode: true,
    button: false,
  });
  const responseData = _transction("createSprint", "New sprint", "", "", "");
  responseData.then((data) => {
    if (data?.blockHash) {
      swal.close();
      swal({
        title: "Success!",
        text: `Sprint is created successfully`,
        icon: "success",
        button: false,
        dangerMode: true,
      }).then(() => {});
      setTimeout(() => {
        window.location.href = `/sprints`;
      }, 1000);
    }
  });
};

const createDynamicTicket = async (history, type, priority) => {
  history("/create-ticket");

  swal({
    title: `Please wait!`,
    text: `Creating a ${type}, please update the details as needed.`,
    icon: "https://www.boasnotas.com/img/loading2.gif",
    dangerMode: true,
    button: false,
  });

  const id = uuid();
  const saveHtmlDescription = await client.add(
    `<p>Please enter a description</p>`
  );
  const saveHtmlAC = await client.add(`<p>Please enter a AC</p>`);
  const metaData = {
    id: id,
    name: "Dummy titile (Please update)",
    type: type,
    priority: priority,
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
      swal.close();

      swal({
        title: "Success!",
        text: `${type} is created successfully`,
        icon: "success",
        button: false,
        dangerMode: true,
      }).then(() => {});
      setTimeout(() => {
        window.location.href = `/ticket/${id}`;
      }, 1000);
    }
  });

  return;
};
