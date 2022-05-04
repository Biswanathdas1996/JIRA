/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
// import * as Yup from "yup";
import { Card, Grid } from "@mui/material";
import { _transction } from "../../CONTRACT-ABI/connect";
import { create } from "ipfs-http-client";
import { useNavigate } from "react-router-dom";
import TransctionModal from "../shared/TransctionModal";
import { _fetch } from "../../CONTRACT-ABI/connect";
import _ from "lodash";
const client = create("https://ipfs.infura.io:5001/api/v0");

// const VendorSchema = Yup.object().shape({
//   name: Yup.string().required("Name is required"),
//   authorname: Yup.string().required("Authorname is required"),
//   price: Yup.string().required("Price is required"),
//   royelty: Yup.string().required("Royelty amount is required"),
// });

const mapTicketData = (data) => {
  return data.map((val) => {
    return {
      index: val?.index,
      id: val?.id,
      abiLink: val?.abiLink,
      owner: val?.owner,
      repoter: val?.repoter,
    };
  });
};

const TransferTicket = ({ tokenId }) => {
  const [start, setStart] = useState(false);
  const [response, setResponse] = useState(null);
  const [tickets, setTickets] = useState(null);
  const [users, setusers] = useState([]);
  const [transfredTicket, setTransfredTicket] = useState(null);

  let history = useNavigate();

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    const allUser = await _fetch("getAllUser");

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
        });
    }
  };

  const saveData = async ({ receiver }) => {
    setStart(true);
    const sender = tickets?.owner;

    let updatedSenderAbi;
    let updatedReceiverAbi;

    const getSenderCurrentABI = await _fetch("users", sender);
    console.log("get-Sender-Current-ABI");
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
        console.log("results-Save-Meta-Data");
        console.log("senderData", senderData);
        const resultsSaveMetaData = await client.add(
          JSON.stringify(senderData)
        );
        updatedSenderAbi = `https://ipfs.infura.io/ipfs/${resultsSaveMetaData.path}`;
      });
    //////////////////////////////////////////////////////////////////////////////////////////
    const getRecieverrCurrentABI = await _fetch("users", receiver);
    console.log("get-Recieverr-Current-ABI");
    if (getRecieverrCurrentABI?.boardData) {
      await fetch(getRecieverrCurrentABI?.boardData)
        .then((response) => response.json())
        .then(async (receiverData) => {
          console.log("receiverData", receiverData);
          console.log("transfredTicket", transfredTicket);
          const updatedColumn = receiverData[1].items;
          receiverData[1].items = [...updatedColumn, transfredTicket];
          console.log("receiverData", receiverData);

          const resultsSaveMetaData = await client.add(
            JSON.stringify(receiverData)
          );
          updatedReceiverAbi = `https://ipfs.infura.io/ipfs/${resultsSaveMetaData.path}`;
        });
    }

    console.log("updated-Column");
    console.log("updatedSenderAbi", updatedSenderAbi);
    console.log("updatedReceiverAbi", updatedReceiverAbi);

    const finalResponse = await _transction(
      "transferTicket",
      sender,
      receiver,
      updatedSenderAbi,
      updatedReceiverAbi,
      transfredTicket.index
    );

    setResponse(finalResponse);
    setStart(false);
  };

  const modalClose = () => {
    setStart(false);
    setResponse(null);
    history("/");
  };

  return (
    <>
      {start && <TransctionModal response={response} modalClose={modalClose} />}
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item lg={2} md={2} sm={12} xs={12}></Grid>
        <Grid item lg={8} md={8} sm={12} xs={12}>
          {tickets && (
            <div style={{ margin: 20 }}>
              <Card
                style={{
                  padding: "20px",
                  background: "white",
                }}
              >
                <h4> Transfer</h4>
                <Formik
                  initialValues={{
                    receiver: "",
                  }}
                  // validationSchema={VendorSchema}
                  onSubmit={(values, { setSubmitting }) => {
                    saveData(values);
                    setSubmitting(false);
                  }}
                >
                  {({ touched, errors, isSubmitting, values }) => (
                    <Form>
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
                                  <option value={user?.userAddress}>
                                    {user?.name}
                                  </option>
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
                                value={"Update"}
                              />
                            </span>
                          </div>
                        </Grid>
                      </Grid>
                    </Form>
                  )}
                </Formik>
              </Card>
            </div>
          )}
        </Grid>
        <Grid item lg={2} md={2} sm={12} xs={12}></Grid>
      </Grid>
    </>
  );
};
export default TransferTicket;
