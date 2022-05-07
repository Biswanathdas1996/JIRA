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
      return null;
  }
};
export const StatusColor = (position) => {
  switch (position) {
    case "1":
      return "#0d6efd";
    case "2":
      return "#7D3C98";
    case "3":
      return "In Progress";
    case "4":
      return "#D4AC0D";
    case "5":
      return "#229954";

    default:
      return null;
  }
};
