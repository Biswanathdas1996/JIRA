/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
// import * as Yup from "yup";
import { Card, Grid } from "@mui/material";
import { _transction, _fetch } from "../../CONTRACT-ABI/connect";
import { create } from "ipfs-http-client";
import { useNavigate } from "react-router-dom";
import TransctionModal from "../shared/TransctionModal";
import { IPFSLink, IpfsViewLink } from "../../config";
import TextEditor from "../UI/TextEditor";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { addTicketTracking } from "../../functions/TicketTracking";
import MultipleSelectBox from "../UI/MultipleSelectBox";

const client = create(IPFSLink);

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
  const [ticketindex, setTicketindex] = useState(null);

  const [htmlCode, setHtmlCode] = useState(null);
  const [htmlCodeAC, setHtmlCodeAC] = useState(null);
  const [tickets, setTickets] = useState(null);
  const [defaultEditorValue, setDefaultEditorValue] = useState(null);
  const [defaultEditorValueAC, setDefaultEditorValueAC] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentABI, setCurrentABI] = useState(false);
  const [linkedStories, setLinkedStories] = useState(null);
  const [allTicketData, setAllTicketData] = useState(null);
  let history = useNavigate();

  const onchangeEpicStoryHandler = (newValue) => {
    setLinkedStories(newValue);
  };

  const getData = async () => {
    setLoading(true);

    const allTickets = await _fetch("getAllTickets");
    setAllTicketData(allTickets);
    const filterTicketsForCurrentUser = await allTickets.find(
      (ticket) => ticket.id === tokenId
    );

    setTicketindex(filterTicketsForCurrentUser.index);
    setCurrentABI(filterTicketsForCurrentUser?.abiLink);

    if (filterTicketsForCurrentUser?.abiLink) {
      await fetch(filterTicketsForCurrentUser?.abiLink)
        .then((response) => response.json())
        .then(async (data) => {
          const updatesTicket = { ...data, ...filterTicketsForCurrentUser };
          setTickets(updatesTicket);

          setLinkedStories(JSON.parse(updatesTicket?.linkedStories));

          await getDescription(data.description);
          await getAC(data.AC);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  };

  const getDescription = async (URI) => {
    await fetch(URI)
      .then((descResponse) => descResponse.text())
      .then((descriptionData) => {
        setDefaultEditorValue(descriptionData);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const getAC = async (URI) => {
    await fetch(URI)
      .then((descResponse) => descResponse.text())
      .then((descriptionData) => {
        setDefaultEditorValueAC(descriptionData);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const saveData = async ({ title, type, priority, storypoint }) => {
    setStart(true);
    let responseData;
    const id = tokenId;
    let saveHtmlDescription;
    let descIpfsLink;
    let acIpfsLink;
    if (htmlCode) {
      saveHtmlDescription = await client.add(htmlCode);
      descIpfsLink = IpfsViewLink(saveHtmlDescription.path);
    } else {
      descIpfsLink = tickets?.description;
    }

    if (htmlCodeAC) {
      saveHtmlDescription = await client.add(htmlCodeAC);
      acIpfsLink = IpfsViewLink(saveHtmlDescription.path);
    } else {
      acIpfsLink = tickets?.AC;
    }

    const metaData = {
      id: id,
      name: title,
      type: type,
      priority: priority,
      storypoint: storypoint,
      description: descIpfsLink,
      AC: acIpfsLink,
      linkedStories: JSON.stringify(linkedStories),
    };

    const resultsSaveMetaData = await client.add(JSON.stringify(metaData));

    const trackingString = await addTicketTracking(
      `<div class="track-div">Ticket details updated from <a href="${currentABI}" target="_blank">Old Data</a></div>`,
      ticketindex
    );

    responseData = await _transction(
      "updateTicket",
      IpfsViewLink(resultsSaveMetaData.path),
      ticketindex,
      trackingString,
      true
    );

    setResponse(responseData);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getEditorValue = (val) => {
    setHtmlCode(val);
  };
  const getEditorValueAC = (val) => {
    setHtmlCodeAC(val);
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
        <h4> Update</h4>
        {!loading && tickets && (
          <Formik
            initialValues={{
              title: tickets.name,
              type: tickets.type,
              priority: tickets.priority,
              storypoint: tickets.storypoint,
              text: tickets.description,
              sprint: tickets?.sprintId,
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
                  <Grid item lg={12} md={12} sm={12} xs={12}>
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
                          touched.title && errors.title ? "is-invalid" : ""
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
                        Choose Priority <span className="text-danger">*</span>
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
                  {/* AC */}
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <div
                      className="form-group"
                      style={{ marginLeft: 10, marginTop: 10 }}
                    >
                      <label for="title" className="my-2">
                        Acceptance criteria{" "}
                        <span className="text-danger">*</span>
                      </label>

                      {defaultEditorValueAC && (
                        <TextEditor
                          name="ac"
                          label="ac"
                          tip="Describe the project in as much detail as you'd like."
                          value={htmlCodeAC}
                          defaultValue={defaultEditorValueAC}
                          onChange={getEditorValueAC}
                        />
                      )}
                    </div>
                  </Grid>
                  {/* link stories */}
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <div
                      className="form-group"
                      style={{ marginLeft: 10, marginTop: 10 }}
                    >
                      <label htmlFor="title" className="my-2">
                        Link Story{" "}
                      </label>

                      <MultipleSelectBox
                        tickets={allTicketData}
                        onchangeEpicStoryHandler={onchangeEpicStoryHandler}
                        defaultValue={linkedStories}
                      />
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
export default UpadteTicket;
