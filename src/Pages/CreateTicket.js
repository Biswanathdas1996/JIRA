import React, { useState, useEffect, useContext } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Card, Grid } from "@mui/material";
import { create } from "ipfs-http-client";
import { useNavigate } from "react-router-dom";
import uuid from "uuid/v4";
import { Avatar } from "@mui/material";
import TransctionModal from "../components/shared/TransctionModal";
import TextEditor from "../components/UI/TextEditor";
import { IPFSLink, IpfsViewLink } from "../config";
import { AccountContext } from "../App";
import { _transction, _fetch } from "../../src/CONTRACT-ABI/connect";
import Box from "@mui/material/Box";
import Loader from "../components/shared/Loader";
import { decode } from "js-base64";

const client = create(IPFSLink);

const CreateTicket = () => {
  const [start, setStart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [htmlCode, setHtmlCode] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [activeSprint, setActiveSprint] = useState(null);

  const { account } = useContext(AccountContext);

  let history = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const activeSprintId = await _fetch("activeSprintId");
    setActiveSprint(activeSprintId);
    const getAllSprints = await _fetch("getAllSprints");
    setSprints(getAllSprints);
    setLoading(false);
  };

  const saveData = async ({ title, type, priority, storypoint, sprint }) => {
    setStart(true);
    let responseData;
    const id = uuid();

    const saveHtmlDescription = await await client.add(htmlCode);

    const metaData = {
      id: id,
      name: title,
      type: type,
      priority: priority,
      storypoint: storypoint,
      description: IpfsViewLink(saveHtmlDescription.path),
    };

    const resultsSaveMetaData = await await client.add(
      JSON.stringify(metaData)
    );

    const sprintId = sprint;

    const trackingData = JSON.stringify([
      {
        time: new Date(),
        status: `${type} created with ${priority} priority & ${storypoint} storypoint on Sprint-${sprintId}`,
        updatedBy:
          localStorage.getItem("uid") && decode(localStorage.getItem("uid")),
      },
    ]);

    if (account?.uid) {
      responseData = await _transction(
        "createTicket",
        sprintId,
        id,
        IpfsViewLink(resultsSaveMetaData.path),
        account?.uid,
        trackingData
      );

      setResponse(responseData);
    }
  };

  const modalClose = () => {
    setStart(false);
    setResponse(null);
    history("/");
  };

  const getEditorValue = (val) => {
    console.log("-getEditorValue->", val);
    setHtmlCode(val);
  };

  const VendorSchema = Yup.object().shape({
    sprint: Yup.string().required("sprint is required"),
    type: Yup.string().required("type is required"),
    title: Yup.string().required("title is required"),
    priority: Yup.string().required("priority is required"),
    storypoint: Yup.string().required("storypoint is required"),
  });

  return (
    <>
      {start && <TransctionModal response={response} modalClose={modalClose} />}
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item lg={2} md={2} sm={12} xs={12}></Grid>
        <Grid item lg={8} md={8} sm={12} xs={12}>
          <div style={{ margin: 20 }}>
            <Card
              style={{
                padding: "20px",
                background: "white",
              }}
            >
              <h4>Create Story</h4>
              {!loading ? (
                <Formik
                  initialValues={{
                    title: "",
                    type: "",
                    priority: "",
                    storypoint: "",
                    text: "",
                    sprint: activeSprint,
                  }}
                  validationSchema={VendorSchema}
                  onSubmit={(values, { setSubmitting }) => {
                    saveData(values);
                    setSubmitting(false);
                  }}
                >
                  {({ touched, errors, isSubmitting, values }) => (
                    <Form>
                      <Grid container>
                        {/* sprint */}
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                          <div
                            className="form-group"
                            style={{ marginLeft: 10, marginTop: 10 }}
                          >
                            <label for="title" className="my-2">
                              Sprint <span className="text-danger">*</span>
                            </label>
                            <Field
                              name="sprint"
                              component="select"
                              className={`form-control text-muted ${
                                touched.sprint && errors.sprint
                                  ? "is-invalid"
                                  : ""
                              }`}
                              style={{ marginRight: 10, padding: 9 }}
                            >
                              <option>-- Please select --</option>
                              {sprints?.map((data) => (
                                <option value={data?.id}>
                                  SPRINT-{data?.id}
                                </option>
                              ))}
                            </Field>
                          </div>
                        </Grid>
                        {/* type */}
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                          <div
                            className="form-group"
                            style={{ marginLeft: 10, marginTop: 10 }}
                          >
                            <label for="title" className="my-2">
                              Issue Type <span className="text-danger">*</span>
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
                        {/* // repoter */}
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                          <div
                            className="form-group"
                            style={{ marginLeft: 10, marginTop: 10 }}
                          >
                            <label for="title" className="my-2">
                              Repoter <span className="text-danger">*</span>
                            </label>

                            <Box sx={{ display: { xs: "none", md: "flex" } }}>
                              {account?.name && (
                                <>
                                  <Avatar
                                    alt="Remy Sharp"
                                    sx={{
                                      width: 40,
                                      height: 40,
                                      borderRadius: "50%",
                                    }}
                                    src={account?.profileImg}
                                  ></Avatar>
                                  <p
                                    style={{
                                      color: "black",
                                      margin: 10,
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {account?.name}
                                  </p>
                                </>
                              )}
                            </Box>
                          </div>
                        </Grid>
                        {/* summary */}
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                          <div
                            className="form-group"
                            style={{ marginLeft: 10, marginTop: 10 }}
                          >
                            <label for="title" className="my-2">
                              Summary <span className="text-danger">*</span>
                            </label>
                            <Field
                              type="text"
                              name="title"
                              autoComplete="flase"
                              placeholder="Enter Summary"
                              className={`form-control text-muted ${
                                touched.title && errors.title
                                  ? "is-invalid"
                                  : ""
                              }`}
                              style={{ marginRight: 10, padding: 9 }}
                            />
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

                        {/* Description */}
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                          <div
                            className="form-group"
                            style={{ marginLeft: 10, marginTop: 10 }}
                          >
                            <label for="title" className="my-2">
                              Description <span className="text-danger">*</span>
                            </label>
                            <TextEditor
                              name="description"
                              label="Description"
                              tip="Describe the project in as much detail as you'd like."
                              value={htmlCode}
                              onChange={getEditorValue}
                            />
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
                                value={"Submit"}
                              />
                            </span>
                          </div>
                        </Grid>
                      </Grid>
                    </Form>
                  )}
                </Formik>
              ) : (
                <Loader count="1" xs={12} sm={12} md={12} lg={12} />
              )}
            </Card>
          </div>
        </Grid>
        <Grid item lg={2} md={2} sm={12} xs={12}></Grid>
      </Grid>
    </>
  );
};
export default CreateTicket;
