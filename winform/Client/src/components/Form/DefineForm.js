import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import FormBuilderService from "../../services/formBuilder";

const InputComponent = (props) => {
  console.log(props);
  const [displayResponsive, setDisplayResponsive] = useState(false);
  const [position, setPosition] = useState("center");
  const dialogFuncMap = {
    displayResponsive: setDisplayResponsive,
  };
  const onClick = (name, position) => {
    dialogFuncMap[`${name}`](true);

    if (position) {
      setPosition(position);
    }
  };

  const onHide = (name) => {
    dialogFuncMap[`${name}`](false);
  };

  const renderFooter = (name) => {
    return (
      <div>
        <Button
          label="No"
          icon="pi pi-times"
          onClick={() => onHide(name)}
          className="p-button-text"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          onClick={() => onHide(name)}
          autoFocus
        />
      </div>
    );
  };
  return (
    <div key={props.index} className="field">
      <Dialog
        header="Options"
        visible={displayResponsive}
        onHide={() => onHide("displayResponsive")}
        breakpoints={{ "960px": "75vw" }}
        style={{ width: "30vw" }}
        footer={renderFooter("displayResponsive")}
      >
        deneme
        <div>
          <InputText
            placeholder="Label"
            className="block mb-2"
            onChange={(e) => {
              props.setItems((prevValue) => {
                const temp = [...prevValue];
                console.log(temp);
                temp[props.index].label = e.target.value;
                return temp;
              });
            }}
            value={props.item.label}
          />

          <InputText
            placeholder="Placeholder"
            className="block mb-2"
            onChange={(e) => {
              props.setItems((prevValue) => {
                const temp = [...prevValue];
                temp[props.index].placeholder = e.target.value;
                return temp;
              });
            }}
            value={props.item.placeholder}
          />
          <InputText
            placeholder="Default Value"
            className="block mb-2"
            onChange={(e) => {
              props.setItems((prevValue) => {
                const temp = [...prevValue];
                temp[props.index].defaultValue = e.target.value;
                return temp;
              });
            }}
            value={props.item.defaultValue}
          />
        </div>
        <div className="my-2">
          <Checkbox
            inputId="cb1"
            onChange={(e) => {
              props.setItems((prevValue) => {
                const temp = [...prevValue];
                temp[props.index].rules.required =
                  !temp[props.index].rules.required;
                return temp;
              });
            }}
            checked={props.isRequired}
          ></Checkbox>
          <label htmlFor="cb1" className="p-checkbox-label ml-2">
            isRequired
          </label>
        </div>
      </Dialog>

      <InputText disabled placeholder="Text" />

      <Button
        className="ml-2 p-button-sm p-button-raised p-button-info"
        label="Details"
        onClick={() => onClick("displayResponsive")}
      />
      <Button
        className="ml-2 p-button-sm p-button-raised p-button-danger"
        label="Remove"
        onClick={() => {
          const list = [...props.items];
          list.splice(props.index, 1);
          props.setItems(list);
        }}
      />
    </div>
  );
};

