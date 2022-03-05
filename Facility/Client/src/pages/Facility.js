import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
// import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import FacilityService from '../services/facility';

const Facility = () => {
  let emptyFacility = {
    _id: '',
    facility_name: '',
    brand_name: '',
    type_of_facility: '',
    classification_of_facility: [{}],
    label: [''],
    country: '',
    address: '',
  };

  const [facilities, setFacilities] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 5,
    page: 0,
    sortField: null,
    sortOrder: null,
  });
  const [countFacilities, setCountFacilities] = useState(0);
  const [facilityDialog, setFacilityDialog] = useState(false);
  const [deleteFacilityDialog, setDeleteFacilityDialog] = useState(false);
  const [deleteFacilitiesDialog, setDeleteFacilitiesDialog] = useState(false);
  const [facility, setFacility] = useState(emptyFacility);
  const [selectedFacilities, setSelectedFacilities] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    loadLazyData();
    // FacilityService.test();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lazyParams]);

  const onPage = (event) => {
    console.log(event);
    setLazyParams(event);
  };

  const loadLazyData = () => {
    setLoading(true);
    setTimeout(() => {
      FacilityService.findAll({
        page: lazyParams.page,
        limit: lazyParams.rows,
      }).then((response) => {
        setFacilities(response.data[0]);
        setCountFacilities(response.data[1].count);
        setLoading(false);
      });
    }, 300);
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

  const hideDeleteFacilityDialog = () => {
    setDeleteFacilityDialog(false);
  };

  const hideDeleteFacilitiesDialog = () => {
    setDeleteFacilitiesDialog(false);
  };

  const saveFacility = () => {
    setSubmitted(true);

    if (facility.name.trim()) {
      let _facilities = [...facilities];
      let _facility = { ...facility };
      if (facility.id) {
        const index = findIndexById(facility.id);

        _facilities[index] = _facility;
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Facility Updated',
          life: 3000,
        });
      } else {
        _facility.id = createId();
        _facility.image = 'facility-placeholder.svg';
        _facilities.push(_facility);
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Facility Created',
          life: 3000,
        });
      }

      setFacilities(_facilities);
      setFacilityDialog(false);
      setFacility(emptyFacility);
    }
  };

  const editFacility = (facility) => {
    setFacility({ ...facility });
    setFacilityDialog(true);
  };

  const confirmDeleteFacility = (facility) => {
    setFacility(facility);
    setDeleteFacilityDialog(true);
  };

  const deleteFacility = () => {
    let _facilities = facilities.filter((val) => val.id !== facility.id);
    setFacilities(_facilities);
    setDeleteFacilityDialog(false);
    setFacility(emptyFacility);
    toast.current.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Facility Deleted',
      life: 3000,
    });
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < facilities.length; i++) {
      if (facilities[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const createId = () => {
    let id = '';
    let chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteFacilitiesDialog(true);
  };

  const deleteSelectedFacilities = () => {
    let _facilities = facilities.filter(
      (val) => !selectedFacilities.includes(val)
    );
    setFacilities(_facilities);
    setDeleteFacilitiesDialog(false);
    setSelectedFacilities(null);
    toast.current.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Facilities Deleted',
      life: 3000,
    });
  };

  const onCategoryChange = (e) => {
    let _facility = { ...facility };
    _facility['category'] = e.value;
    setFacility(_facility);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _facility = { ...facility };
    _facility[`${name}`] = val;

    setFacility(_facility);
  };

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _facility = { ...facility };
    _facility[`${name}`] = val;

    setFacility(_facility);
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <div className="my-2">
          <Button
            label="New"
            icon="pi pi-plus"
            className="p-button-success mr-2"
            onClick={openNew}
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            className="p-button-danger"
            onClick={confirmDeleteSelected}
            disabled={!selectedFacilities || !selectedFacilities.length}
          />
        </div>
      </React.Fragment>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <FileUpload
          mode="basic"
          accept="image/*"
          maxFileSize={1000000}
          label="Import"
          chooseLabel="Import"
          className="mr-2 inline-block"
        />
        <Button
          label="Export"
          icon="pi pi-upload"
          className="p-button-help"
          onClick={exportCSV}
        />
      </React.Fragment>
    );
  };

  const facilityNameBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Facility Name</span>
        {rowData.facility_name}
      </>
    );
  };

  const brandNameBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Brand Name</span>
        {rowData.brand_name}
      </>
    );
  };

  const typeOfFacilityNameBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Type of Facility</span>
        {rowData.type_of_facility}
      </>
    );
  };

  const countryBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Country</span>
        {rowData.country}
      </>
    );
  };

  const addressBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Address</span>
        {rowData.address}
      </>
    );
  };

  // const imageBodyTemplate = (rowData) => {
  //   return (
  //     <>
  //       <span className="p-column-title">Image</span>
  //       <img
  //         src={`assets/demo/images/facility/${rowData.image}`}
  //         alt={rowData.image}
  //         className="shadow-2"
  //         width="100"
  //       />
  //     </>
  //   );
  // };

  // const statusBodyTemplate = (rowData) => {
  //   return (
  //     <>
  //       <span className="p-column-title">Status</span>
  //       <span
  //         className={`facility-badge status-${rowData.inventoryStatus.toLowerCase()}`}
  //       >
  //         {rowData.inventoryStatus}
  //       </span>
  //     </>
  //   );
  // };

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
      <h5 className="m-0">Manage Facilities</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
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
  const deleteFacilitiesDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteFacilitiesDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedFacilities}
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
            selection={selectedFacilities}
            onSelectionChange={(e) => setSelectedFacilities(e.value)}
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
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} facilities"
            totalRecords={countFacilities}
            globalFilter={globalFilter}
            emptyMessage="No facilities found."
            header={header}
            responsiveLayout="scroll"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: '3rem' }}
            ></Column>
            <Column
              field="facility_name"
              header="Facility Name"
              sortable
              body={facilityNameBodyTemplate}
              headerStyle={{ width: '14%', minWidth: '10rem' }}
            ></Column>
            <Column
              field="brand_name"
              header="Brand Name"
              sortable
              body={brandNameBodyTemplate}
              headerStyle={{ width: '14%', minWidth: '10rem' }}
            ></Column>
            <Column
              field="type_of_facility"
              header="Type of Facility"
              sortable
              body={typeOfFacilityNameBodyTemplate}
              headerStyle={{ width: '14%', minWidth: '10rem' }}
            ></Column>
            <Column
              field="country"
              header="Country"
              sortable
              body={countryBodyTemplate}
              headerStyle={{ width: '14%', minWidth: '10rem' }}
            ></Column>
            <Column
              field="address"
              header="Address"
              sortable
              body={addressBodyTemplate}
              headerStyle={{ width: '14%', minWidth: '10rem' }}
            ></Column>
            {/* <Column
              header="Image"
              body={imageBodyTemplate}
              headerStyle={{ width: '14%', minWidth: '10rem' }}
            ></Column>
            <Column
              field="inventoryStatus"
              header="Status"
              body={statusBodyTemplate}
              sortable
              headerStyle={{ width: '14%', minWidth: '10rem' }}
            ></Column> */}
            <Column body={actionBodyTemplate}></Column>
          </DataTable>

          <Dialog
            visible={facilityDialog}
            style={{ width: '450px' }}
            header="Facility Details"
            modal
            className="p-fluid"
            footer={facilityDialogFooter}
            onHide={hideDialog}
          >
            {facility.image && (
              <img
                src={`assets/demo/images/facility/${facility.image}`}
                alt={facility.image}
                width="150"
                className="mt-0 mx-auto mb-5 block shadow-2"
              />
            )}
            <div className="field">
              <label htmlFor="name">Name</label>
              <InputText
                id="name"
                value={facility.name}
                onChange={(e) => onInputChange(e, 'name')}
                required
                autoFocus
                className={classNames({
                  'p-invalid': submitted && !facility.name,
                })}
              />
              {submitted && !facility.name && (
                <small className="p-invalid">Name is required.</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="description">Description</label>
              <InputTextarea
                id="description"
                value={facility.description}
                onChange={(e) => onInputChange(e, 'description')}
                required
                rows={3}
                cols={20}
              />
            </div>

            <div className="field">
              <label className="mb-3">Category</label>
              <div className="formgrid grid">
                <div className="field-radiobutton col-6">
                  <RadioButton
                    inputId="category1"
                    name="category"
                    value="Accessories"
                    onChange={onCategoryChange}
                    checked={facility.category === 'Accessories'}
                  />
                  <label htmlFor="category1">Accessories</label>
                </div>
                <div className="field-radiobutton col-6">
                  <RadioButton
                    inputId="category2"
                    name="category"
                    value="Clothing"
                    onChange={onCategoryChange}
                    checked={facility.category === 'Clothing'}
                  />
                  <label htmlFor="category2">Clothing</label>
                </div>
                <div className="field-radiobutton col-6">
                  <RadioButton
                    inputId="category3"
                    name="category"
                    value="Electronics"
                    onChange={onCategoryChange}
                    checked={facility.category === 'Electronics'}
                  />
                  <label htmlFor="category3">Electronics</label>
                </div>
                <div className="field-radiobutton col-6">
                  <RadioButton
                    inputId="category4"
                    name="category"
                    value="Fitness"
                    onChange={onCategoryChange}
                    checked={facility.category === 'Fitness'}
                  />
                  <label htmlFor="category4">Fitness</label>
                </div>
              </div>
            </div>

            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="price">Price</label>
                <InputNumber
                  id="price"
                  value={facility.price}
                  onValueChange={(e) => onInputNumberChange(e, 'price')}
                  mode="currency"
                  currency="USD"
                  locale="en-US"
                />
              </div>
              <div className="field col">
                <label htmlFor="quantity">Quantity</label>
                <InputNumber
                  id="quantity"
                  value={facility.quantity}
                  onValueChange={(e) => onInputNumberChange(e, 'quantity')}
                  integeronly
                />
              </div>
            </div>
          </Dialog>

          <Dialog
            visible={deleteFacilityDialog}
            style={{ width: '450px' }}
            header="Confirm"
            modal
            footer={deleteFacilityDialogFooter}
            onHide={hideDeleteFacilityDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: '2rem' }}
              />
              {facility && (
                <span>
                  Are you sure you want to delete <b>{facility.name}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteFacilitiesDialog}
            style={{ width: '450px' }}
            header="Confirm"
            modal
            footer={deleteFacilitiesDialogFooter}
            onHide={hideDeleteFacilitiesDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: '2rem' }}
              />
              {facility && (
                <span>
                  Are you sure you want to delete the selected facilities?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Facility);
