import React, { useEffect, useState } from "react";
import { Tree } from "primereact/tree";
import { v4 as uuidv4 } from "uuid";
import { Button } from "primereact/button";
import { ContextMenu } from "primereact/contextmenu";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import ClassificationsService from "../../services/classifications";
import { useNavigate, useParams } from "react-router-dom";

interface ClassificationInterface {
  _id?: string;
  name: string;
  code: string;
  detail: {
    root: Node
  };
  __v?: number;
}

interface Node {
  key: string;
  label: string;
  name: string;
  code: string;
  selectable: boolean;
  parent?: string;
  children: Node[];
}

const SetClassification = () => {
  const [selectedNodeKey, setSelectedNodeKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [classification, setClassification] = useState<ClassificationInterface>({
    _id: "",
    name: "",
    code: "",
    detail: {
      root: {
        key: "",
        label: "",
        name: "",
        code: "",
        selectable: true,
        parent: "",
        children: [],
      },
    },
  });
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [addDia, setAddDia] = useState(false);
  const [editDia, setEditDia] = useState(false);
  const [delDia, setDelDia] = useState<boolean>(false);
  const toast = React.useRef<any>(null);
  const cm: any = React.useRef(null);
  const [data, setData] = useState<Node[]>([]);

  const params = useParams()
  const navigate = useNavigate()

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
        const node = findNode(selectedNodeKey, data);
        if (node) {
          setName(node.node.name);
          setCode(node.node.code);
        }
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
    ClassificationsService.findOne(id).then((res) => {
      setClassification(res.data);
      setData([res.data.detail.root] || []);
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
          label: code + " : " + name,
          parent: node.key,
          name: name,
          code: code,
          selectable: false,
          children: [],
        };
        node.children = node.children ? [...node.children, newNode] : [newNode];
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
        node.code = code;
        node.name = name;
        node.label = code + " : " + name;
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
      node.children = node.children
        ? node.children.filter((child) => child.key !== search)
        : [];
      findNodeAndDelete(search, node.children ? node.children : []);
      return node;
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

  const findNode = (
    search: string,
    data: Node[],
    result: Node[] = []
  ): { node: Node; result: Node[] } | undefined => {
    for (let node of data) {
      var _result = [...result, node];
      if (node.key === search) {
        return { node: node, result: _result };
      }
      const found = findNode(search, node.children, _result);
      if (found) {
        return { node: found.node, result: found.result };
      }
    }
  };

  const addItem = (key: string) => {
    const temp = JSON.parse(JSON.stringify(data));
    findNodeAndAddItem(key, temp);
    setData(temp);
    setName("");
    setCode("");
    setAddDia(false);
  };

  const saveItem = (key: string) => {
    const temp = JSON.parse(JSON.stringify(data));
    findNodeAndChangeItem(key, temp);
    setData(temp);
    setName("");
    setCode("");
    setEditDia(false);
  }

  const deleteItem = (key: string) => {
    if (classification.detail.root.key === key) {
      ClassificationsService.remove(classification._id || "")
        .then(() => {
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Classification Deleted",
            life: 2000,
          });
          navigate("/classifications");
        })
        .catch((err) => {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: err.response ? err.response.data.message : err.message,
            life: 2000,
          });
        });
      return
    }
    var temp: Node[] = JSON.parse(JSON.stringify(data));
    temp = temp.filter((node) => node.key !== key);
    findNodeAndDelete(key, temp);
    setData(temp);
  };

  const saveTree = () => {
    const temp = JSON.parse(JSON.stringify(data));
    fixNodes(temp);
    const _id = classification._id;
    const _classification = {
      code: temp[0].code,
      name: temp[0].name,
      detail: {
        root: {
          ...classification.detail.root,
          code: temp[0].code,
          name: temp[0].name,
          label: temp[0].label,
          children: temp[0].children,
          selectable: temp[0].children.length === 0 ? true : false,
        }
      },
    };
    if (_id) {
      ClassificationsService.update(_id, _classification)
        .then((res) => {
          showSuccess("Saved!");
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
  };

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
            setCode("")
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

  if (loading) {
    return <div>
      <Toast ref={toast} position="top-right" />
      Loading...
    </div>
  }

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
      </Dialog>
      <Dialog
        header="Edit Item"
        visible={editDia}
        style={{ width: "40vw" }}
        footer={renderFooterEdit}
        onHide={() => {
          setName("");
          setCode("");
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
      </Dialog>
      <h1>Edit Classification</h1>
      <h3>Code : {classification.code}</h3>
      <div className="field">
        <Tree
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
            event.dragNode.parent = event.dropNode.key
            setData(event.value);
          }}
          filter
          filterBy="name,code"
          filterPlaceholder="Search"
        />
      </div>
      <div className="field">
        <Button className="p-button-success"
          onClick={saveTree}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default SetClassification;
