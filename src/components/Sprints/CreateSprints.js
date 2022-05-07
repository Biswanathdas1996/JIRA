import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
// import * as Yup from "yup";
import { Card, Grid } from "@mui/material";
import TransctionModal from "../shared/TransctionModal";
import { _transction } from "../../CONTRACT-ABI/connect";

// const VendorSchema = Yup.object().shape({
//   name: Yup.string().required("Name is required"),
//   authorname: Yup.string().required("Authorname is required"),
//   price: Yup.string().required("Price is required"),
//   royelty: Yup.string().required("Royelty amount is required"),
// });

const CreateSprint = ({ fetchAllSprints }) => {
  const [start, setStart] = useState(false);
  const [response, setResponse] = useState(null);

  const saveData = async ({ title, startdate, enddate }) => {
    setStart(true);
    let responseData;

    responseData = await _transction(
      "createSprint",
      title,
      startdate,
      enddate,
      ""
    );
    setResponse(responseData);
    fetchAllSprints();
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
        <h4>Create Sprint</h4>
        <Formik
          initialValues={{
            title: "",
            startdate: "",
            enddate: "",
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
                {/* summary */}
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <div
                    className="form-group"
                    style={{ marginLeft: 10, marginTop: 10 }}
                  >
                    <label htmlFor="title" className="my-2">
                      Name <span className="text-danger">*</span>
                    </label>
                    <Field
                      type="text"
                      name="title"
                      autoComplete="flase"
                      placeholder="Enter name"
                      className={`form-control text-muted ${
                        touched.title && errors.title ? "is-invalid" : ""
                      }`}
                      style={{ marginRight: 10, padding: 9 }}
                    />
                  </div>
                </Grid>
                {/* star date */}
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <div
                    className="form-group"
                    style={{ marginLeft: 10, marginTop: 10 }}
                  >
                    <label htmlFor="title" className="my-2">
                      Start Date <span className="text-danger">*</span>
                    </label>
                    <Field
                      type="date"
                      name="startdate"
                      autoComplete="flase"
                      placeholder="Enter name"
                      className={`form-control text-muted ${
                        touched.startdate && errors.startdate
                          ? "is-invalid"
                          : ""
                      }`}
                      style={{ marginRight: 10, padding: 9 }}
                    />
                  </div>
                </Grid>
                {/* end date */}
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <div
                    className="form-group"
                    style={{ marginLeft: 10, marginTop: 10 }}
                  >
                    <label htmlFor="title" className="my-2">
                      End Date <span className="text-danger">*</span>
                    </label>
                    <Field
                      type="date"
                      name="enddate"
                      autoComplete="flase"
                      placeholder="Enter name"
                      className={`form-control text-muted ${
                        touched.enddate && errors.enddate ? "is-invalid" : ""
                      }`}
                      style={{ marginRight: 10, padding: 9 }}
                    />
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
    </>
  );
};
export default CreateSprint;
