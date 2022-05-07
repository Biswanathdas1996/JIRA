import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Card, Grid } from "@mui/material";
import TransctionModal from "../shared/TransctionModal";
import { _transction } from "../../CONTRACT-ABI/connect";

const VendorSchema = Yup.object().shape({
  title: Yup.string().required("Name is required"),
});

const CreateSprint = ({ fetchAllSprints }) => {
  const [start, setStart] = useState(false);
  const [response, setResponse] = useState(null);

  const saveData = async ({ title }) => {
    setStart(true);
    let responseData;

    responseData = await _transction("createSprint", title, "", "", "");
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
