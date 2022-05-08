/* eslint-disable array-callback-return */
import _ from "lodash";

export const filterNewlyCreatedTicketys = (
  alldata,
  oldDataSet,
  activeSprintId
) => {
  let result = [];
  for (let i = 1; i <= 5; i++) {
    const tempData = oldDataSet[i].items;
    if (tempData.length > 0) {
      if (tempData.length === 1) {
        result.push(tempData[0]);
      } else {
        tempData.map((val) => {
          result.push(val);
        });
      }
    }
  }
  const uniqueItem = _.xorBy(alldata, result, "id");

  return uniqueItem;
};

export const sanatizeData = (data, activeSprintId) => {
  for (let i = 1; i <= 5; i++) {
    const tempData = data[i].items;
    if (tempData.length > 0) {
      data[i].items = data[i].items.filter(
        (item) => item.sprintId === activeSprintId
      );
    }
  }

  return data;
};

export const mapTicketData = (data) => {
  return data.map((val) => {
    return {
      index: val?.index,
      id: val?.id,
      sprintId: val?.sprintId,
      abiLink: val?.abiLink,
      owner: val?.owner,
      repoter: val?.repoter,
      position: val?.position,
      tracking: val?.tracking,
    };
  });
};

export const mapSingleTicketData = (data) => {
  return {
    index: data?.index,
    id: data?.id,
    sprintId: data?.sprintId,
    abiLink: data?.abiLink,
    owner: data?.owner,
    repoter: data?.repoter,
    position: data?.position,
    tracking: data?.tracking,
  };
};
