import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
// import * as Yup from "yup";
import { Card, Grid } from "@mui/material";
import { _transction } from "../../CONTRACT-ABI/connect";
import { create } from "ipfs-http-client";
import { useNavigate } from "react-router-dom";
import TransctionModal from "../shared/TransctionModal";
import { _fetch } from "../../CONTRACT-ABI/connect";

import TextEditor from "../UI/TextEditor";

const client = create("https://ipfs.infura.io:5001/api/v0");

// const VendorSchema = Yup.object().shape({
//   name: Yup.string().required("Name is required"),
//   authorname: Yup.string().required("Authorname is required"),
//   price: Yup.string().required("Price is required"),
//   royelty: Yup.string().required("Royelty amount is required"),
// });
// WCVDU52748WW4F7EKDEDB89HKH41BIA4N2

const UpadteTicket = ({ tokenId }) => {
  const [start, setStart] = useState(false);
  const [response, setResponse] = useState(null);
  const [ticketindex, setTicketindex] = useState(false);
  const [htmlCode, setHtmlCode] = useState(null);
  const [tickets, setTickets] = useState(null);
  const [defaultEditorValue, setDefaultEditorValue] = useState(null);

  let history = useNavigate();

  const getData = async () => {
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
          console.log(updatesTicket?.description);
          getDescription(data.description);
        });
    }
  };

  const getDescription = (URI) => {
    fetch(URI)
      .then((descResponse) => descResponse.text())
      .then((descriptionData) => {
        setDefaultEditorValue(descriptionData);
      });
  };

  const saveData = async ({ title, type, priority, storypoint }) => {
    setStart(true);
    let responseData;
    const id = tokenId;
    let saveHtmlDescription;
    let descIpfsLink;
    if (htmlCode) {
      saveHtmlDescription = await client.add(htmlCode);
      descIpfsLink = `https://ipfs.infura.io/ipfs/${saveHtmlDescription.path}`;
    } else {
      descIpfsLink = tickets?.description;
    }

    const metaData = {
      id: id,
      name: title,
      type: type,
      priority: priority,
      storypoint: storypoint,
      description: descIpfsLink,
    };

    console.log(metaData);
    const resultsSaveMetaData = await await client.add(
      JSON.stringify(metaData)
    );

    responseData = await _transction(
      "updateTicket",
      `https://ipfs.infura.io/ipfs/${resultsSaveMetaData.path}`,
      ticketindex
    );

    setResponse(responseData);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getEditorValue = (val) => {
    console.log("-getEditorValue->", val);
    setHtmlCode(val);
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
                <h4> Update</h4>
                <Formik
                  initialValues={{
                    title: tickets.name,
                    type: tickets.type,
                    priority: tickets.priority,
                    storypoint: tickets.storypoint,
                    text: tickets.description,
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
                        {/* // Title */}
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                          <div
                            className="form-group"
                            style={{ marginLeft: 10, marginTop: 10 }}
                          >
                            <label for="title" className="my-2">
                              Title <span className="text-danger">*</span>
                            </label>
                            <Field
                              type="text"
                              name="title"
                              value={values.title}
                              autoComplete="flase"
                              placeholder="Enter title"
                              className={`form-control text-muted ${
                                touched.title && errors.title
                                  ? "is-invalid"
                                  : ""
                              }`}
                              style={{ marginRight: 10, padding: 9 }}
                            />
                          </div>
                        </Grid>
                        {/* type */}
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                          <div
                            className="form-group"
                            style={{ marginLeft: 10, marginTop: 10 }}
                          >
                            <label for="title" className="my-2">
                              Choose Type <span className="text-danger">*</span>
                            </label>
                            <Field
                              name="type"
                              component="select"
                              className={`form-control text-muted ${
                                touched.type && errors.type ? "is-invalid" : ""
                              }`}
                              style={{ marginRight: 10, padding: 9 }}
                            >
                              <option>-- Please select --</option>
                              <option value="story">Story</option>
                              <option value="bug">Bug</option>
                            </Field>
                          </div>
                        </Grid>
                        {/* priority */}
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                          <div
                            className="form-group"
                            style={{ marginLeft: 10, marginTop: 10 }}
                          >
                            <label for="title" className="my-2">
                              Choose Priority{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <Field
                              name="priority"
                              component="select"
                              className={`form-control text-muted ${
                                touched.priority && errors.priority
                                  ? "is-invalid"
                                  : ""
                              }`}
                              style={{ marginRight: 10, padding: 9 }}
                            >
                              <option>-- Please select --</option>
                              <option value="blocker">Blocker</option>
                              <option value="critical">Critical</option>
                              <option value="high">High</option>
                              <option value="medium">Medium</option>
                              <option value="low">Low</option>
                            </Field>
                          </div>
                        </Grid>
                        {/* Story point */}
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                          <div
                            className="form-group"
                            style={{ marginLeft: 10, marginTop: 10 }}
                          >
                            <label for="title" className="my-2">
                              Story point{" "}
                            </label>

                            <Field
                              type="number"
                              value={values.storypoint}
                              name="storypoint"
                              autoComplete="flase"
                              placeholder="Enter story point"
                              className={`form-control text-muted ${
                                touched.storypoint && errors.storypoint
                                  ? "is-invalid"
                                  : ""
                              }`}
                              style={{ marginRight: 10, padding: 9 }}
                            />
                          </div>
                        </Grid>

                        {/* Description */}
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                          <div
                            className="form-group"
                            style={{ marginLeft: 10, marginTop: 10 }}
                          >
                            <label for="title" className="my-2">
                              Description <span className="text-danger">*</span>
                            </label>

                            {defaultEditorValue && (
                              <TextEditor
                                name="description"
                                label="Description"
                                tip="Describe the project in as much detail as you'd like."
                                value={htmlCode}
                                defaultValue={defaultEditorValue}
                                onChange={getEditorValue}
                              />
                            )}
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
export default UpadteTicket;
