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
import { Chips } from 'primereact/chips';

const newData =
  [
    {
      "code": "12-00-00-00",
      "key": "0",
      "children": [
        {
          "_type": "Omni12",
          "name": "Omni Class 12 Detay 1",
          "_id": {
            "low": 47,
            "high": 0
          },
          "code": "12-11-00-00",
          "key": "0",
          "hasParent": true
        },
        {
          "_type": "Omni12",
          "name": "Omni Class 12 Detay",
          "_id": {
            "low": 46,
            "high": 0
          },
          "code": "12-12-00-00",
          "key": "0",
          "hasParent": true
        }
      ],
      "_type": "Omni12",
      "name": "Omni Class 12",
      "_id": {
        "low": 45,
        "high": 0
      },
      "hasParent": false
    }
  ];

const veri =
  [
    {
      "key": "0",
      "label": "Documents",
      "data": "Documents Folder",
      "icon": "pi pi-fw pi-inbox",
      "children": [{
        "key": "0-0",
        "label": "Work",
        "data": "Work Folder",
        "icon": "pi pi-fw pi-cog",
        "children": [{ "key": "0-0-0", "label": "Expenses.doc", "icon": "pi pi-fw pi-file", "data": "Expenses Document" }, { "key": "0-0-1", "label": "Resume.doc", "icon": "pi pi-fw pi-file", "data": "Resume Document" }]
      },
      {
        "key": "0-1",
        "label": "Home",
        "data": "Home Folder",
        "icon": "pi pi-fw pi-home",
        "children": [{ "key": "0-1-0", "label": "Invoices.txt", "icon": "pi pi-fw pi-file", "data": "Invoices for this month" }]
      }]
    },
    {
      "key": "1",
      "label": "Events",
      "data": "Events Folder",
      "icon": "pi pi-fw pi-calendar",
      "children": [
        { "key": "1-0", "label": "Meeting", "icon": "pi pi-fw pi-calendar-plus", "data": "Meeting" },
        { "key": "1-1", "label": "Product Launch", "icon": "pi pi-fw pi-calendar-plus", "data": "Product Launch" },
        { "key": "1-2", "label": "Report Review", "icon": "pi pi-fw pi-calendar-plus", "data": "Report Review" }]
    },
    {
      "key": "2",
      "label": "Movies",
      "data": "Movies Folder",
      "icon": "pi pi-fw pi-star-fill",
      "children": [{
        "key": "2-0",
        "icon": "pi pi-fw pi-star-fill",
        "label": "Al Pacino",
        "data": "Pacino Movies",
        "children": [{ "key": "2-0-0", "label": "Scarface", "icon": "pi pi-fw pi-video", "data": "Scarface Movie" }, { "key": "2-0-1", "label": "Serpico", "icon": "pi pi-fw pi-video", "data": "Serpico Movie" }]
      },
      {
        "key": "2-1",
        "label": "Robert De Niro",
        "icon": "pi pi-fw pi-star-fill",
        "data": "De Niro Movies",
        "children": [{ "key": "2-1-0", "label": "Goodfellas", "icon": "pi pi-fw pi-video", "data": "Goodfellas Movie" }, { "key": "2-1-1", "label": "Untouchables", "icon": "pi pi-fw pi-video", "data": "Untouchables Movie" }]
      }]
    }
  ]

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
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [tag, setTag] = useState<string[]>([]);
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
          setTag(node.node.tag);
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
      console.log(res.data);

      console.log(res.data.root[0]);

      setClassification(res.data);
      console.log(data);

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
      console.log(node);

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
        console.log(newNode);

        ClassificationsService.create(newNode)
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

        console.log(updateNode);


        ClassificationsService.update(node.self_id.low, updateNode)
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
      console.log(node);
      console.log(search);

      if (node.key === search) {
        console.log("mustafa");

        ClassificationsService.remove(node.self_id.low)
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
    console.log(key);

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




    setAddDia(false);
    setName("");
    setCode("");
  }

  const deleteItem = (key: string) => {
    const temp = JSON.parse(JSON.stringify(data));
    console.log(key);
    console.log(data);
    findNodeAndDelete(key, temp);
    // setData(temp);
    // setName("");
    // setCode("");
    // setAddDia(false);


  };

  // const deleteItem = (key: string) => {
  //   if (classification.root[0].key === key) {
  //     ClassificationsService.remove(classification.root[0]._id.low || "")
  //       .then(() => {
  //         toast.current.show({
  //           severity: "success",
  //           summary: "Success",
  //           detail: "Classification Deleted",
  //           life: 2000,
  //         });
  //         navigate("/classifications");
  //       })
  //       .catch((err) => {
  //         toast.current.show({
  //           severity: "error",
  //           summary: "Error",
  //           detail: err.response ? err.response.data.message : err.message,
  //           life: 2000,
  //         });
  //       });
  //     return
  //   }
  //   var temp: Node[] = JSON.parse(JSON.stringify(data));
  //   temp = temp.filter((node) => node.key !== key);
  //   findNodeAndDelete(key, temp);
  //   setData(temp);
  // };

  const draddropUpdate = (dragId: string, dropId: string) => {
    console.log(dragId);
    console.log(dropId);

    ClassificationsService.relation(dragId, dropId)
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

  const saveTree = () => {
    const temp = JSON.parse(JSON.stringify(data));
    fixNodes(temp);
    const _id = classification.root[0]._id.low;
    const _classification = {
      root: {
        ...classification.root[0],
        code: temp[0].code,
        name: temp[0].name,
        children: temp[0].children,
        selectable: temp[0].children.length === 0 ? true : false,
        parent_id: temp[0].parent_id
      }
    };
    // if (_id) {
    //   ClassificationsService.update(_id, _classification)
    //     .then((res) => {
    //       showSuccess("Saved!");
    //     })
    //     .catch((err) => {
    //       toast.current.show({
    //         severity: "error",
    //         summary: "Error",
    //         detail: err.response ? err.response.data.message : err.message,
    //         life: 2000,
    //       });
    //     });
    // }
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
      <h3>Code : </h3>
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
            console.log(event);
            draddropUpdate(event.dragNode.self_id.low, event.dropNode.self_id.low)

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