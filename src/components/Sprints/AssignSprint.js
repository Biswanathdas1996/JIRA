/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import { Formik, Form, Field } from "formik";
// import * as Yup from "yup";
import { Card, Grid } from "@mui/material";
import { _transction, _fetch } from "../../CONTRACT-ABI/connect";
import { create } from "ipfs-http-client";
import { useNavigate } from "react-router-dom";
import TransctionModal from "../shared/TransctionModal";

import _ from "lodash";
import { IPFSLink, IpfsViewLink } from "../../config";
import { mapSingleTicketData } from "../../functions/index";
import { addTicketTracking } from "../../functions/TicketTracking";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

import { AccountContext } from "../../App";
const client = create(IPFSLink);

const TransferTicket = ({ index, item, getData, sprints }) => {
  const [start, setStart] = useState(false);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const { account } = useContext(AccountContext);
  let history = useNavigate();

  const saveData = async ({ sprintId }) => {
    setStart(true);

    const trackingString = await addTicketTracking(
      `<div class="track-div">Ticket added to Sprint-${sprintId} <img class="track-img-profile" style="border-radius: 50%; margin:5px;" src="${account.profileImg}" height="30px" width="30px" /> <b>${account.name}</b></div>`,
      item?.index
    );

    const responseData = await _transction(
      "setSprintToTicket",
      sprintId,
      item?.index,
      trackingString
    );

    setResponse(responseData);
  };

  const modalClose = () => {
    setStart(false);
    setResponse(null);
    window.location.reload();
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
        {!loading && (
          <Formik
            initialValues={{
              sprintId: "",
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
                        Assign sprint <span className="text-danger">*</span>
                      </label>
                      <Field
                        name="sprintId"
                        component="select"
                        className={`form-control text-muted ${
                          touched.sprintId && errors.sprintId
                            ? "is-invalid"
                            : ""
                        }`}
                        style={{ marginRight: 10, padding: 9 }}
                      >
                        <option>-- Please select --</option>
                        {sprints?.map((sprint) => {
                          return (
                            <option value={sprint?.id}>
                              Sprint - {sprint?.id}{" "}
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
                          value={"Assign"}
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
export default TransferTicket;
