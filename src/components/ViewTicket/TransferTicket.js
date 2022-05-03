/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
// import * as Yup from "yup";
import { Card, Grid } from "@mui/material";
import { _transction } from "../../CONTRACT-ABI/connect";
import { create } from "ipfs-http-client";
import { useNavigate } from "react-router-dom";
import TextareaAutosize from "@mui/material/TextareaAutosize";
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
  const [ticketindex, setTicketindex] = useState(false);
  const [description, setDescription] = useState(null);
  const [tickets, setTickets] = useState(null);
  const [users, setusers] = useState([]);

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
    const filterTicketsForCurrentUser = await allTickets.find(
      (ticket) => ticket.id === tokenId
    );
    setTicketindex(filterTicketsForCurrentUser.index);

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
    // receiver
    const sender = tickets?.owner;
    let transfredTicket;
    let updatedSenderAbi;
    let updatedReceiverAbi;

    const getSenderCurrentABI = await _fetch("users", sender);
    await fetch(getSenderCurrentABI?.boardData)
      .then((response) => response.json())
      .then(async (data) => {
        for (let i = 1; i <= 5; i++) {
          if (data[i].items?.length > 0) {
            if (data[i].items.find((item) => item.id === tokenId)) {
              ///-----------------------////////
              transfredTicket = data[i].items.filter(
                (item) => item.id === tokenId
              );
              ////------------------------/////
              const result = data[i].items.filter(
                (item) => item.id !== tokenId
              );
              data[i].items = result;
            }
          }
        }
        const resultsSaveMetaData = await client.add(JSON.stringify(data));
        updatedSenderAbi = `https://ipfs.infura.io/ipfs/${resultsSaveMetaData.path}`;
      });
    //////////////////////////////////////////////////////////////////////////////////////////
    const getRecieverrCurrentABI = await _fetch("users", receiver);
    await fetch(getRecieverrCurrentABI?.boardData)
      .then((response) => response.json())
      .then(async (data) => {
        const updatedColumn = data[1].items;
        data[1].items = [...updatedColumn, ...transfredTicket];
        const resultsSaveMetaData = await client.add(JSON.stringify(data));
        updatedReceiverAbi = `https://ipfs.infura.io/ipfs/${resultsSaveMetaData.path}`;
      });

    await _transction(
      "transferTicket",
      sender,
      receiver,
      updatedSenderAbi,
      updatedReceiverAbi
    );
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
        <Grid item lg={3} md={3} sm={12} xs={12}></Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          {tickets && (
            <div style={{ margin: 20 }}>
              <Card>
                <Grid container>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <div
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
                                    Select User{" "}
                                    <span className="text-danger">*</span>
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
                    </div>
                  </Grid>
                </Grid>
              </Card>
            </div>
          )}
        </Grid>
        <Grid item lg={3} md={3} sm={12} xs={12}></Grid>
      </Grid>
    </>
  );
};
export default TransferTicket;
