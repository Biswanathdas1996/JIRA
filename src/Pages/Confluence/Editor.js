import React, { useEffect, useState } from "react";
import TextEditor from "../../components/UI/TextEditor";
import Loader from "../../components/shared/Loader";
import { Button } from "@mui/material";
import Stack from "@mui/material/Stack";
import { Card } from "@mui/material";

export default function RichObjectTreeView({
  abilink,
  getEditorValueAC,
  SaveData,
}) {
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  const [defaultEditorValue, setDefaultEditorValue] = useState(null);

  useEffect(() => {
    fetchData(abilink);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abilink]);

  const fetchData = async (abilinkData) => {
    setLoading(true);
    setDefaultEditorValue(null);
    await fetch(abilinkData)
      .then((response) => response.text())
      .then((receiverData) => {
        setDefaultEditorValue(receiverData);
      });

    setLoading(false);
  };

  return (
    <>
      {!loading && !update && defaultEditorValue && (
        <>
          <a href={abilink} target="_blank" rel="noreferrer">
            {" "}
            View Page
          </a>

          <Button
            variant="contained"
            onClick={() => setUpdate(true)}
            style={{ marginBottom: 20, float: "right" }}
          >
            Update
          </Button>
          <Card style={{ width: "100%", overflowX: "auto", padding: 10 }}>
            <div dangerouslySetInnerHTML={{ __html: defaultEditorValue }}></div>
          </Card>
        </>
      )}

      {update && (
        <>
          <TextEditor
            name="ac"
            label="ac"
            tip="Describe the project in as much detail as you'd like."
            defaultValue={defaultEditorValue}
            onChange={getEditorValueAC}
          />
          <Stack
            spacing={2}
            direction="row"
            style={{ marginTop: 20, float: "right" }}
          >
            <Button variant="outlined" onClick={() => setUpdate(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={() => SaveData()}>
              Save
            </Button>
          </Stack>
        </>
      )}

      {loading && <Loader count="1" xs={12} sm={12} md={12} lg={12} />}
    </>
  );
}
