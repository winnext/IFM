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

import ContactService from "../../services/contact";
import FormTypeService from "../../services/formType";
import ClassificationsService from "../../services/classifications";
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
  email?: string;
  name_EN?: string;
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
  formTypeId?: string;
  selectable?: boolean;
  _id: {
    low: string;
    high: string;
  },
  self_id: {
    low: string;
    high: string;
  },
  labelclass: string;
  icon?: string;
}

const Contact = () => {
  const [selectedNodeKey, setSelectedNodeKey] = useState<any>("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Node[]>([]);
  const [name, setName] = useState("");
  const [formTypeId, setFormTypeId] = useState<any>(undefined);
  const [labels, setLabels] = useState<string[]>([]);
  const [tag, setTag] = useState<string[]>([]);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [addDia, setAddDia] = useState(false);
  const [editDia, setEditDia] = useState(false);
  const [delDia, setDelDia] = useState<boolean>(false);
  const toast = React.useRef<any>(null);
  const cm: any = React.useRef(null);
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormNode[]>([]);
  const [classification, setClassification] = useState<Node[]>([]);
  const auth = useAppSelector((state) => state.auth);
  const [realm, setRealm] = useState(auth.auth.realm);

  const [email, setEmail] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [organizationCode, setOrganizationCode] = useState<string>("");
  const [givenName, setGivenName] = useState<string>("");
  const [familyName, setFamilyName] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [postalBox, setPostalBox] = useState<string>("");
  const [town, setTown] = useState<string>("");
  const [stateRegion, setStateRegion] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [createdBy, setCreatedBy] = useState<any>(undefined);
  const [createdByNodeId, setCreatedByNodeId] = useState<string>("");
  const [category, setCategory] = useState<any>(undefined);
  const [categoryNodeId, setCategoryNodeId] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const getForms = async () => {
    await FormTypeService.findOne('111').then((res) => {
      let temp = JSON.parse(JSON.stringify([res.data.root] || []));
      const iconFormNodes = (nodes: FormNode[]) => {
        if (!nodes || nodes.length === 0) {
          return;
        }
        for (let i of nodes) {
          iconFormNodes(i.children)
          if (i.hasType === true) {
            i.icon = "pi pi-fw pi-book";
            // i.selectable = true;
          }
          // else {
          //   i.selectable = false;
          // }
        }
      };
      iconFormNodes(temp);

      setFormData(temp);
    });
  };

  const getClassification = async () => {
    await ClassificationsService.findOne(realm).then((res) => {
      let temp = JSON.parse(JSON.stringify([res.data.root] || []));
      const classificationNodes = (nodes: Node[]) => {
        if (!nodes || nodes.length === 0) {
          return;
        }
        for (let i of nodes) {
          classificationNodes(i.children)
          i.label = i.name||i.name_EN;
        }
      };
      classificationNodes(temp);

      setClassification(temp);
    });
  };

  useEffect(() => {
    getForms();
    getClassification();
  }, []);

  const getNodeInfoAndEdit = (selectedNodeKey: string) => {
    ContactService.nodeInfo(selectedNodeKey)
      .then((res) => {
        console.log(res.data);

        setEmail(res.data.properties.email || "");
        setDepartment(res.data.properties.department || "");
        setCategory(res.data.properties.classificationKey || "");
        setCompany(res.data.properties.company || "");
        setPhone(res.data.properties.phone || "");
        setCreatedBy(res.data.properties.createdByKey || "");
        setFormTypeId(res.data.properties.formTypeId);
        setOrganizationCode(res.data.properties.organizationCode || "");
        setGivenName(res.data.properties.givenName || "");
        setFamilyName(res.data.properties.familyName || "");
        setStreet(res.data.properties.street || "");
        setPostalBox(res.data.properties.postalBox || "");
        setTown(res.data.properties.town || "");
        setStateRegion(res.data.properties.stateRegion || "");
        setPostalCode(res.data.properties.postalCode || "");
        setCountry(res.data.properties.country || "");
        setTag(res.data.properties.tag || []);
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
  }

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

        getNodeInfoAndEdit(selectedNodeKey);
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
    ContactService.findOne(realm).then((res) => {
      console.log(res.data);
      
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
      i.label = i.name||i.email;
    }
  };

  const addItem = (key: string) => {
    let newNode: any = {};
    ContactService.nodeInfo(key)
      .then((res) => {
        console.log(res.data);
        if (labels.length > 0) {
          newNode = {
            key: uuidv4(),
            parentId: res.data.id,
            email: email,
            name: email,
            category: category,
            company: company,
            phone: phone,
            createdBy: createdBy,
            formTypeId: formTypeId,
            department: department,
            organizationCode: organizationCode,
            givenName: givenName,
            familyName: familyName,
            street: street,
            postalBox: postalBox,
            town: town,
            stateRegion: stateRegion,
            postalCode: postalCode,
            country: country,
            tag: tag,
            description: "",
            // labels: optionalLabels[0]?.replace(/ /g, '').split(",") || [],
            labels: [labels[0]],
            createdById: createdByNodeId,
            classificationId: categoryNodeId

          };
        } else {
          newNode = {
            key: uuidv4(),
            parentId: res.data.id,
            email: email,
            name: email,
            category: category,
            company: company,
            phone: phone,
            createdBy: createdBy,
            formTypeId: formTypeId,
            department: department,
            organizationCode: organizationCode,
            givenName: givenName,
            familyName: familyName,
            street: street,
            postalBox: postalBox,
            town: town,
            stateRegion: stateRegion,
            postalCode: postalCode,
            country: country,
            tag: tag,
            description: "",
            createdById: createdByNodeId,
            classificationId: categoryNodeId
          };
        }
        console.log(newNode);

        ContactService.create(newNode)
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
    setTag([]);
    setFormTypeId(undefined);
    setCategory(undefined);
    setCreatedBy(undefined);
    setEmail("");
    setDepartment("");
    setCompany("");
    setPhone("");
    setOrganizationCode("");
    setGivenName("");
    setFamilyName("");
    setStreet("");
    setPostalBox("");
    setTown("");
    setStateRegion("");
    setPostalCode("");
    setCountry("");
    setAddDia(false);
  };

  const editItem = (key: string) => {
    let updateNode: any = {};
    ContactService.nodeInfo(key)
      .then((res) => {
        updateNode = {
          key: uuidv4(),
          parentId: res.data.id,
          email: email,
          name: email,
          category: category,
          company: company,
          phone: phone,
          createdBy: createdBy,
          formTypeId: formTypeId,
          department: department,
          organizationCode: organizationCode,
          givenName: givenName,
          familyName: familyName,
          street: street,
          postalBox: postalBox,
          town: town,
          stateRegion: stateRegion,
          postalCode: postalCode,
          country: country,
          tag: tag,
          description: "",
          createdById: createdByNodeId,
          classificationId: categoryNodeId,
          isActive: isActive,
        };

        ContactService.update(res.data.id, updateNode)
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
    setTag([]);
    setFormTypeId(undefined);
    setCategory(undefined);
    setCreatedBy(undefined);
    setEmail("");
    setDepartment("");
    setCompany("");
    setPhone("");
    setOrganizationCode("");
    setGivenName("");
    setFamilyName("");
    setStreet("");
    setPostalBox("");
    setTown("");
    setStateRegion("");
    setPostalCode("");
    setCountry("");
    setEditDia(false);
  }

  const deleteItem = (key: string) => {
    ContactService.nodeInfo(key)
      .then((res) => {
        if (res.data.properties.hasParent === false) {
          ContactService.remove(res.data.id)
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
          ContactService.remove(res.data.id)
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
    ContactService.relation(dragId, dropId)
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
            setTag([]);
            setFormTypeId(undefined);
            setCategory(undefined);
            setCreatedBy(undefined);
            setEmail("");
            setDepartment("");
            setCompany("");
            setPhone("");
            setOrganizationCode("");
            setGivenName("");
            setFamilyName("");
            setStreet("");
            setPostalBox("");
            setTown("");
            setStateRegion("");
            setPostalCode("");
            setCountry("");
            setAddDia(false);
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
            setTag([]);
            setFormTypeId(undefined);
            setCategory(undefined);
            setCreatedBy(undefined);
            setEmail("");
            setDepartment("");
            setCompany("");
            setPhone("");
            setOrganizationCode("");
            setGivenName("");
            setFamilyName("");
            setStreet("");
            setPostalBox("");
            setTown("");
            setStateRegion("");
            setPostalCode("");
            setCountry("");
            setEditDia(false);
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
        className="dial"
        onHide={() => {
          setTag([]);
          setFormTypeId(undefined);
          setCategory(undefined);
          setCreatedBy(undefined);
          setEmail("");
          setDepartment("");
          setCompany("");
          setPhone("");
          setOrganizationCode("");
          setGivenName("");
          setFamilyName("");
          setStreet("");
          setPostalBox("");
          setTown("");
          setStateRegion("");
          setPostalCode("");
          setCountry("");
          setAddDia(false);
        }}
      >
        <div className="grid p-fluid">
          <div className="col-12 md:col-6">
            <div className="field">
              <h5 style={{ marginBottom: "0.5em" }}>Email</h5>
              <InputText
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="col-12 md:col-6">
            <div className="field">
              <h5 style={{ marginBottom: "0.5em" }}>Company</h5>
              <InputText
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="col-12 md:col-6">
            <div className="field">
              <h5 style={{ marginBottom: "0.5em" }}>Category</h5>
              <TreeSelect
                value={category}
                options={classification}
                onChange={(e) => {
                  setCategory(e.value);
                  console.log(e);
                  let nodeKey: any = e.value;
                  ClassificationsService.nodeInfo(nodeKey)
                    .then((res) => {
                      console.log(res.data);
                      setCategoryNodeId(res.data.id);
                    })
                    .catch((err) => {
                      toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: err.response ? err.response.data.message : err.message,
                        life: 2000,
                      });
                    });
                }}
                filter
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="col-12 md:col-6">
            <div className="field">
              <h5 style={{ marginBottom: "0.5em" }}>Type</h5>
              <TreeSelect
                value={formTypeId}
                options={formData}
                onChange={(e) => {
                  setFormTypeId(e.value);
                  console.log(e);
                  let nodeKey: any = e.value;
                  FormTypeService.nodeInfo(nodeKey)
                    .then((res) => {
                      console.log(res.data);
                      setLabels([res.data.properties.name])
                    })
                    .catch((err) => {
                      toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: err.response ? err.response.data.message : err.message,
                        life: 2000,
                      });
                    });
                }}
                filter
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="col-12 md:col-6 flex">
            <div className="field">
              <h5 style={{ marginBottom: "0.5em" }}>Department</h5>
              <InputText
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div className="field ml-3">
              <h5 style={{ marginBottom: "0.5em" }}>Organization Code</h5>
              <InputText
                value={organizationCode}
                onChange={(event) => setOrganizationCode(event.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="col-12 md:col-6 flex">
            <div className="field">
              <h5 style={{ marginBottom: "0.5em" }}>Given Name</h5>
              <InputText
                value={givenName}
                onChange={(event) => setGivenName(event.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div className="field ml-3">
              <h5 style={{ marginBottom: "0.5em" }}>Family Name</h5>
              <InputText
                value={familyName}
                onChange={(event) => setFamilyName(event.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="col-12 md:col-6 flex">
            <div className="field">
              <h5 style={{ marginBottom: "0.5em" }}>Phone</h5>
              <InputText
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div className="field ml-3">
              <h5 style={{ marginBottom: "0.5em" }}>Country</h5>
              <InputText
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="col-12 md:col-6">
            <div className="field">
              <h5 style={{ marginBottom: "0.5em" }}>Street</h5>
              <InputText
                value={street}
                onChange={(event) => setStreet(event.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="col-12 md:col-6 flex">
            <div className="field">
              <h5 style={{ marginBottom: "0.5em" }}>Town</h5>
              <InputText
                value={town}
                onChange={(event) => setTown(event.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div className="field ml-3">
              <h5 style={{ marginBottom: "0.5em" }}>State Region</h5>
              <InputText
                value={stateRegion}
                onChange={(event) => setStateRegion(event.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="col-12 md:col-6 flex">
            <div className="field">
              <h5 style={{ marginBottom: "0.5em" }}>Postal Code</h5>
              <InputText
                value={postalCode}
                onChange={(event) => setPostalCode(event.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div className="field ml-3">
              <h5 style={{ marginBottom: "0.5em" }}>Postal Box</h5>
              <InputText
                value={postalBox}
                onChange={(event) => setPostalBox(event.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="col-12 md:col-6">
            <div className="field structureChips">
              <h5 style={{ marginBottom: "0.5em" }}>Tag</h5>
              <Chips value={tag} onChange={(e) => setTag(e.value)} style={{ width: "100%" }} />
            </div>
          </div>

          <div className="col-12 md:col-6">
            <div className="field">
              <h5 style={{ marginBottom: "0.5em" }}>Created By</h5>
              <TreeSelect
                value={createdBy}
                options={data}
                onChange={(e) => {
                  setCreatedBy(e.value);
                  let nodeKey: any = e.value;
                  ContactService.nodeInfo(nodeKey)
                    .then((res) => {
                      console.log(res.data);
                      setCreatedByNodeId(res.data.id);
                    })
                    .catch((err) => {
                      toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: err.response ? err.response.data.message : err.message,
                        life: 2000,
                      });
                    });
                }}
                filter
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

      </Dialog>
      <Dialog
        header="Edit Item"
        visible={editDia}
        style={{ width: "40vw" }}
        footer={renderFooterEdit}
        onHide={() => {
          setTag([]);
          setFormTypeId(undefined);
          setCategory(undefined);
          setCreatedBy(undefined);
          setEmail("");
          setDepartment("");
          setCompany("");
          setPhone("");
          setOrganizationCode("");
          setGivenName("");
          setFamilyName("");
          setStreet("");
          setPostalBox("");
          setTown("");
          setStateRegion("");
          setPostalCode("");
          setCountry("");
          setEditDia(false);
        }}
      >
        <div className="grid p-fluid">
          <div className="col-12 md:col-6">
            <div className="field">
              <h5 style={{ marginBottom: "0.5em" }}>Email</h5>
              <InputText
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="col-12 md:col-6">
            <div className="field">
              <h5 style={{ marginBottom: "0.5em" }}>Company</h5>
              <InputText
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="col-12 md:col-6">
            <div className="field">
              <h5 style={{ marginBottom: "0.5em" }}>Category</h5>
              <TreeSelect
                value={category}
                options={classification}
                onChange={(e) => {
                  setCategory(e.value);
                  console.log(e);
                  let nodeKey: any = e.value;
                  ClassificationsService.nodeInfo(nodeKey)
                    .then((res) => {
                      console.log(res.data);
                      setCategoryNodeId(res.data.id);
                    })
                    .catch((err) => {
                      toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: err.response ? err.response.data.message : err.message,
                        life: 2000,
                      });
                    });
                }}
                filter
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="col-12 md:col-6">
            <div className="field">
              <h5 style={{ marginBottom: "0.5em" }}>Type</h5>
              <TreeSelect
                value={formTypeId}
                options={formData}
                onChange={(e) => {
                  setFormTypeId(e.value);
                  console.log(e);
                  let nodeKey: any = e.value;
                  FormTypeService.nodeInfo(nodeKey)
                    .then((res) => {
                      console.log(res.data);
                      setLabels([res.data.properties.name])
                    })
                    .catch((err) => {
                      toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: err.response ? err.response.data.message : err.message,
                        life: 2000,
                      });
                    });
                }}
                filter
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="col-12 md:col-6 flex">
            <div className="field">
              <h5 style={{ marginBottom: "0.5em" }}>Department</h5>
              <InputText
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div className="field ml-3">
              <h5 style={{ marginBottom: "0.5em" }}>Organization Code</h5>
              <InputText
                value={organizationCode}
                onChange={(event) => setOrganizationCode(event.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="col-12 md:col-6 flex">
            <div className="field">
              <h5 style={{ marginBottom: "0.5em" }}>Given Name</h5>
              <InputText
                value={givenName}
                onChange={(event) => setGivenName(event.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div className="field ml-3">
              <h5 style={{ marginBottom: "0.5em" }}>Family Name</h5>
              <InputText
                value={familyName}
                onChange={(event) => setFamilyName(event.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="col-12 md:col-6 flex">
            <div className="field">
              <h5 style={{ marginBottom: "0.5em" }}>Phone</h5>
              <InputText
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div className="field ml-3">
              <h5 style={{ marginBottom: "0.5em" }}>Country</h5>
              <InputText
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="col-12 md:col-6">
            <div className="field">
              <h5 style={{ marginBottom: "0.5em" }}>Street</h5>
              <InputText
                value={street}
                onChange={(event) => setStreet(event.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="col-12 md:col-6 flex">
            <div className="field">
              <h5 style={{ marginBottom: "0.5em" }}>Town</h5>
              <InputText
                value={town}
                onChange={(event) => setTown(event.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div className="field ml-3">
              <h5 style={{ marginBottom: "0.5em" }}>State Region</h5>
              <InputText
                value={stateRegion}
                onChange={(event) => setStateRegion(event.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="col-12 md:col-6 flex">
            <div className="field">
              <h5 style={{ marginBottom: "0.5em" }}>Postal Code</h5>
              <InputText
                value={postalCode}
                onChange={(event) => setPostalCode(event.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div className="field ml-3">
              <h5 style={{ marginBottom: "0.5em" }}>Postal Box</h5>
              <InputText
                value={postalBox}
                onChange={(event) => setPostalBox(event.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="col-12 md:col-6">
            <div className="field structureChips">
              <h5 style={{ marginBottom: "0.5em" }}>Tag</h5>
              <Chips value={tag} onChange={(e) => setTag(e.value)} style={{ width: "100%" }} />
            </div>
          </div>

          <div className="col-12 md:col-6">
            <div className="field">
              <h5 style={{ marginBottom: "0.5em" }}>Created By</h5>
              <TreeSelect
                value={createdBy}
                options={data}
                onChange={(e) => {
                  setCreatedBy(e.value);
                  let nodeKey: any = e.value;
                  ContactService.nodeInfo(nodeKey)
                    .then((res) => {
                      console.log(res.data);
                      setCreatedByNodeId(res.data.id);
                    })
                    .catch((err) => {
                      toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: err.response ? err.response.data.message : err.message,
                        life: 2000,
                      });
                    });
                }}
                filter
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="col-12">
            <div className="field flex">
              <h5 style={{ marginBottom: "0.5em" }}>Is Active</h5>
              <Checkbox className="ml-5" onChange={e => setIsActive(e.checked)} checked={isActive}></Checkbox>
            </div>
          </div>
        </div>
      </Dialog>
      <h1>Edit Contact</h1>
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
                  title="Add Item"
                />
                <Button
                  icon="pi pi-pencil" className="p-button-rounded p-button-secondary p-button-text" aria-label="Edit Item"
                  onClick={() => {
                    setSelectedNodeKey(data.key);
                    let dataKey: any = data.key

                    getNodeInfoAndEdit(dataKey)
                    setEditDia(true);
                  }
                  }
                  title="Edit Item"
                />
                <Button
                  icon="pi pi-trash" className="p-button-rounded p-button-secondary p-button-text" aria-label="Delete"
                  onClick={() => {
                    setSelectedNodeKey(data.key);
                    setDelDia(true)
                  }}
                  title="Delete Item"
                />
                {/* {
                  data.hasType &&  */}
                <Button
                  icon="pi pi-book" className="p-button-rounded p-button-secondary p-button-text" aria-label="Edit Form"
                  // onClick={(e) => navigate(`/formgenerate/${data.key}?id=${data._id.low}`, 
                  // {
                  //   state: {
                  //     data: data,
                  //     rootId: structure.root._id.low,
                  //   }
                  // }
                  // )} 
                  onClick={(e) => navigate(`/formgenerate/${data.self_id.low}?formTypeId=${data.formTypeId}`)}
                  title="Edit Form"
                />
                {/* } */}

                {/* <Button
                  icon="pi pi-plus" className="p-button-rounded p-button-secondary p-button-text" aria-label="Delete"
                  onClick={() => {
                    console.log(data);

                  }}
                /> */}
              </span>
            </>
          }
          </span>}
        />
      </div>

    </div>
  );
};

export default Contact;