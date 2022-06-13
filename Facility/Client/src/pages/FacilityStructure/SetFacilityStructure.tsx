import React, { useEffect, useState } from "react";
import { Tree } from "primereact/tree";
import { ContextMenu } from "primereact/contextmenu";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Chips } from 'primereact/chips';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { useForm, Controller } from "react-hook-form";
import { TreeSelect } from "primereact/treeselect";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import FacilityStructureService from "../../services/facilitystructure";
import FormTypeService from "../../services/formType";
import { useAppSelector } from "../../app/hook";

interface StructureInterface {
  root:
  {
    code: string;
    children: [];
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
    label: string;
  };
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
  label: string;
  optionalLabels?: string[];
}

interface FormNode {
  code: string;
  name: string;
  tag: string[];
  key: string;
  hasParent?: boolean;
  hasType?: boolean;
  isActive?: boolean;
  isDeleted?: boolean;
  label: string;
  children: FormNode[];
  _type?: string;
  typeId?: string;
  selectable?: boolean;
  _id: {
    low: string;
    high: string;
  },
  labelclass: string;
  icon?: string;
}

const SetClassification = () => {
  const [selectedNodeKey, setSelectedNodeKey] = useState<any>("");
  const [loading, setLoading] = useState(true);
  const [structure, setStructure] = useState<StructureInterface>({
    root:
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
      hasParent: false,
      label: "",
    }
  });

  const [data, setData] = useState<Node[]>([]);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [typeId, setTypeId] = useState<any>(undefined);
  const [optionalLabels, setOptionalLabels] = useState<string[]>([]);
  const [tag, setTag] = useState<string[]>([]);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [addDia, setAddDia] = useState(false);
  const [editDia, setEditDia] = useState(false);
  const [delDia, setDelDia] = useState<boolean>(false);
  const toast = React.useRef<any>(null);
  const cm: any = React.useRef(null);
  const params = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormNode[]>([]);
  const [selectedForm, setSelectedForm] = useState<any>(undefined);
  const auth = useAppSelector((state) => state.auth);
  const [realm, setRealm] = useState(auth.auth.realm);

  const facilityTypes = ["Facility", "Building", "Block", "Floor", "Room", "Open Area", "Park Area", "Garden", "Other"];

  const getForms = async () => {
    await FormTypeService.findOne('115').then((res) => {
      console.log(res.data.root);
      let temp = JSON.parse(JSON.stringify([res.data.root] || []));
      const iconFormNodes = (nodes: FormNode[]) => {
        if (!nodes || nodes.length === 0) {
          return;
        }
        for (let i of nodes) {
          iconFormNodes(i.children)
          if (i.hasType === true) {
            i.icon = "pi pi-fw pi-book";
            i.selectable = true;
          }
          else {
            i.selectable = false;
          }
        }
      };
      iconFormNodes(temp);

      setFormData(temp);
    });
  };

  useEffect(() => {
    getForms();
  }, []);

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

        FacilityStructureService.nodeInfo(selectedNodeKey)
          .then((res) => {
            console.log(res.data.properties.optionalLabel.replace(/([a-z])([A-Z])/g, '$1 $2'));

            setName(res.data.properties.name || "");
            setCode(res.data.properties.code || "");
            setTag(res.data.properties.tag || []);
            setSelectedForm(formData.find(item => item.name === res.data.properties.type));  //??
            setIsActive(res.data.properties.isActive);
            setTypeId(res.data.properties.typeId);
            setOptionalLabels([res.data.properties.optionalLabel.replace(/([a-z])([A-Z])/g, '$1 $2')] || []);
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

  const getFacilityStructure = () => {
    const id = params.id || "";
    FacilityStructureService.findOne(realm).then((res) => {
      console.log(res.data);

      // let temp = [res.data.root[0].properties] || [];

      setStructure(res.data);
      if (!res.data.root.children) {
        setData([res.data.root.properties] || []);
        let temp = JSON.parse(JSON.stringify([res.data.root.properties] || []));
        fixNodes(temp)
        setData(temp)
      }
      else if (res.data.root.children) {
        setData([res.data.root] || []);
        let temp = JSON.parse(JSON.stringify([res.data.root] || []));
        fixNodes(temp)
        setData(temp)
      }

      // temp = JSON.parse(JSON.stringify(temp));
      // fixNodes(temp)
      // setData(temp)

      setLoading(false);
    }).catch(err => {
      if (err.response.status !== 404) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: err.response ? err.response.data.message : err.message,
          life: 2000,
        });
      }
      setLoading(false);
      // setTimeout(() => {
      //   navigate("/facilitystructure")
      // }, 2000)
    })
  }

  useEffect(() => {
    getFacilityStructure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fixNodes = (nodes: Node[]) => {
    if (!nodes || nodes.length === 0) {
      return;
    }
    for (let i of nodes) {
      fixNodes(i.children)
      i.icon = "pi pi-fw pi-building";
    }
  };

  const addItem = (key: string) => {
    FacilityStructureService.nodeInfo(key)
      .then((res) => {
        const newNode = {
          key: uuidv4(),
          parent_id: res.data.identity.low,
          name: name,
          code: code,
          tag: tag,
          labelclass: res.data.properties.labelclass,
          label: code + " : " + name,
          type: type,
          typeId: typeId,
          description: "",
          optionalLabels: optionalLabels[0].replace(/ /g, '').split(","),
        };
        console.log(newNode);

        FacilityStructureService.create(newNode)
          .then((res) => {
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Structure Created",
              life: 3000,
            });
            getFacilityStructure();
          })
          .catch((err) => {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: err.response ? err.response.data.message : err.message,
              life: 2000,
            });
          });
      })
      .catch((err) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: err.response ? err.response.data.message : err.message,
          life: 2000,
        });
      });
    setName("");
    setCode("");
    setTag([]);
    setTypeId(undefined);
    setAddDia(false);
    setOptionalLabels([]);
  };

  const editItem = (key: string) => {
    FacilityStructureService.nodeInfo(key)
      .then((res) => {
        const updateNode = {
          key: uuidv4(),
          name: name,
          code: code,
          tag: tag,
          labelclass: res.data.properties.labelclass,
          label: code + " : " + name,
          type: type,
          typeId: typeId,
          isActive: isActive,
          description: "",
          optionalLabels: optionalLabels[0].replace(/ /g, '').split(","),
        };
        FacilityStructureService.update(res.data.identity.low, updateNode)
          .then((res) => {
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Structure Updated",
              life: 3000,
            });
            getFacilityStructure();
          })
          .catch((err) => {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: err.response ? err.response.data.message : err.message,
              life: 2000,
            });
          });
      })
      .catch((err) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: err.response ? err.response.data.message : err.message,
          life: 2000,
        });
      });
    setName("");
    setCode("");
    setTag([]);
    setTypeId(undefined);
    setOptionalLabels([]);
    setEditDia(false);
  }

  const deleteItem = (key: string) => {
    // const temp = JSON.parse(JSON.stringify(data));
    // findNodeAndDelete(key, temp);
    FacilityStructureService.nodeInfo(key)
      .then((res) => {
        if (res.data.properties.hasParent === false) {
          FacilityStructureService.remove(res.data.identity.low)
            .then(() => {
              toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Structure Deleted",
                life: 2000,
              });
              navigate("/facilitystructure")
            })
            .catch((err) => {
              toast.current.show({
                severity: "error",
                summary: "Error",
                detail: err.response ? err.response.data.message : err.message,
                life: 2000,
              });
            });
        } else {
          FacilityStructureService.remove(res.data.identity.low)
            .then(() => {
              toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Structure Deleted",
                life: 2000,
              });
              getFacilityStructure();
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
    FacilityStructureService.relation(dragId, dropId)
      .then((res) => {
        showSuccess("Structure Updated");
        getFacilityStructure();
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
      reject: () => { setLoading(true); getFacilityStructure() }
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
            setTypeId(undefined);
            setOptionalLabels([]);
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
            setOptionalLabels([]);
            setTypeId(undefined);
          }}
          className="p-button-text"
        />
        <Button
          label="Save"
          icon="pi pi-check"
          onClick={() => editItem(selectedNodeKey)}
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
          setTypeId(undefined);
          setOptionalLabels([]);
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
        </div> */}
        <div className="field">
          <h5 style={{ marginBottom: "0.5em" }}>Facility Type</h5>
          <Dropdown
            value={`${optionalLabels[0]}`}
            options={facilityTypes}
            onChange={(e) => { setOptionalLabels([e.value]) }}
            placeholder="Select a Facility Type"
            style={{ width: '50%' }} />
        </div>
        <div className="field">
          <h5 style={{ marginBottom: "0.5em" }}>Form Type</h5>
          <TreeSelect
            value={typeId}
            options={formData}
            onChange={(e) => {
              setTypeId(e.value)
            }}
            filter
            placeholder="Select Type"
            style={{ width: '50%' }}
          />
        </div>
        <div className="field structureChips">
          <h5 style={{ marginBottom: "0.5em" }}>HashTag</h5>
          <Chips value={tag} onChange={(e) => setTag(e.value)} style={{ width: "50%" }} />
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
          setTypeId(undefined);
          setOptionalLabels([]);
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
        <div className="field">
          <h5 style={{ marginBottom: "0.5em" }}>Facility Type</h5>
          <Dropdown
            value={`${optionalLabels[0]}`}
            options={facilityTypes}
            onChange={(e) => { setOptionalLabels([e.value]) }}
            placeholder="Select a Facility Type"
            style={{ width: '50%' }} />
        </div>
        <div className="field">
          <h5 style={{ marginBottom: "0.5em" }}>Form Type</h5>
          <TreeSelect
            value={typeId}
            options={formData}
            onChange={(e) => {
              setTypeId(e.value);
            }}
            filter
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
        </div>
      </Dialog>
      <h1>Edit Facility Structure</h1>
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
          nodeTemplate={(data: FormNode, options) => <span className="flex align-items-center font-bold">{data.label} {
            <>
              <span className="ml-4 ">
                <Button
                  icon="pi pi-plus" className="p-button-rounded p-button-secondary p-button-text" aria-label="Add Item"
                  onClick={() => {
                    setSelectedNodeKey(data.key);
                    setAddDia(true)
                  }
                  }
                />
                <Button
                  icon="pi pi-pencil" className="p-button-rounded p-button-secondary p-button-text" aria-label="Edit Item"
                  onClick={() => {
                    setSelectedNodeKey(data.key);
                    let dataKey: any = data.key

                    FacilityStructureService.nodeInfo(dataKey)
                      .then((res) => {
                        setName(res.data.properties.name || "");
                        setCode(res.data.properties.code || "");
                        setTag(res.data.properties.tag || []);
                        setSelectedForm(formData.find(item => item.name === res.data.properties.type)); //??
                        setIsActive(res.data.properties.isActive);
                        setTypeId(res.data.properties.typeId);
                        setOptionalLabels([res.data.properties.optionalLabel] || []);
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
                  }
                  }
                />
                <Button
                  icon="pi pi-trash" className="p-button-rounded p-button-secondary p-button-text" aria-label="Delete"
                  onClick={() => {
                    setSelectedNodeKey(data.key);
                    setDelDia(true)
                  }}
                />
                {
                  data.typeId && <Button
                    icon="pi pi-book" className="p-button-rounded p-button-secondary p-button-text" aria-label="Edit Form"
                    // onClick={(e) => navigate(`/formgenerate/${data.key}?id=${data._id.low}`, 
                    // {
                    //   state: {
                    //     data: data,
                    //     rootId: structure.root._id.low,
                    //   }
                    // }
                    // )} 
                    onClick={(e) => navigate(`/formgenerate/${data._id.low}?typeId=${data.typeId}`)}
                  />
                }
              </span>
            </>
          }
          </span>}
        // style={{backgroundColor:'gray'}}
        // contentStyle={{backgroundColor:'green'}}
        />
      </div>
      <div className="field">

      </div>
    </div>
  );
};

export default SetClassification;