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
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import FormType from "../../components/Form/FormType";
import { useForm, Controller } from "react-hook-form";

import FacilityTreeService from "../../services/formTree";

interface StructureInterface {
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
    icon?: string;
    hasType?: boolean;
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
  typeId?: string;
  parent_id?: string;
  selectable?: boolean;
  self_id: {
    low: string;
    high: string;
  },
  labelclass: string;
  description: string;
  icon?: string;
  hasType?: boolean;
  _id: {
    low: string;
    high: string;
  },
}

interface Type {
  _id: string;
  name: string;
  items: any[]
}

const SetFormTree = () => {
  const [selectedNodeKey, setSelectedNodeKey] = useState<any>("");
  const [selectedNodeId, setSelectedNodeId] = useState<any>("");
  const [loading, setLoading] = useState(true);
  const [structure, setStructure] = useState<StructureInterface>({
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
  const [type, setType] = useState("");
  const [typeId, setTypeId] = useState("");
  const [tag, setTag] = useState<string[]>([]);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [addDia, setAddDia] = useState(false);
  const [editDia, setEditDia] = useState(false);
  const [delDia, setDelDia] = useState<boolean>(false);
  const toast = React.useRef<any>(null);
  const cm: any = React.useRef(null);
  const params = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<Type[]>([]);
  const [selectedForm, setSelectedForm] = useState<any>(undefined);
  const [addFormDia, setAddFormDia] = useState<boolean>(false);

  const {
    handleSubmit,
    control,
    // watch,
    unregister,
    reset,
    formState: { errors },
  } = useForm();


  const menu = [
    {
      label: "Add Child",
      icon: "pi pi-plus",
      command: () => {
        setAddDia(true);
      },
    },
    {
      label: "Edit Item",
      icon: "pi pi-pencil",
      command: () => {

        FacilityTreeService.nodeInfo(selectedNodeKey)
          .then((res) => {
            setName(res.data.properties.name || "");
            setCode(res.data.properties.code || "");
            setTag(res.data.properties.tag || []);
            setSelectedForm(formData.find(item => item.name === res.data.properties.type));
            setIsActive(res.data.properties.isActive);
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
    FacilityTreeService.findOne('244').then((res) => {


      let temp;
      console.log(res.data.root);

      setStructure(res.data);
      if (!res.data.root.children) {
        setData([res.data.root.properties] || []);
        temp = [res.data.root.properties] || []
      }
      else if (res.data.root.children) {
        setData([res.data.root] || []);
        temp = [res.data.root] || []
      }

      temp = JSON.parse(JSON.stringify(temp));
      fixNodes(temp)
      setData(temp)


      setLoading(false);
    }).catch(err => {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.response ? err.response.data.message : err.message,
        life: 20000,
      });
      setTimeout(() => {
        navigate("/facilitystructure")
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
        console.log(node);

        const newNode = {
          key: uuidv4(),
          parent_id: node._id.low,
          name: name,
          code: code,
          tag: tag,
          labelclass: node.labelclass,
        };
        // node.children = node.children ? [...node.children, newNode] : [newNode];

        FacilityTreeService.create(newNode)
          .then((res) => {
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Form  Created",
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

  const findNodeAndAddForm = (
    search: string,
    nodes: Node[]
  ): Node | undefined => {
    if (nodes.length === 0) return undefined;
    return nodes.map((node) => {


      if (node.key === search) {
        console.log(node);
        if (node.hasType === true) {
          navigate("/formbuilder/" + node._id.low);
        }
        const newNode = {
          key: uuidv4(),
          parent_id: node._id.low,
          name: node.name,
          code: node.code,
          tag: node.tag,
          labelclass: 'Type',
        };
        // node.children = node.children ? [...node.children, newNode] : [newNode];

        FacilityTreeService.create(newNode)
          .then((res) => {
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Form  Created",
              life: 3000,
            });
            getClassification();
            navigate("/formbuilder/" + newNode.key);
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
      return findNodeAndAddForm(search, node.children ? node.children : []);
    })[0];
  };

  const findNodeAndChangeItem = (
    search: string,
    nodes: Node[]
  ): Node | undefined => {

    if (nodes.length === 0) return undefined;
    return nodes.map((node) => {
      if (node.key === search) {
        console.log(node);

        const updateNode = {
          key: node.key,
          name: name,
          code: code,
          tag: tag,
          labelclass: node.labelclass,
          isActive: true
        };

        FacilityTreeService.update(node._id.low, updateNode)
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
          FacilityTreeService.remove(node.self_id.low)
            .then(() => {
              toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Form Deleted",
                life: 2000,
              });
              navigate("/facilitystructure");
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
          FacilityTreeService.remove(node.self_id.low)
            .then(() => {
              toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Form Deleted",
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

  // Formu olanlara icon belirtme 

  const fixNodes = (nodes: Node[]) => {
    if (!nodes || nodes.length === 0) {
      return;
    }
    for (let i of nodes) {
      fixNodes(i.children)

      if (i.hasType === true) {
        i.icon = "pi pi-fw pi-book";
      }
    }
  };

  const addItem = (key: string) => {
    // const temp = JSON.parse(JSON.stringify(data));
    // findNodeAndAddItem(key, temp);
    FacilityTreeService.nodeInfo(key)
      .then((res) => {
        console.log(res.data);
        const newNode = {
          key: uuidv4(),
          parent_id: res.data.identity.low,
          name: name,
          code: code,
          tag: tag,
          labelclass: res.data.properties.labelclass,
        };
        console.log(newNode);

        FacilityTreeService.create(newNode)
          .then((res) => {
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Form  Created",
              life: 3000,
            });
            getClassification();
          })
      })
      .catch((err) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: err.response ? err.response.data.message : err.message,
          life: 2000,
        });
      });
    // setData(temp);
    setName("");
    setCode("");
    setTag([]);
    setSelectedForm(undefined);
    setAddDia(false);
  };

  const addForm = (key: string) => {
    FacilityTreeService.nodeInfo(key)
      .then((res) => {
        console.log(res.data);
        setSelectedNodeId(res.data.identity.low)
        const newNode = {
          key: uuidv4(),
          parent_id: res.data.identity.low,
          name: res.data.properties.name,
          code: res.data.properties.code,
          tag: res.data.properties.tag,
          labelclass: 'Type',
        };
        FacilityTreeService.create(newNode)
          .then((res) => {
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Form Created",
              life: 3000,
            });
            getClassification();
          })
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

  const editForm = (id: string, data: any) => {
    console.log(data);

    navigate("/formbuilder/" + id, {
      state: {
        data: data,
        id: id
      }
    });
  };

  const saveItem = (key: string) => {
    const temp = JSON.parse(JSON.stringify(data));
    findNodeAndChangeItem(key, temp);
    setData(temp);
    setName("");
    setCode("");
    setTag([]);
    setSelectedForm(undefined);
    setEditDia(false);
  }

  const deleteItem = (key: string) => {
    // const temp = JSON.parse(JSON.stringify(data));
    // findNodeAndDelete(key, temp);
    FacilityTreeService.nodeInfo(key)
      .then((res) => {
        console.log(res.data);
        if (res.data.properties.hasParent === false) {
          FacilityTreeService.remove(res.data.identity.low)
            .then(() => {
              toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Node Deleted",
                life: 2000,
              });
              navigate("/facilitystructure");
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
          FacilityTreeService.remove(res.data.identity.low)
            .then(() => {
              toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Node Deleted",
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
        }

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

  const dragDropUpdate = (dragId: string, dropId: string) => {
    FacilityTreeService.relation(dragId, dropId)
      .then((res) => {
        showSuccess("Structure Updated");
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
            setSelectedForm(undefined);
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
            setSelectedForm(undefined);
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
      <ConfirmDialog
        visible={addFormDia}
        onHide={() => setAddFormDia(false)}
        message="Do you want to add form?"
        header="Add Form Confirmation"
        icon="pi pi-exclamation-triangle"
        accept={() => addForm(selectedNodeKey)}
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
          setSelectedForm(undefined);
          setAddDia(false);
        }}
      >
        <div className="field">
          <h5 style={{ marginBottom: "0.5em" }}>Code</h5>
          <InputText
            value={code}
            onChange={(event) => setCode(event.target.value)}
            style={{ width: '50%' }}
          />
        </div>
        <div className="field">
          <h5 style={{ marginBottom: "0.5em" }}>Name</h5>
          <InputText
            value={name}
            onChange={(event) => setName(event.target.value)}
            style={{ width: '50%' }}
          />
        </div>
        {/* <div className="field">
          <h5 style={{ marginBottom: "0.5em" }}>Type</h5>
          <Dropdown
            optionLabel="name"
            value={selectedForm}
            options={formData}
            onChange={(e) => {
              const temp = selectedForm ? selectedForm.items : [];
              for (let item of temp) {
                unregister(item.label);
              }
              reset();
              setSelectedForm(e.value);
              setType(e.value.name);
              setTypeId(e.value._id);
            }}
            placeholder="Select Type"
            style={{ width: '50%' }}
          />
        </div>
        <div className="field structureChips">
          <h5 style={{ marginBottom: "0.5em" }}>HashTag</h5>
          <Chips value={tag} onChange={(e) => setTag(e.value)} style={{ width: "50%" }} />
        </div> */}
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
          setSelectedForm(undefined);
          setEditDia(false);
        }}
      >
        <div className="field">
          <h5 style={{ marginBottom: "0.5em" }}>Code</h5>
          <InputText
            value={code}
            onChange={(event) => setCode(event.target.value)}
            style={{ width: '50%' }}
          />
        </div>
        <div className="field">
          <h5 style={{ marginBottom: "0.5em" }}>Name</h5>
          <InputText
            value={name}
            onChange={(event) => setName(event.target.value)}
            style={{ width: '50%' }}
          />
        </div>
        {/* <div className="field">
          <h5 style={{ marginBottom: "0.5em" }}>Type</h5>
          <Dropdown
            optionLabel="name"
            value={selectedForm}
            options={formData}
            onChange={(e) => {
              const temp = selectedForm ? selectedForm.items : [];
              for (let item of temp) {
                unregister(item.label);
              }
              reset();
              setSelectedForm(e.value);
              setType(e.value.name);
              setTypeId(e.value._id);
            }}
            placeholder="Select Type"
            style={{ width: '50%' }}
          />
        </div>
        <div className="field structureChips">
          <h5 style={{ marginBottom: "0.5em" }}>HashTag</h5>
          <Chips value={tag} onChange={(e) => setTag(e.value)} style={{ width: '50%' }} />
        </div>
        <div className="field flex">
          <h5 style={{ marginBottom: "0.5em" }}>Is Active</h5>
          <Checkbox className="ml-3" onChange={e => setIsActive(e.checked)} checked={isActive}></Checkbox>
        </div> */}
      </Dialog>
      <h1>Edit Form Tree</h1>
      {/* <h3>Code : {classification.root[0].code} </h3> */}
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
          nodeTemplate={(data, options) => <span className="flex align-items-center font-bold">{data.label} {


            <>
              {data.icon ?
                <Button
                  icon="pi pi-pencil"
                  className="p-button-rounded p-button-secondary p-button-outlined ml-4"
                  onClick={() => {
                    setSelectedNodeKey(data.key);
                    let dataKey: any = data.key

                    FacilityTreeService.nodeInfo(dataKey)
                      .then((res) => {
                        console.log(res.data);
                        setSelectedNodeId(res.data.identity.low)
                        editForm(res.data.identity.low, res.data.properties)
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
                  }
                />
                :

                <Button
                  icon="pi pi-plus"
                  className="p-button-rounded p-button-secondary p-button-outlined ml-4"
                  onClick={() => {

                    setSelectedNodeKey(data.key);
                    console.log(data.key);

                    setAddFormDia(true)
                  }
                  }
                />



              }
            </>
          }
          </span>}
        />
      </div>
      <div className="field">

      </div>
    </div>
  );
};

export default SetFormTree;