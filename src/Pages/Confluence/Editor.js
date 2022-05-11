import React, { useEffect, useState } from "react";
import TextEditor from "../../components/UI/TextEditor";

export default function RichObjectTreeView({ abilink, getEditorValueAC }) {
  const [loading, setLoading] = useState(false);
  const [htmlCodeAC, setHtmlCodeAC] = useState(null);
  const [defaultEditorValue, setDefaultEditorValue] = useState(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setLoading(true);

    await fetch(abilink)
      .then((response) => response.text())
      .then((receiverData) => {
        console.log("receiverData---->", receiverData);
        setDefaultEditorValue(receiverData);
      });

    setLoading(false);
  };

  return (
    <>
      {defaultEditorValue && (
        <TextEditor
          name="ac"
          label="ac"
          tip="Describe the project in as much detail as you'd like."
          value={htmlCodeAC}
          defaultValue={defaultEditorValue}
          onChange={getEditorValueAC}
        />
      )}
    </>
  );
}
