import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useNavigate, useLocation } from "react-router-dom";

import StructureAssetService from "../../services/structureAsset";
import FacilityStructureService from "../../services/facilitystructure";
import { useAppSelector } from "../../app/hook";

interface Node {
  id: string;
  properties: {
    name: string;
    key: string;
  };
}

const ShowAsset = () => {
  let emptyAsset = {
    id: "",
    properties: {
      name: "",
      key: "",
    }
  }

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Node[]>([]);
  const [nodeName, setNodeName] = useState("");
  const toast = React.useRef<any>(null);
  const cm: any = React.useRef(null);
  const navigate = useNavigate()
  const [assetData, setAssetData] = useState<Node[]>([]);
  const auth = useAppSelector((state) => state.auth);
  const [deleteAssetDialog, setDeleteAssetDialog] = useState(false);
  const [asset, setAsset] = useState(emptyAsset);

  const searchParameters = new URLSearchParams(window.location.search);
  const nodeKey: any = searchParameters.get("nodeKey");

  const getAssets = () => {

    StructureAssetService.findAsset(nodeKey).then((res) => {
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

    FacilityStructureService.nodeInfo(nodeKey)  // Call Node Name
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
    getAssets();
  }, []);

  const deleteFacility = () => {
    StructureAssetService.removeAsset(nodeKey, asset.properties.key)
      .then((response) => {
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Asset Deleted",
          life: 3000,
        });
        setDeleteAssetDialog(false);
        setAsset(emptyAsset);
        getAssets();
      })
      .catch((err) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: err.response ? err.response.data.message : err.message,
          life: 2000,
        });
        setDeleteAssetDialog(false);
        setAsset(emptyAsset);
        getAssets();
      });
  };

  const hideDeleteFacilityDialog = () => {
    setDeleteAssetDialog(false);
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger mt-2"
          onClick={() => confirmDeleteFacility(rowData)}
        />
      </div>
    );
  };

  const confirmDeleteFacility = (asset: any) => {
    setAsset(asset);
    setDeleteAssetDialog(true);
  };

  const deleteFacilityDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteFacilityDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteFacility}
      />
    </>
  );

  return (
    <div className="container">
      <Toast ref={toast} position="top-right" />

      <div className="card">
        <DataTable
          value={data}
          dataKey="_id"
          header={nodeName}
          showGridlines
          responsiveLayout="scroll">
          <Column field="properties.name" header="Name"></Column>
          <Column field="properties.createdAt" header="Created Time"></Column>
          <Column body={actionBodyTemplate}></Column>
        </DataTable>
        <Dialog
          visible={deleteAssetDialog}
          style={{ width: "450px" }}
          header="Confirm"
          modal
          footer={deleteFacilityDialogFooter}
          onHide={hideDeleteFacilityDialog}
        >
          <div className="flex align-items-center justify-content-center">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {data && (
              <span>
                Are you sure you want to delete <b>{asset.properties.name}</b>?
              </span>
            )}
          </div>
        </Dialog>
      </div>

    </div>
  );
};

export default ShowAsset;