const InputTextareaComponent = (props) => {
  const [displayResponsive, setDisplayResponsive] = useState(false);
  const [position, setPosition] = useState("center");
  const dialogFuncMap = {
    displayResponsive: setDisplayResponsive,
  };
  const onClick = (name, position) => {
    dialogFuncMap[`${name}`](true);

    if (position) {
      setPosition(position);
    }
  };

  const onHide = (name) => {
    dialogFuncMap[`${name}`](false);
  };

  const renderFooter = (name) => {
    return (
      <div>
        <Button
          label="No"
          icon="pi pi-times"
          onClick={() => onHide(name)}
          className="p-button-text"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          onClick={() => onHide(name)}
          autoFocus
        />
      </div>
    );
  };
  return (
    <div key={props.index} className="field">
      <Dialog
        header="Options"
        visible={displayResponsive}
        onHide={() => onHide("displayResponsive")}
        breakpoints={{ "960px": "75vw" }}
        style={{ width: "30vw" }}
        footer={renderFooter("displayResponsive")}
      >
        deneme
        <div>
          <InputText
            placeholder="Label"
            className="block mb-2"
            onChange={(e) => {
              props.setItems((prevValue) => {
                const temp = [...prevValue];
                temp[props.index].label = e.target.value;
                return temp;
              });
            }}
            value={props.item.label}
          />

          <InputText
            placeholder="Placeholder"
            className="block mb-2"
            onChange={(e) => {
              props.setItems((prevValue) => {
                const temp = [...prevValue];
                temp[props.index].placeholder = e.target.value;
                return temp;
              });
            }}
            value={props.item.placeholder}
          />
          <InputText
            placeholder="Default Value"
            className="block mb-2"
            onChange={(e) => {
              props.setItems((prevValue) => {
                const temp = [...prevValue];
                temp[props.index].defaultValue = e.target.value;
                return temp;
              });
            }}
            value={props.item.defaultValue}
          />
        </div>
        <div className="my-2">
          <Checkbox
            inputId="cb2"
            onChange={(e) => {
              props.setItems((prevValue) => {
                const temp = [...prevValue];
                temp[props.index].rules.required =
                  !temp[props.index].rules.required;
                return temp;
              });
            }}
            checked={props.isRequired}
          ></Checkbox>
          <label htmlFor="cb2" className="p-checkbox-label ml-2">
            isRequired
          </label>
        </div>
      </Dialog>

      <InputTextarea disabled placeholder="Text Area" />

      <Button
        className="ml-2 p-button-sm p-button-raised p-button-info"
        label="Details"
        onClick={() => onClick("displayResponsive")}
      />
      <Button
        className="ml-2 p-button-sm p-button-raised p-button-danger"
        label="Remove"
        onClick={() => {
          const list = [...props.items];
          list.splice(props.index, 1);
          props.setItems(list);
        }}
      />
    </div>
  );
};

