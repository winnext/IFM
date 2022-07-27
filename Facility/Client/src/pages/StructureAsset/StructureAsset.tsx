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
import { TreeSelect } from "primereact/treeselect";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import FacilityStructureService from "../../services/facilitystructure";
import AssetService from "../../services/asset";
import StructureAssetService from "../../services/structureAsset";
import FormTypeService from "../../services/formType";
import { useAppSelector } from "../../app/hook";

interface Node {
  cantDeleted: boolean;
  children: Node[];
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  key: string;
  name: string;
  realm: string;
  tag: string[];
  formTypeId?: string;
  _id: {
    low: string;
    high: string;
  },
  icon?: string;
  label?: string;
  labels?: string[]; // for form type
  parentId?: string;
  className?: string;
}

const StructureAsset = () => {
  const [selectedNodeKey, setSelectedNodeKey] = useState<any>("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Node[]>([]);
  const [name, setName] = useState("");
  const [assetKey, setAssetKey] = useState<any>(undefined);
  const [labels, setLabels] = useState<string[]>([]);
  const [tag, setTag] = useState<string[]>([]);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [addDia, setAddDia] = useState(false);
  const [editDia, setEditDia] = useState(false);
  const [delDia, setDelDia] = useState<boolean>(false);
  const toast = React.useRef<any>(null);
  const cm: any = React.useRef(null);
  const navigate = useNavigate()
  const [assetData, setAssetData] = useState<Node[]>([]);
  const auth = useAppSelector((state) => state.auth);
  const [realm, setRealm] = useState(auth.auth.realm);

  const getAssetList = async () => {
    await AssetService.findOne(realm).then((res) => {
      let temp = JSON.parse(JSON.stringify([res.data.root] || []));
      const iconAssetNodes = (nodes: Node[]) => {
        if (!nodes || nodes.length === 0) {
          return;
        }
        for (let i of nodes) {
          iconAssetNodes(i.children)
            i.icon = "pi pi pi-cog";
            i.label = i.name;
        }
      };
      iconAssetNodes(temp);

      setAssetData(temp);
    });
  };

  useEffect(() => {
    getAssetList();
  }, []);

  const getNodeInfoAndEdit = (selectedNodeKey: string) => {
    FacilityStructureService.nodeInfo(selectedNodeKey)
      .then((res) => {
        setName(res.data.properties.name || "");
        setTag(res.data.properties.tag || []);
        setIsActive(res.data.properties.isActive);
        setAssetKey(res.data.properties.formTypeId);
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

  const menu = [
    {
      label: "Add Asset",
      icon: "pi pi-plus",
      command: () => {
        setAddDia(true);
      },
    },
    {
      label: "Show Assets",
      icon: "pi pi-pencil",
      command: () => {

        navigate(`showasset?nodeKey=${selectedNodeKey}`);
      },
    },
    // {
    //   label: "Delete",
    //   icon: "pi pi-trash",
    //   command: () => {
    //     setDelDia(true);
    //   },
    // },
  ];

  const getFacilityStructure = () => {
    FacilityStructureService.findOne(realm).then((res) => {

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
      setLoading(false);
    }).catch(err => {
      if (err.response.status === 500) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Facility Structure not found",
          life: 3000,
        });
        setTimeout(() => {
          navigate("/facility")
        }, 3000)
      }
    })
  }

  useEffect(() => {
    getFacilityStructure();
  }, []);

  const fixNodes = (nodes: Node[]) => {
    if (!nodes || nodes.length === 0) {
      return;
    }
    for (let i of nodes) {
      fixNodes(i.children)
      i.icon = "pi pi-fw pi-building";
      i.label = i.name;
    }
  };

  const addItem = (key: string) => {
    let newAsset: any = {};
    FacilityStructureService.nodeInfo(key)
      .then((res) => {
        console.log(res.data);
        newAsset = {
          referenceKey: assetKey,
        };

        StructureAssetService.createAsset(key,newAsset)
          .then((res) => {
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Asset Created",
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
    setTag([]);
    setAssetKey(undefined);
    setAddDia(false);
    setLabels([]);
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
            setAssetKey(undefined);
            setLabels([]);
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

  return (
    <div className="container">
      <Toast ref={toast} position="top-right" />
      <ContextMenu model={menu} ref={cm} />
      <Dialog
        header="Add New Asset"
        visible={addDia}
        style={{ width: "25vw" }}
        footer={renderFooterAdd}
        onHide={() => {
          setName("");
          setTag([]);
          setAssetKey(undefined);
          setLabels([]);
          setAddDia(false);
        }}
      >
        <div className="field">
          <h5 style={{ marginBottom: "0.5em" }}>Select Asset</h5>
          <TreeSelect
            value={assetKey}
            options={assetData}
            onChange={(e) => {
              setAssetKey(e.value);
              console.log(e);              
            }}
            filter
            style={{ width: '100%' }}
          />
        </div>
      </Dialog>
  
      <h1>Edit Structure-Asset</h1>
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
            console.log(event);
            if (event.value.length > 1) {
              toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "You can't drag here.",
                life: 1000,
              });
              return
            }
            dragConfirm(event.dragNode._id.low, event.dropNode._id.low)
          }}
          filter
          filterBy="name,code"
          filterPlaceholder="Search"
          className="font-bold"
          // nodeTemplate={(data: Node, options) => <span className="flex align-items-center font-bold">{data.label} {
          //   <>
          //     <span className="ml-4 ">
          //       <Button
          //         icon="pi pi-plus" className="p-button-rounded p-button-secondary p-button-text" aria-label="Add Item"
          //         onClick={() => {
          //           setSelectedNodeKey(data.key);
          //           setAddDia(true)
          //         }
          //         }
          //         title="Add Item"
          //       />
          //       <Button
          //         icon="pi pi-pencil" className="p-button-rounded p-button-secondary p-button-text" aria-label="Edit Item"
          //         onClick={() => {
          //           setSelectedNodeKey(data.key);
          //           let dataKey: any = data.key

          //           getNodeInfoAndEdit(dataKey)
          //           setEditDia(true);
          //         }
          //         }
          //         title="Edit Item"
          //       />
          //       <Button
          //         icon="pi pi-trash" className="p-button-rounded p-button-secondary p-button-text" aria-label="Delete"
          //         onClick={() => {
          //           setSelectedNodeKey(data.key);
          //           setDelDia(true)
          //         }}
          //         title="Delete Item"
          //       />
          //       {/* {
          //         data.hasType &&  */}
          //       <Button
          //         icon="pi pi-book" className="p-button-rounded p-button-secondary p-button-text" aria-label="Edit Form"
          //         // onClick={(e) => navigate(`/formgenerate/${data.key}?id=${data._id.low}`, 
          //         // {
          //         //   state: {
          //         //     data: data,
          //         //     rootId: structure.root._id.low,
          //         //   }
          //         // }
          //         // )} 
          //         onClick={() => window.open(`http://localhost:3001/formgenerate/${data._id.low}?formType=${data.labels}?className=${data.className}`, '_blank')}


          //         title="Edit Form"
          //       />
          //       {/* <Button
          //         icon="pi pi-book" className="p-button-rounded p-button-secondary p-button-text" aria-label="Edit Form"
          //         // onClick={(e) => navigate(`/formgenerate/${data.key}?id=${data._id.low}`, 
          //         // {
          //         //   state: {
          //         //     data: data,
          //         //     rootId: structure.root._id.low,
          //         //   }
          //         // }
          //         // )} 
          //         onClick={(e) => console.log(data)}

          //         title="Edit Form"
          //       /> */}

          //     </span>
          //   </>
          // }
          // </span>}
        />
      </div>

    </div>
  );
};

export default StructureAsset;