/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Avatar } from "@mui/material";
import TicketCard from "../components/shared/TicketCard";
import { _fetch, _transction } from "../CONTRACT-ABI/connect";
import { create } from "ipfs-http-client";
import { baseTemplate } from "./utility/BaseBoardDataTemplate";
import { IPFSLink, IpfsViewLink } from "../config";
import { mapTicketData, sanatizeData } from "../functions/index";
import Loader from "../components/shared/Loader";
import NoData from "../components/shared/NoData";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import _ from "lodash";
import TransctionModal from "../components/shared/TransctionModal";
import { addTicketTracking } from "../functions/TicketTracking";
import { Status } from "./utility/Status";

const client = create(IPFSLink);

function Board({ address }) {
  const [columns, setColumns] = useState([]);
  const [user, setUser] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState(false);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    fetchData(address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchData(address) {
    setLoading(true);
    const activeSprintId = await _fetch("activeSprintId");
    const result = await _fetch("users", address);
    setUser(result);
    const allTickets = await _fetch("getAllTickets");
    const filterTicketsForCurrentUser = await allTickets.filter(
      (ticket) =>
        ticket.owner === address && ticket?.sprintId === activeSprintId
    );
    const mappedData = mapTicketData(filterTicketsForCurrentUser);
    setTickets(mappedData);
    const getAllUserUri = result?.boardData;
    if (getAllUserUri) {
      await fetch(getAllUserUri)
        .then((response) => response.json())
        .then((allData) => {
          const data = sanatizeData(allData, activeSprintId);
          // const anyNewTicket = filterNewlyCreatedTicketys(mappedData, data);
          // const currentRequestItems = [...data[1].items];
          // if (anyNewTicket?.length > 0) {
          //   anyNewTicket.map((newTicket) => {
          //     currentRequestItems.push(newTicket);
          //   });
          // }
          // data[1].items = currentRequestItems;
          setColumns(data);
        });
    } else {
      setColumns(baseTemplate(mappedData));
    }
    setLoading(false);
  }

  const onDragEnd = async (result, columns, setColumns) => {
    if (!result.destination) return;
    let updatedPosition;
    let dragedCardIndex;
    let tracking;
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
      updatedPosition = destColumn?.position;
      dragedCardIndex = destItems[0].index;
      tracking = destItems[0].tracking;

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

    if (!_.isEqual(columns, updatedCard)) {
      setLoading(true);
      setStart(true);
      const resultsSaveMetaData = await client.add(JSON.stringify(updatedCard));

      const trackingString = await addTicketTracking(
        `Ticket moved to ${Status(updatedPosition)}`,
        dragedCardIndex
      );

      const responseData = await _transction(
        "changePosition",
        updatedPosition.toString(),
        Number(dragedCardIndex),
        IpfsViewLink(resultsSaveMetaData.path),
        address,
        trackingString
      );

      setResponse(responseData);
      setLoading(false);

      setTimeout(() => {
        setResponse(null);
        setStart(false);
      }, 3000);
    }
  };

  const modalClose = () => {
    setStart(false);
    setResponse(null);
  };

  return (
    <>
      {start && <TransctionModal response={response} modalClose={modalClose} />}
      <Accordion style={{ marginTop: 5, border: "1px solid #80808073" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id={`panel1a-header_${address}`}
          style={{ background: "#d3d3d363" }}
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
            {/* {tickets?.length} issue(s) */}
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
                {/* const allData = sanatizeData(data, activeSprintId); */}
                {Object.entries(columns).map(([columnId, column], index) => {
                  const insideItems = _.uniqBy(column?.items, "id");
                  return (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                      key={columnId}
                    >
                      <Typography
                        style={{
                          margin: "1rem",
                          fontSize: 18,
                          fontWeight: "bold",
                        }}
                      >
                        {column.name}
                      </Typography>

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
                                {insideItems.map((item, index) => {
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
                                              backgroundColor:
                                                snapshot.isDragging
                                                  ? "#263B4A"
                                                  : "#456C86",
                                              color: "white",
                                              ...provided.draggableProps.style,
                                            }}
                                          >
                                            <TicketCard
                                              index={item?.index}
                                              item={item}
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
            ) : loading ? (
              <Loader count="5" xs={12} sm={2.4} md={2.4} lg={2.4} />
            ) : (
              ""
            )}
            {!loading && tickets && tickets?.length === 0 && (
              <NoData text="No ticket assigned" />
            )}
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

export default Board;