const DropDownComponent = (props) => {
  const [displayResponsive, setDisplayResponsive] = useState(false);
  const [displayResponsive2, setDisplayResponsive2] = useState(false);
  const [position, setPosition] = useState("center");
  const dialogFuncMap = {
    displayResponsive: setDisplayResponsive,
  };
  const dialogFuncMap2 = {
    displayResponsive2: setDisplayResponsive2,
  };
  const onClick = (name, position) => {
    dialogFuncMap[`${name}`](true);

    if (position) {
      setPosition(position);
    }
  };
  const onClick2 = (name, position) => {
    dialogFuncMap2[`${name}`](true);

    if (position) {
      setPosition(position);
    }
  };
  const onHide = (name) => {
    dialogFuncMap[`${name}`](false);
  };
  const onHide2 = (name) => {
    dialogFuncMap2[`${name}`](false);
  };

  const renderFooter = (name) => {
    return (
      <div>
        <Button
          label="No"
          icon="pi pi-times"
          onClick={() => onHide(name)}
          className="p-button-text"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          onClick={() => onHide(name)}
          autoFocus
        />
      </div>
    );
  };

  const renderFooter2 = (name) => {
    return (
      <div>
        <Button
          label="No"
          icon="pi pi-times"
          onClick={() => onHide2(name)}
          className="p-button-text"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          onClick={() => {
            props.setItems((prevValue) => {
              const temp = [...prevValue];
              temp[props.index].options = inputList;
              return temp;
            });
            setTimeout(() => {
              onHide2(name);
            }, 500);
          }}
          autoFocus
        />
      </div>
    );
  };

  const [inputList, setInputList] = useState([{ optionsName: "" }]);

  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([...inputList, { optionsName: "" }]);
  };
  return (
    <div key={props.index} className="field">
      <Dropdown disabled placeholder="Dropdown" />
      <Button
        className="ml-2 p-button-sm p-button-raised p-button-info"
        label="Details"
        onClick={() => onClick("displayResponsive")}
      />
      <Button
        className="ml-2 p-button-sm p-button-raised p-button-danger"
        label="Remove"
        onClick={() => {
          const list = [...props.items];
          list.splice(props.index, 1);
          props.setItems(list);
        }}
      />

      <Dialog
        header="Options"
        visible={displayResponsive}
        onHide={() => onHide("displayResponsive")}
        breakpoints={{ "960px": "75vw" }}
        style={{ width: "30vw" }}
        footer={renderFooter("displayResponsive")}
      >
        deneme
        <div>
          <InputText
            placeholder="Label"
            className="block mb-2"
            onChange={(e) => {
              props.setItems((prevValue) => {
                const temp = [...prevValue];
                temp[props.index].label = e.target.value;
                return temp;
              });
            }}
            value={props.item.label}
          />

          <InputText
            placeholder="Placeholder"
            className="block mb-2"
            onChange={(e) => {
              props.setItems((prevValue) => {
                const temp = [...prevValue];
                temp[props.index].placeholder = e.target.value;
                return temp;
              });
            }}
            value={props.item.placeholder}
          />
          <InputText
            placeholder="Default Value"
            className="block mb-2"
            onChange={(e) => {
              props.setItems((prevValue) => {
                const temp = [...prevValue];
                temp[props.index].defaultValue = e.target.value;
                return temp;
              });
            }}
            value={props.item.defaultValue}
          />
        </div>
        <div className="my-2">
          <Checkbox
            inputId="cb1"
            onChange={(e) => {
              props.setItems((prevValue) => {
                const temp = [...prevValue];
                temp[props.index].rules.required =
                  !temp[props.index].rules.required;
                return temp;
              });
            }}
            checked={props.isRequired}
          ></Checkbox>
          <label htmlFor="cb1" className="p-checkbox-label ml-2">
            isRequired
          </label>
        </div>
        <Button
          className="ml-3"
          label="Options"
          icon="pi pi-external-link"
          onClick={() => onClick2("displayResponsive2")}
        />
      </Dialog>
      <Dialog
        header="Options"
        visible={displayResponsive2}
        onHide={() => onHide2("displayResponsive2")}
        breakpoints={{ "960px": "75vw" }}
        style={{ width: "30vw" }}
        footer={renderFooter2("displayResponsive2")}
      >
        {inputList.map((x, i) => {
          return (
            <div key={i} className="box">
              <InputText
                name="optionsName"
                placeholder="Enter Option Name"
                value={x.optionsName}
                onChange={(e) => handleInputChange(e, i)}
              />
              <div className="btn-box">
                {inputList.length !== 1 && (
                  <Button className="my-2" onClick={() => handleRemoveClick(i)}>
                    Remove
                  </Button>
                )}
                {inputList.length - 1 === i && (
                  <Button className="my-2 ml-2" onClick={handleAddClick}>
                    Add
                  </Button>
                )}
              </div>
            </div>
          );
        })}
        <div style={{ marginTop: 20 }}>{JSON.stringify(inputList)}</div>
      </Dialog>
    </div>
  );
};

