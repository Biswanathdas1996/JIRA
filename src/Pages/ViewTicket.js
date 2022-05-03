import React, { useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
// import * as Yup from "yup";
import { Card, Grid } from "@mui/material";
import { _transction } from "../CONTRACT-ABI/connect";
import { create } from "ipfs-http-client";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Switch from "@mui/material/Switch";
import DeleteOutlineIcon from "@mui/icons-material/Delete";
import uuid from "uuid/v4";
import { pink } from "@mui/material/colors";
import TransctionModal from "../components/shared/TransctionModal";
import { useParams } from "react-router-dom";
import { _fetch } from "../CONTRACT-ABI/connect";

const web3 = new Web3(window.ethereum);

const client = create("https://ipfs.infura.io:5001/api/v0");

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
  const [file, setFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [checked, setChecked] = useState(false);
  const [description, setDescription] = useState(null);
  const [tickets, setTickets] = useState(null);
  const { tokenId } = useParams();

  let history = useNavigate();

  const getData = async () => {
    const allTickets = await _fetch("getAllTickets");

    const filterTicketsForCurrentUser = await allTickets.find(
      (ticket) => ticket.id === tokenId
    );
    console.log(filterTicketsForCurrentUser);

    if (filterTicketsForCurrentUser?.abiLink) {
      await fetch(filterTicketsForCurrentUser?.abiLink)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setTickets({ ...data, ...filterTicketsForCurrentUser });
          console.log(data);
        });
    }
  };

  const saveData = async ({ title, type, priority, storypoint }) => {
    setStart(true);
    let responseData;
    const id = uuid();
    if (file) {
      const results = await await client.add(file);
      console.log("--img fingerpring-->", results.path);
      const metaData = {
        id: id,
        name: title,
        type: type,
        priority: priority,
        storypoint: storypoint,
        image: `https://ipfs.infura.io/ipfs/${results.path}`,
        description: description,
      };

      const resultsSaveMetaData = await await client.add(
        JSON.stringify(metaData)
      );
      console.log("---metadta-->", resultsSaveMetaData.path);

      responseData = await _transction(
        "createTicket",
        id,
        `https://ipfs.infura.io/ipfs/${resultsSaveMetaData.path}`,
        "0x9A135C4d43b9fc6c4d5669d29e6442D7702F841c"
      );
    }
    setResponse(responseData);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
    setSelectedFile(event.target.files[0]);
  };

  const modalClose = () => {
    setStart(false);
    setResponse(null);
    history("/");
  };

  console.log("=-=-=-=", tickets);
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
                      <h4>Create Story</h4>
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
                          console.log("values=======>", values);
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
                                    Choose Type{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <Field
                                    name="type"
                                    component="select"
                                    className={`form-control text-muted ${
                                      touched.type && errors.type
                                        ? "is-invalid"
                                        : ""
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
                                    Description{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={3}
                                    name="text"
                                    onChange={(e) =>
                                      setDescription(e.target.value)
                                    }
                                    placeholder="Minimum 3 rows"
                                    style={{ width: "100%" }}
                                    className={`form-control text-muted ${
                                      touched.text && errors.text
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                  />
                                </div>
                              </Grid>
                              {/* Image */}
                              <Grid item lg={12} md={12} sm={12} xs={12}>
                                <div
                                  className="form-group"
                                  style={{ marginLeft: 10, marginTop: 10 }}
                                >
                                  <label for="title" className="my-2">
                                    Choose file{" "}
                                    <span className="text-danger">*</span>
                                  </label>

                                  <input
                                    className={`form-control text-muted`}
                                    type="file"
                                    onChange={onFileChange}
                                  />

                                  {selectedFile && (
                                    <center>
                                      <img
                                        src={preview}
                                        alt="img"
                                        style={{
                                          marginTop: 20,
                                          height: 300,
                                          width: "auto",
                                        }}
                                      />
                                    </center>
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
                                      value={"Submit"}
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
export default Mint;
