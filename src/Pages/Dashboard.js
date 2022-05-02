import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import uuid from "uuid/v4";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TicketCard from "../components/shared/TicketCard";

const itemsFromBackend = [
  {
    id: "1",
    content: "Each issue can be assigned priority from lowest to highest.",
  },
  { id: "2", content: "Click on an issue to see what's behind it." },
  {
    id: "3",
    content:
      "You can track how many hours were spent working on an issue, and how many hours remain.",
  },
  {
    id: "4",
    content:
      "Each issue has a single reporter but can have multiple assignees.",
  },
];

const closedItem = [
  { id: "5", content: "Try leaving a comment on this issue." },
  {
    id: "6",
    content: "You can use rich text with images in issue descriptions.",
  },
];

const columnsFromBackend = {
  // eslint-disable-next-line no-useless-computed-key
  [1]: {
    name: "Requested",
    items: itemsFromBackend,
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
    items: closedItem,
  },
};

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

  console.log("---updatedCard---", updatedCard);
};

function Dashboard() {
  const [columns, setColumns] = useState(columnsFromBackend);
  return (
    <Container>
      <Box
        sx={{
          pt: 4,
          pb: 2,
        }}
      >
        <div
          style={{ display: "flex", justifyContent: "center", height: "100%" }}
        >
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
                                          title={item.content}
                                          ticket={`Ticket-1`}
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
        </div>
      </Box>
    </Container>
  );
}

export default Dashboard;
