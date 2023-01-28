import React, { useState, useEffect, useContext } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { Card, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import uuid from "uuid/v4";
import { Avatar } from "@mui/material";
import TransctionModal from "../components/shared/TransctionModal";
import TextEditor from "../components/UI/TextEditor";
import { AccountContext } from "../App";
import { _transction, _fetch } from "../../src/CONTRACT-ABI/connect";
import Box from "@mui/material/Box";
import Loader from "../components/shared/Loader";
import { decode } from "js-base64";
import MultipleSelectBox from "../components/UI/MultipleSelectBox";
import Button from "@mui/material/Button";
import DeleteOutlineIcon from "@mui/icons-material/Delete";
import { pink } from "@mui/material/colors";
import { mapTaskData } from "../functions/index";
import { createAnduploadFileToIpfs } from "../utils/ipfs";

const CreateTicket = () => {
  const [start, setStart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [htmlCode, setHtmlCode] = useState(null);
  const [htmlCodeAC, setHtmlCodeAC] = useState(null);
  const [tickets, setTickets] = useState([]);

  const [linkedStories, setLinkedStories] = useState(null);

  const onchangeEpicStoryHandler = (newValue) => {
    setLinkedStories(newValue);
  };

  const { account } = useContext(AccountContext);

  let history = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const allTickets = await _fetch("getAllTickets");
    setTickets(allTickets);
    setLoading(false);
  };

  const saveData = async ({
    title,
    type,
    priority,
    storypoint,
    sprint,
    tasks,
    description,
    ac,
  }) => {
    setStart(true);
    let responseData;
    const id = uuid();

    const mappedTaskData = mapTaskData(tasks);

    const metaData = {
      id: id,
      name: title,
      type: type,
      priority: priority,
      storypoint: storypoint,
      description: description,
      AC: ac,
      linkedStories: JSON.stringify(linkedStories),
      tasks: JSON.stringify(mappedTaskData),
    };

    const resultsSaveMetaData = await createAnduploadFileToIpfs(metaData);

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
        "",
        id,
        resultsSaveMetaData.link,
        account?.uid,
        trackingData
      );

      setResponse(responseData);
    }
  };

  const modalClose = () => {
    setStart(false);
    setResponse(null);
    history("/backlog");
  };

  const getEditorValue = (val) => {
    setHtmlCode(val);
  };
  const getEditorValueAC = (val) => {
    setHtmlCodeAC(val);
  };

  const VendorSchema = Yup.object().shape({
    // sprint: Yup.string().required("sprint is required"),
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
                    description: "",
                    ac: "",
                    text: "",
                    tasks: [],
                  }}
                  validationSchema={VendorSchema}
                  onSubmit={(values, { setSubmitting }) => {
                    saveData(values);
                    setSubmitting(false);
                  }}
                >
                  {({ touched, errors, isSubmitting, values }) => (
                    <Form id="create-story-form">
                      <Grid container>
                        {/* type */}
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                          <div
                            className="form-group"
                            style={{ marginLeft: 10, marginTop: 10 }}
                          >
                            <label htmlFor="issue-type-button" className="my-2">
                              Issue Type <span className="text-danger">*</span>
                            </label>
                            <Field
                              as="select"
                              name="type"
                              id="issue-type-button"
                              component="select"
                              className={`form-control text-muted ${
                                touched.type && errors.type ? "is-invalid" : ""
                              }`}
                              style={{ marginRight: 10, padding: 9 }}
                            >
                              <option value="">-- Please select --</option>
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
                            <label htmlFor="title" className="my-2">
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
                            <label htmlFor="title" className="my-2">
                              Summary <span className="text-danger">*</span>
                            </label>
                            <Field
                              type="text"
                              name="title"
                              id="story-summery"
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
                            <label htmlFor="title" className="my-2">
                              Choose Priority{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <Field
                              name="priority"
                              component="select"
                              id="story-priority"
                              className={`form-control text-muted ${
                                touched.priority && errors.priority
                                  ? "is-invalid"
                                  : ""
                              }`}
                              style={{ marginRight: 10, padding: 9 }}
                            >
                              <option value="">-- Please select --</option>
                              <option value="blocker">Blocker</option>
                              <option value="critical">Critical</option>
                              <option value="high">High</option>
                              <option value="medium">Medium</option>
                              <option value="low">Low</option>
                            </Field>
                          </div>
                        </Grid>

                        {/* Description */}
                        {/* <Grid item lg={12} md={12} sm={12} xs={12}>
                          <div
                            className="form-group"
                            style={{ marginLeft: 10, marginTop: 10 }}
                          >
                            <label htmlFor="title" className="my-2">
                              Description <span className="text-danger">*</span>
                            </label>
                            <TextEditor
                              id="story-description"
                              name="description"
                              label="Description"
                              tip="Describe the project in as much detail as you'd like."
                              value={htmlCode}
                              onChange={getEditorValue}
                            />
                          </div>
                        </Grid> */}
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                          <div
                            className="form-group"
                            style={{ marginLeft: 10, marginTop: 10 }}
                          >
                            <label htmlFor="description" className="my-2">
                              Description <span className="text-danger">*</span>
                            </label>
                            <Field
                              type="text"
                              name="description"
                              id="story-summery"
                              autoComplete="flase"
                              placeholder="Enter description"
                              className={`form-control text-muted ${
                                touched.description && errors.description
                                  ? "is-invalid"
                                  : ""
                              }`}
                              style={{ marginRight: 10, padding: 9 }}
                            />
                          </div>
                        </Grid>
                        {/* Acceptance criteria*/}
                        {/* <Grid item lg={12} md={12} sm={12} xs={12}>
                          <div
                            className="form-group"
                            style={{ marginLeft: 10, marginTop: 10 }}
                          >
                            <label htmlFor="title" className="my-2">
                              Acceptance criteria{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <TextEditor
                              name="ac"
                              label="ac"
                              tip="Describe the project in as much detail as you'd like."
                              value={htmlCodeAC}
                              onChange={getEditorValueAC}
                            />
                          </div>
                        </Grid> */}
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                          <div
                            className="form-group"
                            style={{ marginLeft: 10, marginTop: 10 }}
                          >
                            <label htmlFor="ac" className="my-2">
                              Acceptance criteria{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <Field
                              type="text"
                              name="ac"
                              id="story-summery"
                              autoComplete="flase"
                              placeholder="Enter description"
                              className={`form-control text-muted ${
                                touched.ac && errors.ac ? "is-invalid" : ""
                              }`}
                              style={{ marginRight: 10, padding: 9 }}
                            />
                          </div>
                        </Grid>
                        {/* Story point */}
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                          <div
                            className="form-group"
                            style={{ marginLeft: 10, marginTop: 10 }}
                          >
                            <label htmlFor="title" className="my-2">
                              Story point{" "}
                            </label>

                            <Field
                              type="number"
                              id="storypointdata"
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
                              tickets={tickets}
                              onchangeEpicStoryHandler={
                                onchangeEpicStoryHandler
                              }
                            />
                          </div>
                        </Grid>
                        {/* tasks */}
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                          <div
                            className="form-group"
                            style={{ marginLeft: 10, marginTop: 10 }}
                          >
                            <label htmlFor="title" className="my-2">
                              Add tasks{" "}
                            </label>
                            <FieldArray
                              name="tasks"
                              render={(arrayHelpers) => (
                                <div>
                                  {values.tasks && values.tasks.length > 0 ? (
                                    values.tasks.map((attribut, index) => (
                                      <div
                                        style={{
                                          border: "1px solid #c7c9cc",
                                          borderRadius: 5,
                                          padding: 12,
                                          marginTop: 15,
                                        }}
                                        key={index}
                                      >
                                        <DeleteOutlineIcon
                                          onClick={() =>
                                            arrayHelpers.remove(index)
                                          }
                                          sx={{ color: pink[500] }}
                                          style={{
                                            marginBottom: 10,
                                            float: "right",
                                            cursor: "pointer",
                                          }}
                                        />
                                        <Grid container>
                                          <Grid
                                            item
                                            lg={5}
                                            md={5}
                                            sm={12}
                                            xs={12}
                                            style={{ marginRight: 20 }}
                                          >
                                            <Field
                                              name={`tasks.${index}.trait_type`}
                                              autoComplete="flase"
                                              placeholder="Task Title"
                                              className={`form-control text-muted `}
                                              style={{
                                                marginTop: 10,
                                                padding: 9,
                                              }}
                                            />
                                          </Grid>
                                          <Grid
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                          >
                                            <Field
                                              name={`tasks.${index}.value`}
                                              autoComplete="flase"
                                              placeholder="Enter description"
                                              className={`form-control text-muted`}
                                              style={{
                                                marginTop: 10,
                                                padding: 9,
                                              }}
                                            />
                                          </Grid>
                                        </Grid>
                                      </div>
                                    ))
                                  ) : (
                                    <Button
                                      variant="outlined"
                                      size="medium"
                                      type="button"
                                      onClick={() => arrayHelpers.push("")}
                                    >
                                      {/* show this when user has removed all tasks from the list */}
                                      Add tasks
                                    </Button>
                                  )}
                                  {values.tasks.length !== 0 && (
                                    <Button
                                      variant="outlined"
                                      size="medium"
                                      type="button"
                                      onClick={() =>
                                        arrayHelpers.insert(
                                          values.tasks.length + 1,
                                          ""
                                        )
                                      }
                                      style={{
                                        marginTop: 10,
                                      }}
                                    >
                                      + Add
                                    </Button>
                                  )}
                                </div>
                              )}
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
                                id="story-submit-button"
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
