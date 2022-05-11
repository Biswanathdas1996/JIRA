import React, { useEffect, useState } from "react";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import { Card, Grid } from "@mui/material";
import { _transction, _fetch } from "../../CONTRACT-ABI/connect";
import { create } from "ipfs-http-client";
import { IPFSLink, IpfsViewLink } from "../../config";
import { Button } from "@mui/material";
import Editor from "./Editor";
import _ from "lodash";
import TransctionModal from "../../components/shared/TransctionModal";

const DummyData = {
  id: "root",
  name: "Parent",
  children: [
    {
      id: "1",
      name: "Page 1",
      confluence:
        "https://ipfs.infura.io/ipfs/QmcEZBh1dMzxF7suxBL4oB8ZV32cndhhur8cadc6bMzAGa",
    },
    {
      id: "3",
      name: "Geoup",
      children: [
        {
          id: "4",
          name: "Page 2",
          confluence:
            "https://ipfs.infura.io/ipfs/QmcEZBh1dMzxF7suxBL4oB8ZV32cndhhur8cadc6bMzAGa",
        },
      ],
    },
  ],
};

const client = create(IPFSLink);

export default function RichObjectTreeView() {
  const [start, setStart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [treeData, setTreedata] = useState({});
  const [selectedNode, setSelectedNode] = useState(null);
  const [htmlCodeAC, setHtmlCodeAC] = useState(null);
  const [defaultEditorValue, setDefaultEditorValue] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const alltreeDataAbi = await _fetch("confluence");

    await fetch(alltreeDataAbi)
      .then((response) => response.json())
      .then((receiverData) => {
        setTreedata(receiverData);
      });

    setLoading(false);
  };

  const SaveData = async () => {
    setStart(true);
    const htmlCodeACABI = await client.add(htmlCodeAC);

    const result = _.cloneDeepWith(treeData, (value) => {
      const newObj = {
        id: selectedNode?.id,
        name: selectedNode?.name,
        confluence: IpfsViewLink(htmlCodeACABI.path),
      };
      return value.id === selectedNode?.id ? { ...value, ...newObj } : _.noop();
    });
    console.log("----result----->", result);

    // const metaData = treeData || DummyData;
    const resultsSaveMetaData = await client.add(JSON.stringify(result));
    const responseData = await _transction(
      "addConfluence",
      IpfsViewLink(resultsSaveMetaData.path)
    );
    setResponse(responseData);
  };

  const onNodeClick = (node) => {
    if (!node?.children) {
      console.log("-------->", node);
      setSelectedNode(node);
      setDefaultEditorValue(
        node?.confluence ||
          `https://ipfs.infura.io/ipfs/QmcEZBh1dMzxF7suxBL4oB8ZV32cndhhur8cadc6bMzAGa`
      );
    }
  };

  const getEditorValueAC = (val) => {
    console.log(val);
    setHtmlCodeAC(val);
  };

  // console.log(selectedNode);

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={nodes.name}
      onClick={() => onNodeClick(nodes)}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  const modalClose = () => {
    setStart(false);
    setResponse(null);
  };

  return (
    <>
      {start && <TransctionModal response={response} modalClose={modalClose} />}

      <Grid container style={{ padding: 20 }}>
        <Grid item lg={3} md={3} sm={12} xs={12}>
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
            />
          )}
          <br />
          <Button variant="contained" onClick={() => SaveData()}>
            Save
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
