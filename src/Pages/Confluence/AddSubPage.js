/* eslint-disable array-callback-return */
import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Card, Grid } from "@mui/material";
import Button from "@mui/material/Button";

const VendorSchema = Yup.object().shape({
  title: Yup.string().required("Name is required"),
});

const AddSubPage = ({ addSubPage, treeData, setAddNewPage }) => {
  return (
    <>
      <Card
        style={{
          padding: "20px",
          background: "white",
          marginTop: 20,
        }}
      >
        <Formik
          initialValues={{
            title: "",
            parentDoc: "",
          }}
          validationSchema={VendorSchema}
          onSubmit={(values, { setSubmitting }) => {
            addSubPage(values);
            setSubmitting(false);
          }}
        >
          {({ touched, errors, isSubmitting, values }) => (
            <Form>
              <Grid container>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <div
                    className="form-group"
                    style={{ marginLeft: 10, marginTop: 10 }}
                  >
                    <label htmlFor="title" className="my-2">
                      Choose Document <span className="text-danger">*</span>
                    </label>
                    <Field
                      name="parentDoc"
                      component="select"
                      id="story-parentDoc"
                      className={`form-control text-muted ${
                        touched.parentDoc && errors.parentDoc
                          ? "is-invalid"
                          : ""
                      }`}
                      style={{ marginRight: 10, padding: 9 }}
                    >
                      <option value="">-- Please select --</option>
                      {treeData?.children.map((data) => {
                        if (Array.isArray(data?.children)) {
                          return <option value={data?.id}>{data?.name}</option>;
                        }
                      })}
                    </Field>
                  </div>
                </Grid>
                {/* summary */}
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <div
                    className="form-group"
                    style={{ marginLeft: 10, marginTop: 10 }}
                  >
                    <label htmlFor="title" className="my-2">
                      Page name <span className="text-danger">*</span>
                    </label>
                    <Field
                      type="text"
                      name="title"
                      autoComplete="flase"
                      placeholder="Enter page name"
                      className={`form-control text-muted ${
                        touched.title && errors.title ? "is-invalid" : ""
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
                    <Button
                      variant="outlined"
                      style={{ marginRight: 10 }}
                      onClick={() => setAddNewPage(false)}
                    >
                      Cancel
                    </Button>
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
export default AddSubPage;
