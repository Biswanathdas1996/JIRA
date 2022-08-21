import React, { useEffect, useState, useContext } from "react";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import { Card, Grid } from "@mui/material";
import { _transction, _fetch } from "../../CONTRACT-ABI/connect";
import Editor from "./Editor";
import _ from "lodash";
import TransctionModal from "../../components/shared/TransctionModal";
import uuid from "uuid/v4";
import AddNewParent from "./AddNewParent";
import AddSubPage from "./AddSubPage";
import Loader from "../../components/shared/Loader";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { AccountContext } from "../../App";

import { createAnduploadFileToIpfs } from "../../utils/ipfs";

const sampleConfluence = `https://ipfs.infura.io/ipfs/QmcEZBh1dMzxF7suxBL4oB8ZV32cndhhur8cadc6bMzAGa`;

export default function RichObjectTreeView() {
  const [start, setStart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [treeData, setTreedata] = useState({});
  const [selectedNode, setSelectedNode] = useState(null);
  const [htmlCodeAC, setHtmlCodeAC] = useState(null);
  const [defaultEditorValue, setDefaultEditorValue] = useState(null);

  const [addNewDoc, setAddNewDoc] = useState(false);
  const [addNewPage, setAddNewPage] = useState(false);

  const { projectData } = useContext(AccountContext);

  const DummyData = {
    id: "root",
    name: `${projectData?.projectName}`,
    children: [],
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const alltreeDataAbi = await _fetch("confluence");

    if (alltreeDataAbi && alltreeDataAbi !== "") {
      await fetch(alltreeDataAbi)
        .then((response) => response.json())
        .then((receiverData) => {
          setTreedata(receiverData);
        });
    } else {
      setTreedata(DummyData);
    }

    setLoading(false);
  };

  const SaveData = async () => {
    setStart(true);
    let htmlCodeABILInk;
    if (htmlCodeAC) {
      const htmlCodeACABI = await createAnduploadFileToIpfs(htmlCodeAC);
      htmlCodeABILInk = htmlCodeACABI.link;
    } else {
      htmlCodeABILInk = selectedNode?.confluence;
    }

    const result = _.cloneDeepWith(treeData, (value) => {
      const newObj = {
        id: selectedNode?.id,
        name: selectedNode?.name,
        confluence: htmlCodeABILInk,
      };
      return value.id === selectedNode?.id ? { ...value, ...newObj } : _.noop();
    });
    const resultsSaveMetaData = await createAnduploadFileToIpfs(result);
    const responseData = await _transction(
      "addConfluence",
      resultsSaveMetaData.link
    );
    setResponse(responseData);
  };

  const getEditorValueAC = (val) => {
    console.log(val);
    setHtmlCodeAC(val);
  };

  const modalClose = () => {
    setStart(false);
    setResponse(null);
    fetchData();
  };

  const addParent = async (title) => {
    setStart(true);
    const newDoc = {
      id: uuid(),
      name: title?.title,
      children: [],
    };
    treeData?.children.push(newDoc);
    console.log(treeData);

    const resultsSaveMetaData = await createAnduploadFileToIpfs(treeData);
    const responseData = await _transction(
      "addConfluence",
      resultsSaveMetaData.link
    );
    setAddNewDoc(false);
    setResponse(responseData);
  };

  const addSubPage = async (values) => {
    setStart(true);
    console.log("addSubPage", values);
    console.log("treeData", treeData);
    const findUpdateableDoc = treeData.children.find(
      (data) => data.id.toString() === values?.parentDoc.toString()
    );
    findUpdateableDoc?.children.push({
      id: uuid(),
      name: values?.title,
      confluence: sampleConfluence,
    });

    const resultsSaveMetaData = await createAnduploadFileToIpfs(treeData);
    const responseData = await _transction(
      "addConfluence",
      resultsSaveMetaData.link
    );
    setAddNewPage(false);
    setResponse(responseData);
  };

  const onNodeClick = (node) => {
    if (!node?.children) {
      setSelectedNode(node);
      setDefaultEditorValue(node?.confluence || sampleConfluence);
    }
  };

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={nodes.name}
      onClick={() => onNodeClick(nodes)}
      style={
        !Array.isArray(nodes.children) ? { color: "red" } : { color: "#1976d2" }
      }
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  const addPageUI = () => {
    return (
      <>
        {addNewDoc && (
          <AddNewParent addParent={addParent} setAddNewDoc={setAddNewDoc} />
        )}
        {addNewPage && treeData?.children?.length > 0 && (
          <AddSubPage
            addSubPage={addSubPage}
            treeData={treeData}
            setAddNewPage={setAddNewPage}
          />
        )}
      </>
    );
  };
  return (
    <>
      {start && <TransctionModal response={response} modalClose={modalClose} />}

      {!loading && (
        <Grid container style={{ padding: 20 }}>
          <Grid item lg={3} md={3} sm={12} xs={12}>
            <Stack spacing={2} direction="row">
              <Button variant="contained" onClick={() => setAddNewDoc(true)}>
                Add Document
              </Button>
              <Button variant="outlined" onClick={() => setAddNewPage(true)}>
                Add Page
              </Button>
            </Stack>
            {addPageUI()}
            <br />
            <Card>
              <TreeView
                aria-label="rich object"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpanded={["root"]}
                defaultExpandIcon={<ChevronRightIcon />}
              >
                {renderTree(treeData)}
              </TreeView>
            </Card>
          </Grid>
          <Grid item lg={8} md={8} sm={12} xs={12} style={{ marginLeft: 20 }}>
            {defaultEditorValue && (
              <Editor
                abilink={defaultEditorValue}
                getEditorValueAC={getEditorValueAC}
                SaveData={SaveData}
              />
            )}
            <br />
          </Grid>
        </Grid>
      )}
      {loading && <Loader count="1" xs={12} sm={12} md={12} lg={12} />}
    </>
  );
}
