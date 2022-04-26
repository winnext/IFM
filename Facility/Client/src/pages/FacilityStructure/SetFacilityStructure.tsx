import React, { useEffect, useState } from "react";
import { Tree } from "primereact/tree";
import { v4 as uuidv4 } from "uuid";
import { ContextMenu } from "primereact/contextmenu";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { useNavigate, useParams } from "react-router-dom";
import { Chips } from 'primereact/chips';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

import FacilityStructureService from "../../services/facilitystructure";


interface ClassificationInterface {
  root:
  {
    code: string;
    children: [],
    _type: string;
    name: string;
    _id: {
      low: string;
      high: string;
    },
    key: string;
    hasParent: boolean;
    parent_id?: string;
    selectable?: boolean;
  }[];
}

interface Node {
  code: string;
  name: string;
  tag: string[];
  key: string;
  hasParent?: boolean;
  children: Node[];
  type?: string;
  parent_id?: string;
  selectable?: boolean;
  self_id: {
    low: string;
    high: string;
  },
  labelclass: string;
}

interface NodeData {
  code: string;
  createdAt: string;
  hasParent: true
  key: string;
  label: string;
  labelclass: string;
  name: string;
  self_id: {
    low: string;
    high: string;
  },
  tag: string[];
  updatedAt: string;
}

