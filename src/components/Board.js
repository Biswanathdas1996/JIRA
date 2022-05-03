import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import uuid from "uuid/v4";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TicketCard from "../components/shared/TicketCard";
import { _fetch, _transction } from "../CONTRACT-ABI/connect";

import { create } from "ipfs-http-client";
const client = create("https://ipfs.infura.io:5001/api/v0");

const itemsFromBackend = [
  {
    id: "1",
    title: "Each issue can be assigned priority from lowest to highest.",
    type: "story",
    storypoint: 4,
    priority: "high",
  },
  {
    id: "2",
    title: "Click on an issue to see what's behind it.",
    type: "bug",
    storypoint: 6,
    priority: "blocker",
  },
  {
    id: "3",
    title:
      "You can track how many hours were spent working on an issue, and how many hours remain.",
    type: "story",
    storypoint: 4,
    priority: "critical",
  },
  {
    id: "4",
    title: "Each issue has a single reporter but can have multiple assignees.",
    type: "story",
    storypoint: 9,
    priority: "medium",
  },
];

const mapTicketData = (data) => {
  return data.map((val) => {
    return {
      id: val?.id,
      abiLink: val?.abiLink,
      owner: val?.owner,
      repoter: val?.repoter,
    };
  });
};

const baseTemplate = (initialTickets = []) => {
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

function Board({ address }) {
  const [columns, setColumns] = useState([]);
  const [user, setUser] = useState([]);
  const [tickets, setTickets] = useState([]);
  useEffect(() => {
    fetchData(address);
    setColumns(baseTemplate());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchData(address) {
    const result = await _fetch("users", address);
    setUser(result);
    const allTickets = await _fetch("getAllTickets");

    const filterTicketsForCurrentUser = await allTickets.filter(
      (ticket) => ticket.owner === address
    );

    await setTickets(mapTicketData(filterTicketsForCurrentUser));

    const getAllUserUri = result?.boardData;
    if (getAllUserUri) {
      await fetch(getAllUserUri)
        .then((response) => response.json())
        .then((data) => {
          setColumns(data);
        });
    } else {
      setColumns(baseTemplate(mapTicketData(filterTicketsForCurrentUser)));
    }
  }

  const onDragEnd = async (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;
    let updatedCard;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      updatedCard = {
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      };
      await setColumns(updatedCard);
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      updatedCard = {
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      };
      await setColumns(updatedCard);
    }

    const resultsSaveMetaData = await await client.add(
      JSON.stringify(updatedCard)
    );

    const responseData = await _transction(
      "setBoardDataToUser",
      `https://ipfs.infura.io/ipfs/${resultsSaveMetaData.path}`,
      address
    );
  };

  return (
    <Box
      sx={{
        pt: 4,
        pb: 2,
      }}
    >
      <h5>{user?.name}</h5>
      <div
        style={{ display: "flex", justifyContent: "center", height: "100%" }}
      >
        {tickets && tickets?.length > 0 && (
          <DragDropContext
            onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
          >
            {Object.entries(columns).map(([columnId, column], index) => {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                  key={columnId}
                >
                  <h2>{column.name}</h2>
                  <div style={{ margin: 5 }}>
                    <Droppable droppableId={columnId} key={columnId}>
                      {(provided, snapshot) => {
                        return (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                              background: snapshot.isDraggingOver
                                ? "lightblue"
                                : "lightgrey",
                              padding: 4,
                              width: 250,
                              minHeight: 500,
                            }}
                          >
                            {column.items.map((item, index) => {
                              return (
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id}
                                  index={index}
                                >
                                  {(provided, snapshot) => {
                                    return (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                          userSelect: "none",
                                          margin: "5px 2px",
                                          backgroundColor: snapshot.isDragging
                                            ? "#263B4A"
                                            : "#456C86",
                                          color: "white",
                                          ...provided.draggableProps.style,
                                        }}
                                      >
                                        <TicketCard
                                          item={item}
                                          ticket={`Ticket-${item?.id}`}
                                          data={tickets}
                                        />
                                      </div>
                                    );
                                  }}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        );
                      }}
                    </Droppable>
                  </div>
                </div>
              );
            })}
          </DragDropContext>
        )}
      </div>
    </Box>
  );
}

export default Board;