const RadioComponent = (props) => {
  const [displayResponsive, setDisplayResponsive] = useState(false);
  const [displayResponsive2, setDisplayResponsive2] = useState(false);
  const [position, setPosition] = useState("center");
  const dialogFuncMap = {
    displayResponsive: setDisplayResponsive,
  };
  const dialogFuncMap2 = {
    displayResponsive2: setDisplayResponsive2,
  };
  const onClick = (name, position) => {
    dialogFuncMap[`${name}`](true);

    if (position) {
      setPosition(position);
    }
  };
  const onClick2 = (name, position) => {
    dialogFuncMap2[`${name}`](true);

    if (position) {
      setPosition(position);
    }
  };
  const onHide = (name) => {
    dialogFuncMap[`${name}`](false);
  };
  const onHide2 = (name) => {
    dialogFuncMap2[`${name}`](false);
  };

  const renderFooter = (name) => {
    return (
      <div>
        <Button
          label="No"
          icon="pi pi-times"
          onClick={() => onHide(name)}
          className="p-button-text"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          onClick={() => onHide(name)}
          autoFocus
        />
      </div>
    );
  };

  const renderFooter2 = (name) => {
    return (
      <div>
        <Button
          label="No"
          icon="pi pi-times"
          onClick={() => onHide2(name)}
          className="p-button-text"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          onClick={() => {
            props.setItems((prevValue) => {
              const temp = [...prevValue];
              temp[props.index].options = inputList;
              return temp;
            });
            setTimeout(() => {
              onHide2(name);
            }, 500);
          }}
          autoFocus
        />
      </div>
    );
  };

  const [inputList, setInputList] = useState([{ optionsName: "" }]);

  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([...inputList, { optionsName: "" }]);
  };
  return (
    <div key={props.index} className="field">
      <RadioButton disabled placeholder="RadioButton" />
      <span className="ml-2" style={{ color: "#a3a9af" }}>
        RadioButton
      </span>
      <Button
        className="ml-2 p-button-sm p-button-raised p-button-info"
        label="Details"
        onClick={() => onClick("displayResponsive")}
      />
      <Button
        className="ml-2 p-button-sm p-button-raised p-button-danger"
        label="Remove"
        onClick={() => {
          const list = [...props.items];
          list.splice(props.index, 1);
          props.setItems(list);
        }}
      />

      <Dialog
        header="Options"
        visible={displayResponsive}
        onHide={() => onHide("displayResponsive")}
        breakpoints={{ "960px": "75vw" }}
        style={{ width: "30vw" }}
        footer={renderFooter("displayResponsive")}
      >
        deneme
        <div>
          <InputText
            placeholder="Label"
            className="block mb-2"
            onChange={(e) => {
              props.setItems((prevValue) => {
                const temp = [...prevValue];
                temp[props.index].label = e.target.value;
                return temp;
              });
            }}
            value={props.item.label}
          />

          <InputText
            placeholder="Placeholder"
            className="block mb-2"
            onChange={(e) => {
              props.setItems((prevValue) => {
                const temp = [...prevValue];
                temp[props.index].placeholder = e.target.value;
                return temp;
              });
            }}
            value={props.item.placeholder}
          />
          <InputText
            placeholder="Default Value"
            className="block mb-2"
            onChange={(e) => {
              props.setItems((prevValue) => {
                const temp = [...prevValue];
                temp[props.index].defaultValue = e.target.value;
                return temp;
              });
            }}
            value={props.item.defaultValue}
          />
        </div>
        <div className="my-2">
          <Checkbox
            inputId="cb4"
            onChange={(e) => {
              props.setItems((prevValue) => {
                const temp = [...prevValue];
                temp[props.index].rules.required =
                  !temp[props.index].rules.required;
                return temp;
              });
            }}
            checked={props.isRequired}
          ></Checkbox>
          <label htmlFor="cb4" className="p-checkbox-label ml-2">
            isRequired
          </label>
        </div>
        <Button
          className="ml-3"
          label="Options"
          icon="pi pi-external-link"
          onClick={() => onClick2("displayResponsive2")}
        />
      </Dialog>
      <Dialog
        header="Options"
        visible={displayResponsive2}
        onHide={() => onHide2("displayResponsive2")}
        breakpoints={{ "960px": "75vw" }}
        style={{ width: "30vw" }}
        footer={renderFooter2("displayResponsive2")}
      >
        {inputList.map((x, i) => {
          return (
            <div key={i} className="box">
              <InputText
                name="optionsName"
                placeholder="Enter Option Name"
                value={x.optionsName}
                onChange={(e) => handleInputChange(e, i)}
              />
              <div className="btn-box">
                {inputList.length !== 1 && (
                  <Button className="my-2" onClick={() => handleRemoveClick(i)}>
                    Remove
                  </Button>
                )}
                {inputList.length - 1 === i && (
                  <Button className="my-2 ml-2" onClick={handleAddClick}>
                    Add
                  </Button>
                )}
              </div>
            </div>
          );
        })}
        <div style={{ marginTop: 20 }}>{JSON.stringify(inputList)}</div>
      </Dialog>
    </div>
  );
};

