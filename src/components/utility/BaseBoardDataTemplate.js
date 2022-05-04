export const baseTemplate = (initialTickets = []) => {
  const columnsFromBackend = {
    // eslint-disable-next-line no-useless-computed-key
    [1]: {
      name: "Requested",
      items: initialTickets,
    },
    // eslint-disable-next-line no-useless-computed-key
    [2]: {
      name: "To do",
      items: [],
    },
    // eslint-disable-next-line no-useless-computed-key
    [3]: {
      name: "In Progress",
      items: [],
    },
    // eslint-disable-next-line no-useless-computed-key
    [4]: {
      name: "Done",
      items: [],
    },
    // eslint-disable-next-line no-useless-computed-key
    [5]: {
      name: "Closed",
      items: [],
    },
  };
  return columnsFromBackend;
};