const SetClassification = () => {
  const [selectedNodeKey, setSelectedNodeKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [classification, setClassification] = useState<ClassificationInterface>({
    root: [
      {
        code: "",
        children: [],
        _type: "",
        name: "",
        _id: {
          low: "",
          high: ""
        },
        key: "",
        hasParent: false
      }
    ]
  });

  const [data, setData] = useState<Node[]>([]);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [tag, setTag] = useState<string[]>([]);
  const [addDia, setAddDia] = useState(false);
  const [editDia, setEditDia] = useState(false);
  const [delDia, setDelDia] = useState<boolean>(false);
  const toast = React.useRef<any>(null);
  const cm: any = React.useRef(null);
  const params = useParams()
  const navigate = useNavigate()
  const [nodeData, setNodeData] = useState<NodeData>({} as NodeData);


  const menu = [
    {
      label: "Add Item",
      icon: "pi pi-plus",
      command: () => {
        setAddDia(true);
      },
    },
    {
      label: "Edit Item",
      icon: "pi pi-pencil",
      command: () => {
        // findNode(selectedNodeKey);
        FacilityStructureService.nodeInfo(selectedNodeKey)
          .then((res) => {
            console.log(res.data.properties);

            setName(res.data.properties.name || "");
            setCode(res.data.properties.code || "");
            setTag(res.data.properties.tag || []);
          })
          .catch((err) => {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: err.response ? err.response.data.message : err.message,
              life: 2000,
            });
          });
        setEditDia(true);
      },
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: () => {
        setDelDia(true);
      },
    },
  ];

  const getClassification = () => {
    const id = params.id || "";
    FacilityStructureService.findOne(id).then((res) => {

      setClassification(res.data);

      if (!res.data.root[0].children) {
        setData([res.data.root[0].properties] || []);
      }
      else if (res.data.root[0].children) {
        setData([res.data.root[0]] || []);
      }
      setLoading(false);
    }).catch(err => {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.response ? err.response.data.message : err.message,
        life: 2000,
      });
      setTimeout(() => {
        navigate("/classifications")
      }, 2000)
    })
  }

  useEffect(() => {
    getClassification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const findNodeAndAddItem = (
    search: string,
    nodes: Node[]
  ): Node | undefined => {
    if (nodes.length === 0) return undefined;
    return nodes.map((node) => {
      if (node.key === search) {
        const newNode = {
          key: uuidv4(),
          parent_id: node.self_id.low,
          name: name,
          code: code,
          tag: tag,
          labelclass: node.labelclass,
        };
        // node.children = node.children ? [...node.children, newNode] : [newNode];

        FacilityStructureService.create(newNode)
          .then((res) => {
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Classification Created",
              life: 3000,
            });
            getClassification();
          })
          .catch((err) => {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: err.response ? err.response.data.message : err.message,
              life: 20000,
            });
          });

        return node;
      }
      return findNodeAndAddItem(search, node.children ? node.children : []);
    })[0];
  };

  const findNodeAndChangeItem = (
    search: string,
    nodes: Node[]
  ): Node | undefined => {

    if (nodes.length === 0) return undefined;
    return nodes.map((node) => {
      if (node.key === search) {

        const updateNode = {
          key: node.key,
          name: name,
          code: code,
          tag: tag,
          labelclass: node.labelclass,
        };

        FacilityStructureService.update(node.self_id.low, updateNode)
          .then((res) => {
            showSuccess("Saved!");
            getClassification();
          })
          .catch((err) => {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: err.response ? err.response.data.message : err.message,
              life: 2000,
            });
          });

        return node;
      }
      return findNodeAndChangeItem(search, node.children ? node.children : []);
    })[0];
  };

  const findNodeAndDelete = (
    search: string,
    nodes: Node[]
  ): Node | undefined => {
    if (nodes.length === 0) return undefined;
    return nodes.map((node) => {
      // node.children = node.children
      //   ? node.children.filter((child) => child.key !== search)
      //   : [];

      if (node.key === search) {
        if (node.hasParent === false) {
          FacilityStructureService.remove(node.self_id.low)
            .then(() => {
              toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Classification Deleted",
                life: 2000,
              });
              navigate("/classifications")
            })
            .catch((err) => {
              toast.current.show({
                severity: "error",
                summary: "Error",
                detail: err.response ? err.response.data.message : err.message,
                life: 2000,
              });
            });
        }
        else {
          FacilityStructureService.remove(node.self_id.low)
            .then(() => {
              toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Classification Deleted",
                life: 2000,
              });
              getClassification();

            })
            .catch((err) => {
              toast.current.show({
                severity: "error",
                summary: "Error",
                detail: err.response ? err.response.data.message : err.message,
                life: 2000,
              });
            });
          return node;
        }
      }
      findNodeAndDelete(search, node.children ? node.children : []);

    })[0];
  };

  const fixNodes = (nodes: Node[]) => {
    return nodes.map((node) => {
      if (node.children.length === 0) {
        node.selectable = true;
      } else {
        fixNodes(node.children);
        node.selectable = false;
      }
      return node;
    });
  };

  const addItem = (key: string) => {
    const temp = JSON.parse(JSON.stringify(data));
    findNodeAndAddItem(key, temp);
    setData(temp);
    setName("");
    setCode("");
    setTag([]);
    setAddDia(false);
  };

  const saveItem = (key: string) => {
    const temp = JSON.parse(JSON.stringify(data));
    findNodeAndChangeItem(key, temp);
    setData(temp);
    setName("");
    setCode("");
    setTag([]);
    setEditDia(false);
  }

  const deleteItem = (key: string) => {
    const temp = JSON.parse(JSON.stringify(data));
    console.log(key);
    console.log(data);
    findNodeAndDelete(key, temp);
  };

  const dragDropUpdate = (dragId: string, dropId: string) => {
    console.log(dragId);
    console.log(dropId);

    FacilityStructureService.relation(dragId, dropId)
      .then((res) => {
        showSuccess("Updated");
        getClassification();
      })
      .catch((err) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: err.response ? err.response.data.message : err.message,
          life: 2000,
        });
      });
  };

  const dragConfirm = (dragId: string, dropId: string) => {
    confirmDialog({
      message: 'Are you sure you want to move?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => { setLoading(true); dragDropUpdate(dragId, dropId) },
      reject: () => { setLoading(true); getClassification() }
    });
  }

  const showSuccess = (detail: string) => {
    toast.current.show({
      severity: "success",
      summary: "Success Message",
      detail: detail,
      life: 3000,
    });
  };

  const renderFooterAdd = () => {
    return (
      <div>
        <Button
          label="Cancel"
          icon="pi pi-times"
          onClick={() => {
            setAddDia(false);
            setName("");
            setCode("");
            setTag([]);
          }}
          className="p-button-text"
        />
        <Button
          label="Add"
          icon="pi pi-check"
          onClick={() => addItem(selectedNodeKey)}
          autoFocus
        />
      </div>
    );
  };

  const renderFooterEdit = () => {
    return (
      <div>
        <Button
          label="Cancel"
          icon="pi pi-times"
          onClick={() => {
            setEditDia(false);
            setName("");
            setCode("");
            setTag([]);
          }}
          className="p-button-text"
        />
        <Button
          label="Save"
          icon="pi pi-check"
          onClick={() => saveItem(selectedNodeKey)}
          autoFocus
        />
      </div>
    );
  };

  return (
    <div className="container">
      <Toast ref={toast} position="top-right" />
      <ContextMenu model={menu} ref={cm} />
      <ConfirmDialog
        visible={delDia}
        onHide={() => setDelDia(false)}
        message="Do you want to delete?"
        header="Delete Confirmation"
        icon="pi pi-exclamation-triangle"
        accept={() => deleteItem(selectedNodeKey)}
      />
      <Dialog
        header="Add New Item"
        visible={addDia}
        style={{ width: "40vw" }}
        footer={renderFooterAdd}
        onHide={() => {
          setName("");
          setCode("");
          setTag([]);
          setAddDia(false);
        }}
      >
        <div className="field">
          <h5 style={{ marginBottom: "0.5em" }}>Code</h5>
          <InputText
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
        </div>
        <div className="field">
          <h5 style={{ marginBottom: "0.5em" }}>Name</h5>
          <InputText
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="field">
          <h5 style={{ marginBottom: "0.5em" }}>HashTag</h5>
          <Chips value={tag} onChange={(e) => setTag(e.value)} />
        </div>
      </Dialog>
      <Dialog
        header="Edit Item"
        visible={editDia}
        style={{ width: "40vw" }}
        footer={renderFooterEdit}
        onHide={() => {
          setName("");
          setCode("");
          setTag([]);
          setEditDia(false);
        }}
      >
        <div className="field">
          <h5 style={{ marginBottom: "0.5em" }}>Code</h5>
          <InputText
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
        </div>
        <div className="field">
          <h5 style={{ marginBottom: "0.5em" }}>Name</h5>
          <InputText
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="field">
          <h5 style={{ marginBottom: "0.5em" }}>HashTag</h5>
          <Chips value={tag} onChange={(e) => setTag(e.value)} />
        </div>
      </Dialog>
      <h1>Edit Classification</h1>
      <h3>Code : {classification.root[0].code} </h3>
      <div className="field">
        <Tree
          loading={loading}
          value={data}
          dragdropScope="-"
          contextMenuSelectionKey={selectedNodeKey ? selectedNodeKey : ""}
          onContextMenuSelectionChange={(event: any) =>
            setSelectedNodeKey(event.value)
          }
          onContextMenu={(event) => cm.current.show(event.originalEvent)}
          onDragDrop={(event: any) => {
            if (event.value.length > 1) {
              toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "You can't drag here.",
                life: 1000,
              });
              return
            }
            dragConfirm(event.dragNode.self_id.low, event.dropNode.self_id.low)
          }}
          filter
          filterBy="name,code"
          filterPlaceholder="Search"
        />
      </div>
      <div className="field">

      </div>
    </div>
  );
};

export default SetClassification;