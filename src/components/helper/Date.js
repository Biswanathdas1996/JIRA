export const getCurrentTimestamp = () => {
  return new Date().valueOf();
};

export const timeStampToDate = (timeStamp) => {
  var date = new Date(timeStamp * 1000);

  const txnDate =
    date.getDate() +
    "/" +
    (date.getMonth() + 1) +
    "/" +
    date.getFullYear() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds();

  return txnDate;
};
