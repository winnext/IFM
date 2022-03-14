import React, { useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import DefineAddress from "./DefineAddress";

interface Address {
  title: string;
  country: string;
  city: string;
  address: string;
}

const Addresses = ({
  addresses,
  setAddresses,
}: {
  addresses: Address[];
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
}) => {
  const emptyAddress: Address = {
    title: "",
    country: "",
    city: "",
    address: "",
  };
  const [address, setAddress] = useState(emptyAddress);
  const [indexAddress, setIndexAddress] = useState(-1);
  const [addressDialog, setAddressDialog] = useState(false);
  const [deleteAddressDialog, setDeleteAddressDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onHide = ()=>{
    setAddress(emptyAddress);
    setIndexAddress(-1);
    setDeleteAddressDialog(false);
    setAddressDialog(false);
  }

  const actionBodyTemplate = (rowData: any, info: any) => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={(e) => {
            e.preventDefault();
            setAddress(rowData);
            setIndexAddress(info.rowIndex);
            setAddressDialog(true);
          }}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning mt-2"
          onClick={(e) => {
            e.preventDefault();
            setAddress(rowData);
            setIndexAddress(info.rowIndex);
            setDeleteAddressDialog(true);
          }}
        />
      </div>
    );
  };

  const footer = (
    <div className="table-footer">
      <Button
        className="p-button-rounded p-button-success"
        onClick={(e) => {
          e.preventDefault();
          setAddressDialog(true);
        }}
        icon="pi pi-plus"
      />
    </div>
  );

  const addressDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={onHide}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={() => setSubmitted(true)}
      />
    </>
  );

  const deleteAddress = () => {
    setAddresses(addresses.filter((address, index) => index !== indexAddress));
    onHide();
  };

  const deleteAddressDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={onHide}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteAddress}
      />
    </>
  );

  return (
    <div>
      <DataTable value={addresses} dataKey="_id" footer={footer}>
        <Column field="title" header="Addresses"></Column>
        <Column body={actionBodyTemplate}></Column>
      </DataTable>
      <Dialog
        visible={addressDialog}
        style={{ width: "450px" }}
        header="Address Details"
        modal
        className="p-fluid"
        footer={addressDialogFooter}
        onHide={onHide}
      >
        <DefineAddress
          submitted={submitted}
          setSubmitted={setSubmitted}
          setAddresses={setAddresses}
          address={address}
          indexAddress={indexAddress}
          hideDialog={onHide}
        />
      </Dialog>
      <Dialog
        visible={deleteAddressDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={deleteAddressDialogFooter}
        onHide={onHide}
      >
        <div className="flex align-items-center justify-content-center">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {address && (
            <span>
              Are you sure you want to delete <b>{address.title}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default Addresses;
