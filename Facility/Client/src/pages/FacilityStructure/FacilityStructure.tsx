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
import FacilityService from "../../services/facility";
import FacilityStructureService from "../../services/facilitystructure";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { useNavigate } from "react-router-dom";
import { Menu } from 'primereact/menu';

interface ClassificationInterface {
  _id?: string;
  facility_id: string;
  structure: {
    root: Node;
  };
  __v?: number;
}

interface Node {
  type: string;
  description: string;
  key: string;
  label: string;
  name: string;
  code: string;
  selectable: boolean;
  children: Node[];
  tags: string[];
}

const FacilityStructure = () => {
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

  const [isFacility, setIsFacility] = useState(false);
  const [structureData, setStructureData] = useState<ClassificationInterface[]>([]);
  const [test, setTest] = useState("");


  useEffect(() => {
    loadLazyData();
    console.log(structureData);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lazyParams]);

  const loadLazyData = () => {
    setLoading(true);
    FacilityService.findAll({
      page: lazyParams.page,
      limit: lazyParams.rows,
      sortField: lazyParams.sortField,
      sortKind: lazyParams.sortOrder === 1 ? "ascending" : "descending",
    })
      .then((response) => {
        setData(response.data[0]);
        console.log(response.data[0]);

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

    FacilityStructureService.findAll({
      page: lazyParams.page,
      limit: lazyParams.rows,
      sortField: lazyParams.sortField,
      sortKind: lazyParams.sortOrder === 1 ? "ascending" : "descending",
    })
      .then((response) => {
        setStructureData(response.data[0]);
        console.log(response.data[0]);
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

  const addItem = (id: any, name: any) => {
    const _classification: ClassificationInterface = {
      facility_id: id,
      structure: {
        root: {
          type: "",
          description: "",
          key: uuidv4(),
          name: name,
          code: "",
          label: name,
          selectable: true,
          children: [],
          tags: [],
        },
      },
    };

    FacilityStructureService.create(_classification)
      .then((res) => {
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Classification Created",
          life: 3000,
        });
        loadLazyData();

        console.log(res.data);
        setTimeout(() => {

          navigate("/facilitystructure/" + res.data._id);
        }, 1500);



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
      <h5 className="m-0">Manage Facility Structure</h5>
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

  // const renderFooter = () => {
  //   return (
  //     <div>
  //       <Button
  //         label="Cancel"
  //         icon="pi pi-times"
  //         onClick={() => {
  //           setAddDia(false);
  //           setName("");
  //         }}
  //         className="p-button-text"
  //       />
  //       <Button
  //         label="Add"
  //         icon="pi pi-check"
  //         onClick={() => addItem()}
  //         autoFocus
  //       />
  //     </div>
  //   );
  // };

  // const leftToolbarTemplate = () => {
  //   return (
  //     <React.Fragment>
  //       <div className="my-2">
  //         <Button
  //           label="New"
  //           icon="pi pi-plus"
  //           className="p-button-success mr-2"
  //           onClick={() => {
  //             setAddDia(true);
  //           }}
  //         />
  //       </div>
  //     </React.Fragment>
  //   );
  // };

  // const rightToolbarTemplate = () => {
  //   return (
  //     <React.Fragment>
  //       <Menu model={items} popup ref={menu} id="popup_menu" />
  //       <Button className="mr-2" label="Import" icon="pi pi-upload" onClick={(event) => menu.current.toggle(event)} aria-controls="popup_menu" aria-haspopup />
  //       <Button
  //         label="Export"
  //         icon="pi pi-download"
  //         className="p-button"
  //         onClick={exportCSV}
  //       />
  //     </React.Fragment>
  //   );
  // };

  // const items = [
  //   {
  //     label: 'Download Sample File',
  //     icon: 'pi pi-download',
  //     command: () => {
  //       window.location.href = 'http://localhost:3000/documents/classification-sample-data.csv'
  //     }
  //   },
  //   {
  //     label: 'Upload File',
  //     icon: 'pi pi-upload',
  //     command: () => {
  //       navigate("/classifications/fileimport");
  //     }
  //   }
  // ];

  // const exportCSV = () => {
  //   dt.current.exportCSV();
  // };


  return (
    <div className="card">
      <Toast ref={toast} />
      {/* <Toolbar className="mb-4"
        left={leftToolbarTemplate}
        right={rightToolbarTemplate}
      >

      </Toolbar> */}
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
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} facility structures"
        totalRecords={countClassifications}
        globalFilter={globalFilter}
        emptyMessage="No classifications found."
        header={header}
        selectionMode="single"
        onSelectionChange={(e) => {

          let faciliyControl: any = structureData.find((data) => data.facility_id === e.value._id);
          console.log(faciliyControl);

          if (!faciliyControl) {
            addItem(e.value._id, e.value.facility_name);
          }
          else {
            navigate("/facilitystructure/" + faciliyControl._id);
          }
        }}
        responsiveLayout="scroll"
        onSort={onSort}
        sortField={lazyParams.sortField}
        sortOrder={lazyParams.sortOrder}
      >
        {/* <Column field="_id" header="Code" sortable></Column> */}
        <Column field="facility_name" header="Name" sortable></Column>
      </DataTable>

      {/* <Dialog
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
      </Dialog> */}

    </div>
  );
};

export default FacilityStructure;
