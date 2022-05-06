import React, { useState, useContext } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Card, Grid } from "@mui/material";
import { _fetch } from "../../src/CONTRACT-ABI/connect";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import TransctionModal from "../components/shared/TransctionModal";
import { encode } from "js-base64";
import { AccountContext } from "../App";

const VendorSchema = Yup.object().shape({
  uid: Yup.string().required("uid is required"),
});

const Register = () => {
  const [start, setStart] = useState(false);

  const { fetchUserData } = useContext(AccountContext);

  let history = useNavigate();

  const saveData = async ({ uid }) => {
    validateUser(uid);
  };

  const validateUser = async (uid) => {
    setStart(true);
    const isValidate = await _fetch("login", uid);
    setStart(false);
    if (isValidate) {
      localStorage.setItem("uid", encode(uid));
      fetchUserData();
      history("/");
    } else {
      swal("Sorry!", "Please check your privet key!", "error");
    }
  };

  return (
    <>
      {start && <TransctionModal response={null} modalClose={() => null} />}
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item lg={3} md={3} sm={12} xs={12}></Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <div style={{ margin: 20 }}>
            <Card
              style={{
                padding: "20px",
                background: "white",
              }}
            >
              <h4>Login</h4>
              <Formik
                initialValues={{
                  uid: "",
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
                      {/* // Title */}
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <div
                          className="form-group"
                          style={{ marginLeft: 10, marginTop: 10 }}
                        >
                          <label htmlFor="title" className="my-2">
                            Privet Key <span className="text-danger">*</span>
                          </label>
                          <Field
                            type="text"
                            name="uid"
                            autoComplete="flase"
                            placeholder="Enter uid"
                            className={`form-control text-muted ${
                              touched.uid && errors.uid ? "is-invalid" : ""
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
                              value={"Login"}
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
        <Grid item lg={3} md={3} sm={12} xs={12}></Grid>
      </Grid>
    </>
  );
};
export default Register;
