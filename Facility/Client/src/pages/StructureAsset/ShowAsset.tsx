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
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useNavigate, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import FacilityStructureService from "../../services/facilitystructure";
import AssetService from "../../services/asset";
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

const ShowAsset = () => {
  const [selectedNodeKey, setSelectedNodeKey] = useState<any>("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Node[]>([]);
  const [nodeName, setNodeName] = useState("");
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

  // const searchParameters = new URLSearchParams(location.search);
  // const nodeKey = searchParameters.get("nodeKey");
  // console.log(nodeKey);
  const searchParameters = new URLSearchParams(window.location.search);



  const getFacilityStructure = () => {

    const nodeKey: any = searchParameters.get("nodeKey");

    FacilityStructureService.findAssets(nodeKey).then((res) => {
      console.log(res.data);
      setData(res.data);
      setLoading(false);
    }).catch(err => {
      if (err.response.status === 500) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Asset not found",
          life: 3000,
        });
        setTimeout(() => {
          navigate("/structure-asset")
        }, 3000)
      }
    })

    FacilityStructureService.nodeInfo(nodeKey)
      .then((res) => {
        setNodeName(res.data.properties.name + " Assets" || "");
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

  useEffect(() => {
    getFacilityStructure();
  }, []);




  return (
    <div className="container">
      <Toast ref={toast} position="top-right" />

      <div className="card">
        <DataTable value={data} header={nodeName} showGridlines responsiveLayout="scroll">
          <Column field="properties.name" header="Name"></Column>
          <Column field="properties.createdAt" header="Created Time"></Column>
        </DataTable>
      </div>

    </div>
  );
};

export default ShowAsset;