/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import { Formik, Form, Field } from "formik";
// import * as Yup from "yup";
import { Card, Grid } from "@mui/material";
import { _transction, _fetch } from "../../CONTRACT-ABI/connect";
import { useNavigate } from "react-router-dom";
import TransctionModal from "../shared/TransctionModal";
import _ from "lodash";
import { mapSingleTicketData } from "../../functions/index";
import { addTicketTracking } from "../../functions/TicketTracking";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { AccountContext } from "../../App";

import { createAnduploadFileToIpfs } from "../../utils/ipfs";

// const VendorSchema = Yup.object().shape({
//   name: Yup.string().required("Name is required"),
//   authorname: Yup.string().required("Authorname is required"),
//   price: Yup.string().required("Price is required"),
//   royelty: Yup.string().required("Royelty amount is required"),
// });

const TransferTicket = ({ item, getData, totalUserCount, users }) => {
  const [start, setStart] = useState(false);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const { account } = useContext(AccountContext);
  let history = useNavigate();

  const saveData = async ({ receiver }) => {
    setStart(true);

    const getSenderCurrentABI = await _fetch("users", receiver);

    await fetch(getSenderCurrentABI?.boardData)
      .then((response) => response.json())
      .then(async (senderData) => {
        senderData[1].items.push(mapSingleTicketData(item));

        const resultsSaveMetaData = await createAnduploadFileToIpfs(senderData);

        const trackingString = await addTicketTracking(
          `<div class="track-div">Ticket <b style="color:green;">assigned</b> to <img class="track-img-profile" src="${getSenderCurrentABI.profileImg}" height="30px" width="30px" style="border-radius: 50%; margin:5px" /> <b>${getSenderCurrentABI.name}</b> by <img class="track-img-profile" style="border-radius: 50%; margin:5px;" src="${account.profileImg}" height="30px" width="30px" /> <b>${account.name}</b></div>`,
          item?.index
        );

        const responseData = await _transction(
          "assignOwner",
          receiver,
          item?.index,
          resultsSaveMetaData.link,
          trackingString
        );

        setResponse(responseData);
      });
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
          <h4> Assign</h4>

          {/* <Button type="button" onClick={() => getData()}>
            Refresh
          </Button> */}
        </div>

        {!loading && (
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
