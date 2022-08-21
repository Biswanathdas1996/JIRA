// import { _fetch, _transction } from "../../CONTRACT-ABI/connect";
// import _ from "lodash";
// import { IPFSLink, IpfsViewLink } from "../../config";

// const client = create(IPFSLink);

// export const transferTicket = async ({
//   receiver,
//   tickets,
//   tokenId,
//   transfredTicket,
// }) => {
//   const sender = tickets?.owner;

//   let updatedSenderAbi;
//   let updatedReceiverAbi;

//   const getSenderCurrentABI = await _fetch("users", sender);

//   await fetch(getSenderCurrentABI?.boardData)
//     .then((response) => response.json())
//     .then(async (senderData) => {
//       for (let i = 1; i <= 5; i++) {
//         if (senderData[i].items?.length > 0) {
//           if (senderData[i].items.find((item) => item.id === tokenId)) {
//             const result = senderData[i].items.filter(
//               (item) => item.id !== tokenId
//             );
//             senderData[i].items = result;
//           }
//         }
//       }

//       const resultsSaveMetaData = await client.add(JSON.stringify(senderData));
//       updatedSenderAbi = IpfsViewLink(resultsSaveMetaData.path);
//     });
//   //////////////////////////////////////////////////////////////////////////////////////////
//   const getRecieverrCurrentABI = await _fetch("users", receiver);

//   if (getRecieverrCurrentABI?.boardData) {
//     await fetch(getRecieverrCurrentABI?.boardData)
//       .then((response) => response.json())
//       .then(async (receiverData) => {
//         const updatedColumn = receiverData[1].items;
//         receiverData[1].items = [...updatedColumn, transfredTicket];

//         const resultsSaveMetaData = await client.add(
//           JSON.stringify(receiverData)
//         );
//         updatedReceiverAbi = IpfsViewLink(resultsSaveMetaData.path);
//       });
//   }

//   // return;
//   //   const finalResponse = await _transction(
//   //     "transferTicket",
//   //     sender,
//   //     receiver,
//   //     updatedSenderAbi,
//   //     updatedReceiverAbi,
//   //     transfredTicket.index
//   //   );
// };