const CheckBoxComponent = (props) => {
  const [displayResponsive, setDisplayResponsive] = useState(false);
  const [position, setPosition] = useState("center");
  const dialogFuncMap = {
    displayResponsive: setDisplayResponsive,
  };
  const onClick = (name, position) => {
    dialogFuncMap[`${name}`](true);

    if (position) {
      setPosition(position);
    }
  };

  const onHide = (name) => {
    dialogFuncMap[`${name}`](false);
  };

  const renderFooter = (name) => {
    return (
      <div>
        <Button
          label="No"
          icon="pi pi-times"
          onClick={() => onHide(name)}
          className="p-button-text"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          onClick={() => onHide(name)}
          autoFocus
        />
      </div>
    );
  };
  return (
    <div key={props.index} className="field">
      <Dialog
        header="Options"
        visible={displayResponsive}
        onHide={() => onHide("displayResponsive")}
        breakpoints={{ "960px": "75vw" }}
        style={{ width: "30vw" }}
        footer={renderFooter("displayResponsive")}
      >
        deneme
        <div>
          <InputText
            placeholder="Label"
            className="block mb-2"
            onChange={(e) => {
              props.setItems((prevValue) => {
                const temp = [...prevValue];
                temp[props.index].label = e.target.value;
                return temp;
              });
            }}
            value={props.item.label}
          />
          <InputText
            placeholder="Checkbox Label"
            className="block mb-2"
            onChange={(e) => {
              props.setItems((prevValue) => {
                const temp = [...prevValue];
                temp[props.index].checkboxLabel = e.target.value;
                return temp;
              });
            }}
            value={props.item.checkboxLabel}
          />

          <InputText
            placeholder="Placeholder"
            className="block mb-2"
            onChange={(e) => {
              props.setItems((prevValue) => {
                const temp = [...prevValue];
                temp[props.index].placeholder = e.target.value;
                return temp;
              });
            }}
            value={props.item.placeholder}
          />
          <InputText
            placeholder="Default Value"
            className="block mb-2"
            onChange={(e) => {
              props.setItems((prevValue) => {
                const temp = [...prevValue];
                temp[props.index].defaultValue = e.target.value;
                return temp;
              });
            }}
            value={props.item.defaultValue}
          />
        </div>
        <div className="my-2">
          <Checkbox
            inputId="cb5"
            onChange={(e) => {
              props.setItems((prevValue) => {
                const temp = [...prevValue];
                temp[props.index].rules.required =
                  !temp[props.index].rules.required;
                return temp;
              });
            }}
            checked={props.isRequired}
          ></Checkbox>
          <label htmlFor="cb5" className="p-checkbox-label ml-2">
            isRequired
          </label>
        </div>
      </Dialog>
      <Checkbox disabled></Checkbox>{" "}
      <span className="ml-2" style={{ color: "#a3a9af" }}>
        Checkbox
      </span>
      <Button
        className="ml-2 p-button-sm p-button-raised p-button-info"
        label="Details"
        onClick={() => onClick("displayResponsive")}
      />
      <Button
        className="ml-2 p-button-sm p-button-raised p-button-danger"
        label="Remove"
        onClick={() => {
          const list = [...props.items];
          list.splice(props.index, 1);
          props.setItems(list);
        }}
      />
    </div>
  );
};

