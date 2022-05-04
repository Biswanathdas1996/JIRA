/* eslint-disable array-callback-return */
import _ from "lodash";
export const filterNewlyCreatedTicketys = (alldata, oldDataSet) => {
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

export const mapTicketData = (data) => {
  return data.map((val) => {
    return {
      index: val?.index,
      id: val?.id,
      abiLink: val?.abiLink,
      owner: val?.owner,
      repoter: val?.repoter,
    };
  });
};
