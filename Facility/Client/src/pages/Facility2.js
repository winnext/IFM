import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import FacilityService from "../services/facility";
import DefineFacility from "../components/Facility/DefineFacility";
import { Menu } from "primereact/menu";
import { useNavigate } from "react-router-dom";

import { useAppSelector } from "../app/hook";

const Facility2 = () => {
  let emptyFacility = {
    _id: "",
    facility_name: "",
    brand_name: "",
    type_of_facility: "",
    address: [],
    classifications: [
      {
        rootKey: "",
        leafKey: "",
      },
    ],
    label: [],
    __v: 0,
  };

  const [facilities, setFacilities] = useState([]);
  const [facilityShow, setFacilityShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [facilityDialog, setFacilityDialog] = useState(false);
  const [facility, setFacility] = useState(emptyFacility);
  const [submitted, setSubmitted] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const toast = useRef(null);
  const dt = useRef(null);
  const navigate = useNavigate();
  const menu = useRef(null);
  const auth = useAppSelector((state) => state.auth);
  const [realm, setRealm] = useState(auth.auth.realm);

  useEffect(() => {
    loadLazyData();
    // FacilityService.test();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadLazyData = () => {
    setLoading(true);
    FacilityService.findOne(realm)
      .then((response) => {
        setFacilities([response.data] || []);
        // setCountFacilities(response.data[1].count);
        if (response.status !== 200) {
          setFacilityShow(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (err.response.status !== 404) {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: err.response ? err.response.data.message : err.message,
            life: 2000,
          });
        }
        setLoading(false);
      });
  };

  const openNew = () => {
    setFacility(emptyFacility);
    setSubmitted(false);
    setFacilityDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setFacilityDialog(false);
  };

  const saveFacility = () => {
    setSubmitted(true);
  };

  const editFacility = (facility) => {
    setFacility(facility);
    setFacilityDialog(true);
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        {/* {facilities.length < 1 && (
          <div className="my-2">
            <Button
              label="New"
              icon="pi pi-plus"
              className="p-button-success mr-2"
              onClick={openNew}
            />
          </div>
        )} */}
        {facilityShow === false ? null : (
          <div className="my-2">
            <Button
              label="New"
              icon="pi pi-plus"
              className="p-button-success mr-2"
              onClick={openNew}
            />
          </div>
        )}
      </React.Fragment>
    );
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Menu model={items} popup ref={menu} id="popup_menu" />
        <Button
          className="mr-2"
          label="Import"
          icon="pi pi-upload"
          onClick={(event) => menu.current.toggle(event)}
          aria-controls="popup_menu"
          aria-haspopup
        />
        <Button
          label="Export"
          icon="pi pi-download"
          className="p-button"
          onClick={exportCSV}
        />
      </React.Fragment>
    );
  };

  const items = [
    {
      label: "Download Sample File",
      icon: "pi pi-download",
      command: () => {
        window.location.href =
          "http://localhost:3000/documents/facility-sample-data.csv";
      },
    },
    {
      label: "Upload File",
      icon: "pi pi-upload",
      command: () => {
        navigate("/facility/fileimport");
      },
    },
  ];

  const facilityNameBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Facility Name</span>
        {rowData.facility_name}
      </>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editFacility(rowData)}
        />
      </div>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Manage Facilities</h5>
    </div>
  );

  const facilityDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveFacility}
      />
    </>
  );

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar
            className="mb-4"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>

          <DataTable
            ref={dt}
            value={facilities}
            dataKey="_id"
            // onPage={onPage}
            // first={lazyParams.first}
            // paginator
            // rows={lazyParams.rows}
            loading={loading}
            lazy
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            // paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            // currentPageReportTemplate="Showing {first} to {last} of {totalRecords} facilities"
            // totalRecords={countFacilities}
            // globalFilter={globalFilter}
            emptyMessage="No facilities found."
            header={header}
            responsiveLayout="scroll"
            // onSort={onSort}
            // sortField={lazyParams.sortField}
            // sortOrder={lazyParams.sortOrder}
            exportFilename={`Facility-` + new Date().toJSON().slice(0, 10)}
          >
            <Column
              field="facility_name"
              header="Facility Name"
              // sortable
              body={facilityNameBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column body={actionBodyTemplate}></Column>
          </DataTable>

          <Dialog
            visible={facilityDialog}
            style={{ width: "550px" }}
            header="Facility Details"
            modal
            className="p-fluid"
            footer={facilityDialogFooter}
            onHide={hideDialog}
          >
            <DefineFacility
              submitted={submitted}
              setSubmitted={setSubmitted}
              hideDialog={hideDialog}
              toast={toast}
              loadLazyData={loadLazyData}
              facility={facility}
            />
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Facility2);
