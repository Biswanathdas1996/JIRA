export const Status = (position) => {
  switch (position) {
    case "1":
      return "Requested";
    case "2":
      return "To do";
    case "3":
      return "In Progress";
    case "4":
      return "Done";
    case "5":
      return "Closed";

    default:
      return "Assigned";
  }
};
export const StatusColor = (position) => {
  switch (position) {
    case "1":
      return "#0d6efd";
    case "2":
      return "#7D3C98";
    case "3":
      return "#D4AC0D";
    case "4":
      return "#F39C12";
    case "5":
      return "#229954";

    default:
      return "#0d6efd";
  }
};
