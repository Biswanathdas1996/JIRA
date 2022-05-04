import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
// import * as Yup from "yup";
import { Card, Grid } from "@mui/material";
import { _transction, _account } from "../../src/CONTRACT-ABI/connect";
import { create } from "ipfs-http-client";
import { useNavigate } from "react-router-dom";
import uuid from "uuid/v4";
import TransctionModal from "../components/shared/TransctionModal";
import TextEditor from "../components/UI/TextEditor";
import { IPFSLink, IpfsViewLink } from "../config";

const client = create(IPFSLink);

// const VendorSchema = Yup.object().shape({
//   name: Yup.string().required("Name is required"),
//   authorname: Yup.string().required("Authorname is required"),
//   price: Yup.string().required("Price is required"),
//   royelty: Yup.string().required("Royelty amount is required"),
// });
// WCVDU52748WW4F7EKDEDB89HKH41BIA4N2

const Mint = () => {
  const [start, setStart] = useState(false);
  const [response, setResponse] = useState(null);
  const [htmlCode, setHtmlCode] = useState(null);
  const [account, setAccount] = useState(null);

  let history = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const account = await _account();
    setAccount(account);
  }
  const saveData = async ({ title, type, priority, storypoint }) => {
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
    responseData = await _transction(
      "createTicket",
      id,
      IpfsViewLink(resultsSaveMetaData.path),
      account
    );
    setResponse(responseData);
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
              <Formik
                initialValues={{
                  title: "",
                  type: "",
                  priority: "",
                  storypoint: "",
                  text: "",
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
                          <TextEditor
                            name="description"
                            label="Description"
                            tip="Describe the project in as much detail as you'd like."
                            value={htmlCode}
                            onChange={getEditorValue}
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
            </Card>
          </div>
        </Grid>
        <Grid item lg={2} md={2} sm={12} xs={12}></Grid>
      </Grid>
    </>
  );
};
export default Mint;
