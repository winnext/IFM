import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { v4 as uuidv4 } from "uuid";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState, useRef } from "react";
// import { useAppDispatch, useAppSelector } from "../../app/hook";
// import { save } from "../../features/tree/treeSlice";
import ClassificationsService from "../../services/classifications";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { useNavigate } from "react-router-dom";
import { Menu } from 'primereact/menu';

interface ClassificationInterface {
  _id?: string;
  name: string;
  code: string;
  detail: {
    root: Node;
  };
  __v?: number;
}

interface Node {
  key: string;
  label: string;
  name: string;
  code: string;
  selectable: boolean;
  parent?: string;
  children: Node[];
}

const Classifications = () => {
  // const tree = useAppSelector((state) => state.tree);

  const navigate = useNavigate();
  const [data, setData] = useState<ClassificationInterface[]>([]);
  const [addDia, setAddDia] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [countClassifications, setCountClassifications] = useState(0);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 5,
    page: 0,
    sortField: undefined,
    sortOrder: undefined,
  });
  const dt = useRef<any>();
  const toast = useRef<any>();
  const menu = useRef<any>(null);

  useEffect(() => {
    loadLazyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lazyParams]);

  const loadLazyData = () => {
    setLoading(true);
    ClassificationsService.findAll({
      page: lazyParams.page,
      limit: lazyParams.rows,
      sortField: lazyParams.sortField,
      sortKind: lazyParams.sortOrder === 1 ? "ascending" : "descending",
    })
      .then((response) => {
        setData(response.data[0]);
        setCountClassifications(response.data[1].count);
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

  // const dispatch = useAppDispatch();

  const addItem = () => {
    const _classification: ClassificationInterface = {
      name: name,
      code: code,
      detail: {
        root: {
          key: uuidv4(),
          name: name,
          code: code,
          label: code + " : " + name,
          selectable: true,
          children: [],
        },
      },
    };

    ClassificationsService.create(_classification)
      .then((res) => {
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Classification Created",
          life: 3000,
        });
        loadLazyData();
      })
      .catch((err) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: err.response ? err.response.data.message : err.message,
          life: 2000,
        });
      });

    setAddDia(false);
    setName("");
    setCode("");
  };

  const onPage = (event: any) => {
    if (globalFilter === "") setLazyParams(event);
  };

  const onSort = (event: any) => {
    setLazyParams((prev) => ({ ...prev, ...event }));
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Manage Classifications</h5>
      <span className="block mt-2 md:mt-0">
        <InputText
          type="search"
          onInput={(e: any) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
        <Button icon="pi pi-search" className="ml-1" />
      </span>
    </div>
  );

  const renderFooter = () => {
    return (
      <div>
        <Button
          label="Cancel"
          icon="pi pi-times"
          onClick={() => {
            setAddDia(false);
            setName("");
          }}
          className="p-button-text"
        />
        <Button
          label="Add"
          icon="pi pi-check"
          onClick={() => addItem()}
          autoFocus
        />
      </div>
    );
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <div className="my-2">
          <Button
            label="New"
            icon="pi pi-plus"
            className="p-button-success mr-2"
            onClick={() => {
              setAddDia(true);
            }}
          />
        </div>
      </React.Fragment>
    );
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
        window.location.href = 'http://localhost:3000/documents/classification-sample-data.csv'
      }
    },
    {
      label: 'Upload File',
      icon: 'pi pi-upload',
      command: () => {
        navigate("/classifications/fileimport");
      }
    }
  ];

  const exportCSV = () => {
    dt.current.exportCSV();
  };


  return (
    <div className="card">
      <Toast ref={toast} />
      <Toolbar className="mb-4" 
      left={leftToolbarTemplate}
      right={rightToolbarTemplate}
      >
      
      </Toolbar>
      <DataTable
        ref={dt}
        value={data}
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
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} classifications"
        totalRecords={countClassifications}
        globalFilter={globalFilter}
        emptyMessage="No classifications found."
        header={header}
        selectionMode="single"
        onSelectionChange={(e) => {
          navigate("/classifications/" + e.value._id);
        }}
        responsiveLayout="scroll"
        onSort={onSort}
        sortField={lazyParams.sortField}
        sortOrder={lazyParams.sortOrder}
      >
        <Column field="code" header="Code" sortable></Column>
        <Column field="name" header="Name" sortable></Column>
      </DataTable>
      <Dialog
        header="Add New Classification"
        visible={addDia}
        style={{ width: "40vw" }}
        footer={renderFooter}
        onHide={() => {
          setName("");
          setAddDia(false);
        }}
      >
        <div className="field">
          <h5 style={{ marginBottom: "0.5em" }}>Code</h5>
          <InputText
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
        </div>
        <div className="field">
          <h5 style={{ marginBottom: "0.5em" }}>Name</h5>
          <InputText
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default Classifications;