const DateComponent = (props) => {
  const [displayResponsive, setDisplayResponsive] = useState(false);
  const [position, setPosition] = useState("center");
  const dialogFuncMap = {
    displayResponsive: setDisplayResponsive,
  };
  const onClick = (name, position) => {
    dialogFuncMap[`${name}`](true);

    if (position) {
      setPosition(position);
    }
  };

  const onHide = (name) => {
    dialogFuncMap[`${name}`](false);
  };

  const renderFooter = (name) => {
    return (
      <div>
        <Button
          label="No"
          icon="pi pi-times"
          onClick={() => onHide(name)}
          className="p-button-text"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          onClick={() => onHide(name)}
          autoFocus
        />
      </div>
    );
  };
  return (
    <div key={props.index} className="field">
      <Dialog
        header="Options"
        visible={displayResponsive}
        onHide={() => onHide("displayResponsive")}
        breakpoints={{ "960px": "75vw" }}
        style={{ width: "30vw" }}
        footer={renderFooter("displayResponsive")}
      >
        deneme
        <div>
          <InputText
            placeholder="Label"
            className="block mb-2"
            onChange={(e) => {
              props.setItems((prevValue) => {
                const temp = [...prevValue];
                temp[props.index].label = e.target.value;
                return temp;
              });
            }}
            value={props.item.label}
          />

          <InputText
            placeholder="Placeholder"
            className="block mb-2"
            onChange={(e) => {
              props.setItems((prevValue) => {
                const temp = [...prevValue];
                temp[props.index].placeholder = e.target.value;
                return temp;
              });
            }}
            value={props.item.placeholder}
          />
          <InputText
            placeholder="Default Value"
            className="block mb-2"
            onChange={(e) => {
              props.setItems((prevValue) => {
                const temp = [...prevValue];
                temp[props.index].defaultValue = e.target.value;
                return temp;
              });
            }}
            value={props.item.defaultValue}
          />
        </div>
        <div className="my-2">
          <Checkbox
            inputId="cb6"
            onChange={(e) => {
              props.setItems((prevValue) => {
                const temp = [...prevValue];
                temp[props.index].rules.required =
                  !temp[props.index].rules.required;
                return temp;
              });
            }}
            checked={props.isRequired}
          ></Checkbox>
          <label htmlFor="cb6" className="p-checkbox-label ml-2">
            isRequired
          </label>
        </div>
      </Dialog>

      <Calendar disabled placeholder="Date" showIcon />
      <Button
        className="ml-2 p-button-sm p-button-raised p-button-info"
        label="Details"
        onClick={() => onClick("displayResponsive")}
      />
      <Button
        className="ml-2 p-button-sm p-button-raised p-button-danger"
        label="Remove"
        onClick={() => {
          const list = [...props.items];
          list.splice(props.index, 1);
          props.setItems(list);
        }}
      />
    </div>
  );
};

