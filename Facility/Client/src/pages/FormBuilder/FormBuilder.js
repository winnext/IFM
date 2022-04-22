import React, { useState, useEffect, useRef } from "react";
// import { classNames } from 'primereact/utils';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
// import { Rating } from 'primereact/rating';
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import FormBuilderService from "../../services/formBuilder";
import DefineFacility from "../../components/Facility/DefineFacility";
import axios from "axios";
import { Menu } from 'primereact/menu';
import { useNavigate } from "react-router-dom";
import DefineForm from "../../components/Form/DefineForm";

const FormBuilder = () => {
  let emptyForm = {
    _id: "",
    name:"",
    items:[],
    __v: 0,
  };

  const [formLists, setFormLists] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 5,
    page: 0,
    sortField: null,
    sortOrder: null,
  });
  const [countForms, setCountForms] = useState(0);
  const [facilityDialog, setFacilityDialog] = useState(false);
  const [deleteFacilityDialog, setDeleteFacilityDialog] = useState(false);
  const [formList, setFormList] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isUpload, setIsUpload] = useState(false);
  const toast = useRef(null);
  const dt = useRef(null);
  const navigate = useNavigate();
  const menu = useRef(null);

  useEffect(() => {
    loadLazyData();
    // FacilityService.test();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lazyParams,isUpload]);

  const onPage = (event) => {
    if (globalFilter === "") setLazyParams(event);
  };

  const loadLazyData = () => {
    setLoading(true);
    FormBuilderService.findAll({
      page: lazyParams.page,
      limit: lazyParams.rows,
      sortField: lazyParams.sortField,
      sortKind: lazyParams.sortOrder === 1 ? "ascending" : "descending",
    })
      .then((response) => {
        setFormLists(response.data[0]);
        setCountForms(response.data.length);
        setLoading(false);
      })
      .catch((err) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: err.response ? err.response.data.message : err.message,
          life: 2000,
        });
        setLoading(false);
      });
  };

  const onSort = (event) => {
    setLazyParams((prev) => ({ ...prev, ...event }));
  };

  const openNew = () => {
    setFormList(emptyForm);
    setSubmitted(false);
    setFacilityDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setFacilityDialog(false);
  };

  const hideDeleteFacilityDialog = () => {
    setDeleteFacilityDialog(false);
  };

  const saveFacility = () => {
    setSubmitted(true);
  };

  const editFacility = (facility) => {
    setFormList(facility);
    setFacilityDialog(true);
  };

  const confirmDeleteFacility = (facility) => {
    setFormList(facility);
    setDeleteFacilityDialog(true);
  };

  const deleteFacility = () => {
    console.log("deneme");
    FormBuilderService.remove(formList._id)
      .then((response) => {
       
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Form Deleted",
          life: 3000,
        });
       
        setDeleteFacilityDialog(false);
        setFormList(emptyForm);
        loadLazyData();
        hideDeleteFacilityDialog();
      })
      .catch((err) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: err.response ? err.response.data.message : err.message,
          life: 2000,
        });
        setDeleteFacilityDialog(false);
        setFormList(emptyForm);
        loadLazyData();
      });
  };


  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <div className="my-2">
          <Button
            label="New"
            icon="pi pi-plus"
            className="p-button-success mr-2"
            onClick={()=>navigate("/formbuilder/create")}
          />
        </div>
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
        <Button className="mr-2" label="Import" icon="pi pi-upload" onClick={(event) => menu.current.toggle(event)} aria-controls="popup_menu" aria-haspopup />
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
      label: 'Download Sample File',
      icon: 'pi pi-download',
      command: () => {
        window.location.href = 'http://localhost:3000/documents/facility-sample-data.csv'
      }
    },
    {
      label: 'Upload File',
      icon: 'pi pi-upload',
      command: () => {
        navigate("/facility/fileimport");
      }
    }
  ];

  const facilityNameBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Name</span>
        {rowData.name}
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
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning mt-2"
          onClick={() => confirmDeleteFacility(rowData)}
        />
      </div>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Manage Forms</h5>
      <span className="block mt-2 md:mt-0">
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
        <Button icon="pi pi-search" className="ml-1" />
      </span>
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
            value={formLists}
            dataKey="_id"
            onPage={onPage}
            first={lazyParams.first}
            paginator
            rows={lazyParams.rows}
            loading={loading}
            lazy
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} forms"
            totalRecords={countForms}
            globalFilter={globalFilter}
            emptyMessage="No forms found."
            header={header}
            responsiveLayout="scroll"
            onSort={onSort}
            sortField={lazyParams.sortField}
            sortOrder={lazyParams.sortOrder}
            exportFilename={`Facility-` + new Date().toJSON().slice(0, 10)}
          >
            <Column
              field="name"
              header="Name"
              sortable
              body={facilityNameBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column body={actionBodyTemplate}></Column>
          </DataTable>

          <Dialog
            visible={facilityDialog}
            style={{ width: "850px" }}
            header="Form Details"
            modal
            className=""
            footer={facilityDialogFooter}
            onHide={hideDialog}
          >
            <DefineForm
              submitted={submitted}
              setSubmitted={setSubmitted}
              hideDialog={hideDialog}
              toast={toast}
              loadLazyData={loadLazyData}
              formList={formList}
            />
          </Dialog>

          <Dialog
            visible={deleteFacilityDialog}
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
              {formList && (
                <span>
                  Are you sure you want to delete <b>{formList.name}</b>?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default React.memo(FormBuilder);
