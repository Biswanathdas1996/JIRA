/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
// import * as Yup from "yup";
import { Card, Grid, Button } from "@mui/material";
import { _transction } from "../../CONTRACT-ABI/connect";
import { create } from "ipfs-http-client";
import { useNavigate } from "react-router-dom";
import TransctionModal from "../shared/TransctionModal";
import { _fetch } from "../../CONTRACT-ABI/connect";
import _ from "lodash";
import { IPFSLink, IpfsViewLink } from "../../config";
import { mapTicketData } from "../../functions/index";
import { addTicketTracking } from "../../functions/TicketTracking";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const client = create(IPFSLink);

// const VendorSchema = Yup.object().shape({
//   name: Yup.string().required("Name is required"),
//   authorname: Yup.string().required("Authorname is required"),
//   price: Yup.string().required("Price is required"),
//   royelty: Yup.string().required("Royelty amount is required"),
// });

const TransferTicket = ({ tokenId }) => {
  const [start, setStart] = useState(false);
  const [response, setResponse] = useState(null);
  const [tickets, setTickets] = useState(null);
  const [users, setusers] = useState([]);
  const [totalUserCount, setTotalUserCount] = useState(0);
  const [transfredTicket, setTransfredTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  let history = useNavigate();

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    setLoading(true);
    const allUser = await _fetch("getAllUser");
    setTotalUserCount(allUser?.length);
    let tempUserData = [];
    await allUser.map(async (address) => {
      const result = await _fetch("users", address);
      tempUserData.push(result);
      setusers(tempUserData);
    });

    const allTickets = await _fetch("getAllTickets");
    const filterTicketsForCurrentUser = await mapTicketData(allTickets).find(
      (ticket) => ticket.id === tokenId
    );

    await setTransfredTicket(filterTicketsForCurrentUser);
    if (filterTicketsForCurrentUser?.abiLink) {
      await fetch(filterTicketsForCurrentUser?.abiLink)
        .then((response) => response.json())
        .then((data) => {
          const updatesTicket = { ...data, ...filterTicketsForCurrentUser };
          setTickets(updatesTicket);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    }
  };

  const saveData = async ({ receiver }) => {
    setStart(true);

    // transferTicket(receiver, tickets, tokenId, transfredTicket);

    const sender = tickets?.owner;

    let updatedSenderAbi;
    let updatedReceiverAbi;

    const getSenderCurrentABI = await _fetch("users", sender);

    // return;
    await fetch(getSenderCurrentABI?.boardData)
      .then((response) => response.json())
      .then(async (senderData) => {
        for (let i = 1; i <= 5; i++) {
          if (senderData[i].items?.length > 0) {
            if (senderData[i].items.find((item) => item.id === tokenId)) {
              const result = senderData[i].items.filter(
                (item) => item.id !== tokenId
              );
              senderData[i].items = result;
            }
          }
        }

        const resultsSaveMetaData = await client.add(
          JSON.stringify(senderData)
        );
        updatedSenderAbi = IpfsViewLink(resultsSaveMetaData.path);
      });
    //////////////////////////////////////////////////////////////////////////////////////////
    const getRecieverrCurrentABI = await _fetch("users", receiver);

    if (getRecieverrCurrentABI?.boardData) {
      await fetch(getRecieverrCurrentABI?.boardData)
        .then((response) => response.json())
        .then(async (receiverData) => {
          const updatedColumn = receiverData[1].items;
          receiverData[1].items = [...updatedColumn, transfredTicket];

          const resultsSaveMetaData = await client.add(
            JSON.stringify(receiverData)
          );
          updatedReceiverAbi = IpfsViewLink(resultsSaveMetaData.path);
        });
    }

    const trackingString = await addTicketTracking(
      `<div class="track-div">Ticket <b style="color:#e06a00;">transfred </b> from <img class="track-img-profile" src="${getSenderCurrentABI.profileImg}" height="30px" width="30px" style="border-radius: 50%; margin:5px" /> <b>${getSenderCurrentABI.name}</b> to <img class="track-img-profile" style="border-radius: 50%; margin:5px;" src="${getRecieverrCurrentABI.profileImg}" height="30px" width="30px" /> <b>${getRecieverrCurrentABI.name}</b></div>`,
      transfredTicket.index
    );

    // return;
    const finalResponse = await _transction(
      "transferTicket",
      sender,
      receiver,
      updatedSenderAbi,
      updatedReceiverAbi,
      transfredTicket.index,
      trackingString
    );

    setResponse(finalResponse);
  };

  const modalClose = () => {
    setStart(false);
    setResponse(null);
    history("/");
  };

  return (
    <>
      {start && <TransctionModal response={response} modalClose={modalClose} />}

      <Card
        style={{
          padding: "20px",
          background: "white",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h4> Transfer</h4>

          <Button type="button" onClick={() => getData()}>
            Refresh
          </Button>
        </div>

        {!loading && tickets?.owner !== "" && (
          <Formik
            initialValues={{
              receiver: transfredTicket?.owner,
            }}
            // validationSchema={VendorSchema}
            onSubmit={(values, { setSubmitting }) => {
              saveData(values);
              setSubmitting(false);
            }}
          >
            {({ touched, errors, isSubmitting, values }) => (
              <Form>
                {totalUserCount === users?.length && (
                  <Grid container>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <div
                        className="form-group"
                        style={{ marginLeft: 10, marginTop: 10 }}
                      >
                        <label for="title" className="my-2">
                          Select User <span className="text-danger">*</span>
                        </label>
                        <Field
                          name="receiver"
                          component="select"
                          className={`form-control text-muted ${
                            touched.receiver && errors.receiver
                              ? "is-invalid"
                              : ""
                          }`}
                          style={{ marginRight: 10, padding: 9 }}
                        >
                          <option>-- Please select --</option>
                          {users?.map((user) => {
                            return (
                              <option value={user?.uid}>{user?.name}</option>
                            );
                          })}
                        </Field>
                      </div>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <div
                        className="form-group"
                        style={{
                          marginLeft: 10,
                          marginTop: 10,
                          float: "right",
                        }}
                      >
                        <span className="input-group-btn">
                          <input
                            className="btn btn-default btn-primary float-right"
                            type="submit"
                            value={"Assign"}
                          />
                        </span>
                      </div>
                    </Grid>
                  </Grid>
                )}
              </Form>
            )}
          </Formik>
        )}

        {loading && (
          <Stack spacing={1} style={{ marginTop: 10 }}>
            <Skeleton variant="rectangular" animation="wave" height={118} />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
          </Stack>
        )}
      </Card>
    </>
  );
};
export default TransferTicket;