const DefineForm = ({
  submitted,
  setSubmitted,
  hideDialog,
  toast,
  loadLazyData,
  formList,
}) => {
  const [items, setItems] = useState([]);
  const [formName, setFormName] = useState("");
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setItems(formList.items);
    setFormName(formList.name);
  },[])

  console.log(formList);

  return (
    <div className="grid">
      <div className="col-3 mt-5">
        <div>
          <Button
            className="mt-5"
            style={{ width: "100px" }}
            onClick={() => {
              setItems([
                ...items,
                {
                  type: "text",
                  label: "",
                  placeholder: "",
                  defaultValue: "",
                  rules: { required: false },
                },
              ]);
            }}
          >
            Text
          </Button>
        </div>
        <div>
          <Button
            className="mt-4"
            style={{ width: "100px" }}
            onClick={() => {
              setItems([
                ...items,
                {
                  type: "textarea",
                  label: "",
                  placeholder: "",
                  defaultValue: "",
                  rules: { required: false },
                },
              ]);
            }}
          >
            Text Area
          </Button>
        </div>
        <div>
          <Button
            className="mt-4"
            style={{ width: "100px" }}
            onClick={() => {
              setItems([
                ...items,
                {
                  type: "dropdown",
                  label: "",
                  placeholder: "",
                  defaultValue: "",
                  rules: { required: false },
                  options: [],
                },
              ]);
            }}
          >
            Dropdown
          </Button>
        </div>
        <div>
          <Button
            className="mt-4"
            style={{ width: "100px" }}
            onClick={() => {
              setItems([
                ...items,
                {
                  type: "radio",
                  label: "",
                  placeholder: "",
                  defaultValue: "",
                  rules: { required: false },
                  options: [],
                },
              ]);
            }}
          >
            RadioButton
          </Button>
        </div>
        <div>
          <Button
            className="mt-4"
            style={{ width: "100px" }}
            onClick={() => {
              setItems([
                ...items,
                {
                  type: "checkbox",
                  label: "",
                  checkboxLabel: "",
                  placeholder: "",
                  defaultValue: "",
                  rules: { required: false },
                },
              ]);
            }}
          >
            CheckBox
          </Button>
        </div>
        <div>
          <Button
            className="mt-4"
            style={{ width: "100px" }}
            onClick={() => {
              setItems([
                ...items,
                {
                  type: "date",
                  label: "",
                  placeholder: "",
                  defaultValue: "",
                  rules: { required: false },
                },
              ]);
            }}
          >
            Date
          </Button>
        </div>
      </div>

      <div className="col-9">
        <div className="field">
          <label className="block">Form Name</label>
          <InputText
            style={{ width: "30%" }}
            onChange={(e) => setFormName(e.target.value)}
            value={formName}
          />
        </div>
        {/* {formList.items.map((item, index) => {
          if (item.type === "text") {
            return (
              <InputComponent
                key={index}
                index={index}
                setItems={setItems}
                item={item}
                items={items}
                isRequired={item.rules.required}
              />
            );
          } else if (item.type === "textarea") {
            return (
              <InputTextareaComponent
                key={index}
                index={index}
                setItems={setItems}
                item={item}
                items={items}
                isRequired={item.rules.required}
              />
            );
          } else if (item.type === "dropdown") {
            return (
              <DropDownComponent
                key={index}
                index={index}
                setItems={setItems}
                item={item}
                items={items}
                isRequired={item.rules.required}
              />
            );
          } else if (item.type === "radio") {
            return (
              <RadioComponent
                key={index}
                index={index}
                setItems={setItems}
                item={item}
                items={items}
                isRequired={item.rules.required}
              />
            );
          } else if (item.type === "checkbox") {
            return (
              <CheckBoxComponent
                key={index}
                index={index}
                setItems={setItems}
                item={item}
                items={items}
                isRequired={item.rules.required}
              />
            );
          } else if (item.type === "date") {
            return (
              <DateComponent
                key={index}
                index={index}
                setItems={setItems}
                item={item}
                items={items}
                isRequired={item.rules.required}
              />
            );
          }
        })} */}

        {items.map((item, index) => {
          if (item.type === "text") {
            return (
              <InputComponent
                key={index}
                index={index}
                setItems={setItems}
                item={item}
                items={items}
                isRequired={item.rules.required}
              />
            );
          } else if (item.type === "textarea") {
            return (
              <InputTextareaComponent
                key={index}
                index={index}
                setItems={setItems}
                item={item}
                items={items}
                isRequired={item.rules.required}
              />
            );
          } else if (item.type === "dropdown") {
            return (
              <DropDownComponent
                key={index}
                index={index}
                setItems={setItems}
                item={item}
                items={items}
                isRequired={item.rules.required}
              />
            );
          } else if (item.type === "radio") {
            return (
              <RadioComponent
                key={index}
                index={index}
                setItems={setItems}
                item={item}
                items={items}
                isRequired={item.rules.required}
              />
            );
          } else if (item.type === "checkbox") {
            return (
              <CheckBoxComponent
                key={index}
                index={index}
                setItems={setItems}
                item={item}
                items={items}
                isRequired={item.rules.required}
              />
            );
          } else if (item.type === "date") {
            return (
              <DateComponent
                key={index}
                index={index}
                setItems={setItems}
                item={item}
                items={items}
                isRequired={item.rules.required}
              />
            );
          }
        })}

        {items.length > 0 ? (
          <Button
            onClick={() => {
              const data = {
                name: formName,
                items: items,
              };
              FormBuilderService.update(data).then((res) => {
                // navigate("/formbuilder");
              });
            }}
          >
            Save
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default DefineForm;
