/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Avatar } from "@mui/material";
import TicketCard from "../components/shared/TicketCard";
import { _fetch, _transction } from "../CONTRACT-ABI/connect";
import { create } from "ipfs-http-client";
import { baseTemplate } from "./utility/BaseBoardDataTemplate";
import { IPFSLink, IpfsViewLink } from "../config";
import { filterNewlyCreatedTicketys, mapTicketData } from "../functions/index";
import Loader from "../components/shared/Loader";
import NoData from "../components/shared/NoData";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const client = create(IPFSLink);

function Board({ address }) {
  const [columns, setColumns] = useState([]);
  const [user, setUser] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData(address);
    // setColumns(baseTemplate());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchData(address) {
    setLoading(true);
    const result = await _fetch("users", address);

    setUser(result);
    const allTickets = await _fetch("getAllTickets");

    const filterTicketsForCurrentUser = await allTickets.filter(
      (ticket) => ticket.owner === address
    );

    const mappedData = mapTicketData(filterTicketsForCurrentUser);
    await setTickets(mappedData);

    const getAllUserUri = result?.boardData;
    if (getAllUserUri) {
      await fetch(getAllUserUri)
        .then((response) => response.json())
        .then((data) => {
          const anyNewTicket = filterNewlyCreatedTicketys(mappedData, data);
          const currentRequestItems = [...data[1].items];
          if (anyNewTicket?.length > 0) {
            anyNewTicket.map((newTicket) => {
              currentRequestItems.push(newTicket);
            });
          }
          data[1].items = currentRequestItems;
          setColumns(data);
        });
    } else {
      setColumns(baseTemplate(mappedData));
    }
    setLoading(false);
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

    const resultsSaveMetaData = await client.add(JSON.stringify(updatedCard));

    await _transction(
      "setBoardDataToUser",
      IpfsViewLink(resultsSaveMetaData.path),
      address
    );
  };

  return (
    <Accordion style={{ marginTop: 5 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id={`panel1a-header_${address}`}
      >
        <Avatar
          alt="Remy Sharp"
          sx={{
            width: 70,
            height: 70,
            borderRadius: "50%",
          }}
          src={user?.profileImg}
        ></Avatar>
        <Typography
          style={{ margin: "1rem", fontSize: 18, fontWeight: "bold" }}
        >
          {user?.name}
        </Typography>
        <Typography style={{ marginTop: "1rem", fontSize: 14 }}>
          {tickets?.length} issue(s)
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            height: "100%",
          }}
        >
          {!loading && tickets && tickets?.length > 0 ? (
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
                                          <TicketCard index={item?.index} />
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
          ) : (
            <Loader count="5" xs={12} sm={2.4} md={2.4} lg={2.4} />
          )}
          {!loading && tickets && tickets?.length === 0 && (
            <NoData text="You does noy have any NFT" />
          )}
        </div>
      </AccordionDetails>
    </Accordion>
  );
}

export default Board;
