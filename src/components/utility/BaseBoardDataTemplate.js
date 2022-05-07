export const baseTemplate = (initialTickets = []) => {
  const columnsFromBackend = {
    // eslint-disable-next-line no-useless-computed-key
    [1]: {
      name: "Requested",
      position: "1",
      items: initialTickets,
    },
    // eslint-disable-next-line no-useless-computed-key
    [2]: {
      name: "To do",
      position: "2",
      items: [],
    },
    // eslint-disable-next-line no-useless-computed-key
    [3]: {
      name: "In Progress",
      position: "3",
      items: [],
    },
    // eslint-disable-next-line no-useless-computed-key
    [4]: {
      name: "Done",
      position: "4",
      items: [],
    },
    // eslint-disable-next-line no-useless-computed-key
    [5]: {
      name: "Closed",
      position: "5",
      items: [],
    },
  };
  return columnsFromBackend;
};
