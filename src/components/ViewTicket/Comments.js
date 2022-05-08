/* eslint-disable array-callback-return */
import React, { useState, useEffect, useContext } from "react";
import { Formik, Form } from "formik";
// import * as Yup from "yup";
import { Card, Grid } from "@mui/material";
import { _transction, _fetch } from "../../CONTRACT-ABI/connect";
import TransctionModal from "../shared/TransctionModal";
import TextEditor from "../UI/TextEditor";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { addTicketTracking } from "../../functions/TicketTracking";
import { decode } from "js-base64";
import CommentList from "./CommentList";
import { AccountContext } from "../../App";

// const VendorSchema = Yup.object().shape({
//   name: Yup.string().required("Name is required"),
//   authorname: Yup.string().required("Authorname is required"),
//   price: Yup.string().required("Price is required"),
//   royelty: Yup.string().required("Royelty amount is required"),
// });

const UpadteTicket = ({ tokenId }) => {
  const [start, setStart] = useState(false);
  const [response, setResponse] = useState(null);
  const [ticketindex, setTicketindex] = useState(null);

  const [htmlCode, setHtmlCode] = useState(null);
  const [tickets, setTickets] = useState(null);

  const [loading, setLoading] = useState(false);
  const [currentABI, setCurrentABI] = useState(false);
  const { account } = useContext(AccountContext);

  const getData = async () => {
    // setLoading(true);
    const allTickets = await _fetch("getAllTickets");
    const filterTicketsForCurrentUser = await allTickets.find(
      (ticket) => ticket.id === tokenId
    );
    setTickets(filterTicketsForCurrentUser);
    setTicketindex(filterTicketsForCurrentUser.index);
  };

  const saveData = async () => {
    setStart(true);
    setLoading(true);
    let tempComment;
    if (tickets?.comments) {
      tempComment = JSON.parse(tickets?.comments);
    } else {
      tempComment = [];
    }

    tempComment.push(
      JSON.stringify({
        comments: htmlCode,
        uid: decode(localStorage.getItem("uid")),
        time: new Date(),
      })
    );

    const trackingString = await addTicketTracking(
      `<div class="track-div"><img class="track-img-profile" src="${account.profileImg}" height="30px" width="30px" style="border-radius: 50%; margin:5px" /> <b>${account.name}</b> commented on this ticket </div>`,
      ticketindex
    );

    const responseData = await _transction(
      "setComments",
      JSON.stringify(tempComment),
      ticketindex,
      trackingString
    );
    getData();
    setHtmlCode("");
    setResponse(responseData);
    setLoading(false);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getEditorValue = (val) => {
    setHtmlCode(val);
  };

  const modalClose = () => {
    setStart(false);
    setResponse(null);
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
        <h4> Comments</h4>
        {!loading && (
          <>
            <CommentList tickets={tickets} />

            <Formik
              initialValues={{
                description: "",
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
                    {/* Description */}
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <div
                        className="form-group"
                        style={{ marginLeft: 10, marginTop: 10 }}
                      >
                        <label for="title" className="my-2">
                          Add Comments <span className="text-danger">*</span>
                        </label>

                        <TextEditor
                          name="description"
                          label="Description"
                          tip="Describe the project in as much detail as you'd like."
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
          </>
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
