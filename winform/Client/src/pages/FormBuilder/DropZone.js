import React, { useEffect, useState, useRef } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import DraggableItem from './DraggableItem';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox } from 'primereact/checkbox';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from 'primereact/radiobutton';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

const InputComponent = (props) => {
  console.log(props);
  console.log(props.item.rules.required);
  const [displayResponsive, setDisplayResponsive] = useState(false);
  const [position, setPosition] = useState('center');
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
        header="Details"
        visible={displayResponsive}
        onHide={() => onHide('displayResponsive')}
        breakpoints={{ '960px': '75vw' }}
        style={{ width: '30vw' }}
        footer={renderFooter('displayResponsive')}
      >
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
            checked={props.item.rules.required}
          ></Checkbox>
          <label htmlFor="cb1" className="p-checkbox-label ml-2">
            isRequired
          </label>
        </div>
      </Dialog>

      <InputText disabled placeholder="Text" style={{ width: 250 }} />

      <div className="flex justify-content-between mt-2">
        <div>
          <Button
            className="p-button-rounded p-button-sm  p-button-info"
            label="Details"
            onClick={() => onClick('displayResponsive')}
          />
        </div>
        {!props.item._id ? (
          <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-danger"
            onClick={() => {
              const list = [...props.items];
              list.splice(props.index, 1);
              props.setItems(list);
            }}
          />
        ) : (
          <div>
            {props.item.isActive === true ? (
              <span className="mr-2 font-bold text-lg">Active</span>
            ) : (
              <span className="mr-2 font-bold text-lg">Passive</span>
            )}
            <Checkbox
              inputId="cb11"
              onChange={(e) => {
                props.setItems((prevValue) => {
                  const temp = [...prevValue];
                  temp[props.index].isActive = !temp[props.index].isActive;
                  return temp;
                });
              }}
              checked={props.item.isActive}
            ></Checkbox>
          </div>
        )}
      </div>
    </div>
  );
};

const InputTextareaComponent = (props) => {
  console.log(props);
  const [displayResponsive, setDisplayResponsive] = useState(false);
  const [position, setPosition] = useState('center');
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
        header="Details"
        visible={displayResponsive}
        onHide={() => onHide('displayResponsive')}
        breakpoints={{ '960px': '75vw' }}
        style={{ width: '30vw' }}
        footer={renderFooter('displayResponsive')}
      >
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
            checked={props.item.rules.required}
          ></Checkbox>
          <label htmlFor="cb2" className="p-checkbox-label ml-2">
            isRequired
          </label>
        </div>
      </Dialog>

      <InputTextarea disabled placeholder="Text Area" style={{ width: 250 }} />

      <div className="flex justify-content-between mt-2">
        <div>
          <Button
            className="p-button-rounded p-button-sm  p-button-info"
            label="Details"
            onClick={() => onClick('displayResponsive')}
          />
        </div>
        {!props.item._id ? (
          <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-danger"
            onClick={() => {
              const list = [...props.items];
              list.splice(props.index, 1);
              props.setItems(list);
            }}
          />
        ) : (
          <div>
            {props.item.isActive === true ? (
              <span className="mr-2 font-bold text-lg">Active</span>
            ) : (
              <span className="mr-2 font-bold text-lg">Passive</span>
            )}
            <Checkbox
              inputId="cb22"
              onChange={(e) => {
                props.setItems((prevValue) => {
                  const temp = [...prevValue];
                  temp[props.index].isActive = !temp[props.index].isActive;
                  return temp;
                });
              }}
              checked={props.item.isActive}
            ></Checkbox>
          </div>
        )}
      </div>
    </div>
  );
};

const DropDownComponent = (props) => {
  const [displayResponsive, setDisplayResponsive] = useState(false);
  const [displayResponsive2, setDisplayResponsive2] = useState(false);
  const [position, setPosition] = useState('center');
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
  const [inputList, setInputList] = useState([{ optionsName: '' }]);
  console.log(props.item.options.length);
  useEffect(() => {
    if (props.item.options.length > 0) {
      setInputList(props.item.options);
    }
  }, [props.item.options]);

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
    setInputList([...inputList, { optionsName: '' }]);
  };
  return (
    <div key={props.index} className="field">
      <Dropdown disabled placeholder="Dropdown" style={{ width: 250 }} />
      <div className="flex justify-content-between mt-2">
        <div>
          <Button
            className="p-button-rounded p-button-sm  p-button-info"
            label="Details"
            onClick={() => onClick('displayResponsive')}
          />
        </div>
        {!props.item._id ? (
          <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-danger"
            onClick={() => {
              const list = [...props.items];
              list.splice(props.index, 1);
              props.setItems(list);
            }}
          />
        ) : (
          <div>
            {props.item.isActive === true ? (
              <span className="mr-2 font-bold text-lg">Active</span>
            ) : (
              <span className="mr-2 font-bold text-lg">Passive</span>
            )}
            <Checkbox
              inputId="cb33"
              onChange={(e) => {
                props.setItems((prevValue) => {
                  const temp = [...prevValue];
                  temp[props.index].isActive = !temp[props.index].isActive;
                  return temp;
                });
              }}
              checked={props.item.isActive}
            ></Checkbox>
          </div>
        )}
      </div>

      <Dialog
        header="Details"
        visible={displayResponsive}
        onHide={() => onHide('displayResponsive')}
        breakpoints={{ '960px': '75vw' }}
        style={{ width: '30vw' }}
        footer={renderFooter('displayResponsive')}
      >
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
            checked={props.item.rules.required}
          ></Checkbox>
          <label htmlFor="cb1" className="p-checkbox-label ml-2">
            isRequired
          </label>
        </div>
        <Button
          className="ml-3"
          label="Options"
          icon="pi pi-external-link"
          onClick={() => onClick2('displayResponsive2')}
        />
      </Dialog>
      <Dialog
        header="Details"
        visible={displayResponsive2}
        onHide={() => onHide2('displayResponsive2')}
        breakpoints={{ '960px': '75vw' }}
        style={{ width: '30vw' }}
        footer={renderFooter2('displayResponsive2')}
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
  const [position, setPosition] = useState('center');
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

  const [inputList, setInputList] = useState([{ optionsName: '' }]);

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
    setInputList([...inputList, { optionsName: '' }]);
  };
  return (
    <div key={props.index} className="field">
      <RadioButton disabled placeholder="RadioButton" />
      <span className="ml-2" style={{ color: '#a3a9af' }}>
        RadioButton
      </span>
      <div className="flex justify-content-between mt-2">
        <div>
          <Button
            className="p-button-rounded p-button-sm  p-button-info"
            label="Details"
            onClick={() => onClick('displayResponsive')}
          />
        </div>
        {!props.item._id ? (
          <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-danger"
            onClick={() => {
              const list = [...props.items];
              list.splice(props.index, 1);
              props.setItems(list);
            }}
          />
        ) : (
          <div>
            {props.item.isActive === true ? (
              <span className="mr-2 font-bold text-lg">Active</span>
            ) : (
              <span className="mr-2 font-bold text-lg">Passive</span>
            )}
            <Checkbox
              inputId="cb44"
              onChange={(e) => {
                props.setItems((prevValue) => {
                  const temp = [...prevValue];
                  temp[props.index].isActive = !temp[props.index].isActive;
                  return temp;
                });
              }}
              checked={props.item.isActive}
            ></Checkbox>
          </div>
        )}
      </div>

      <Dialog
        header="Details"
        visible={displayResponsive}
        onHide={() => onHide('displayResponsive')}
        breakpoints={{ '960px': '75vw' }}
        style={{ width: '30vw' }}
        footer={renderFooter('displayResponsive')}
      >
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
            checked={props.item.rules.required}
          ></Checkbox>
          <label htmlFor="cb4" className="p-checkbox-label ml-2">
            isRequired
          </label>
        </div>
        <Button
          className="ml-3"
          label="Options"
          icon="pi pi-external-link"
          onClick={() => onClick2('displayResponsive2')}
        />
      </Dialog>
      <Dialog
        header="Details"
        visible={displayResponsive2}
        onHide={() => onHide2('displayResponsive2')}
        breakpoints={{ '960px': '75vw' }}
        style={{ width: '30vw' }}
        footer={renderFooter2('displayResponsive2')}
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
  const [position, setPosition] = useState('center');
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
        header="Details"
        visible={displayResponsive}
        onHide={() => onHide('displayResponsive')}
        breakpoints={{ '960px': '75vw' }}
        style={{ width: '30vw' }}
        footer={renderFooter('displayResponsive')}
      >
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
            checked={props.item.rules.required}
          ></Checkbox>
          <label htmlFor="cb5" className="p-checkbox-label ml-2">
            isRequired
          </label>
        </div>
      </Dialog>
      <Checkbox disabled></Checkbox>{' '}
      <span className="ml-2" style={{ color: '#a3a9af' }}>
        Checkbox
      </span>
      <div className="flex justify-content-between mt-2">
        <div>
          <Button
            className="p-button-rounded p-button-sm  p-button-info"
            label="Details"
            onClick={() => onClick('displayResponsive')}
          />
        </div>
        {!props.item._id ? (
          <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-danger"
            onClick={() => {
              const list = [...props.items];
              list.splice(props.index, 1);
              props.setItems(list);
            }}
          />
        ) : (
          <div>
            {props.item.isActive === true ? (
              <span className="mr-2 font-bold text-lg">Active</span>
            ) : (
              <span className="mr-2 font-bold text-lg">Passive</span>
            )}
            <Checkbox
              inputId="cb55"
              onChange={(e) => {
                props.setItems((prevValue) => {
                  const temp = [...prevValue];
                  temp[props.index].isActive = !temp[props.index].isActive;
                  return temp;
                });
              }}
              checked={props.item.isActive}
            ></Checkbox>
          </div>
        )}
      </div>
    </div>
  );
};

const DateComponent = (props) => {
  const [displayResponsive, setDisplayResponsive] = useState(false);
  const [position, setPosition] = useState('center');
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
        header="Details"
        visible={displayResponsive}
        onHide={() => onHide('displayResponsive')}
        breakpoints={{ '960px': '75vw' }}
        style={{ width: '30vw' }}
        footer={renderFooter('displayResponsive')}
      >
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
            checked={props.item.rules.required}
          ></Checkbox>
          <label htmlFor="cb6" className="p-checkbox-label ml-2">
            isRequired
          </label>
        </div>
      </Dialog>

      <Calendar disabled placeholder="Date" showIcon style={{ width: 250 }} />
      <div className="flex justify-content-between mt-2">
        <div>
          <Button
            className="p-button-rounded p-button-sm  p-button-info"
            label="Details"
            onClick={() => onClick('displayResponsive')}
          />
        </div>
        {!props.item._id ? (
          <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-danger"
            onClick={() => {
              const list = [...props.items];
              list.splice(props.index, 1);
              props.setItems(list);
            }}
          />
        ) : (
          <div>
            {props.item.isActive === true ? (
              <span className="mr-2 font-bold text-lg">Active</span>
            ) : (
              <span className="mr-2 font-bold text-lg">Passive</span>
            )}
            <Checkbox
              inputId="cb66"
              onChange={(e) => {
                props.setItems((prevValue) => {
                  const temp = [...prevValue];
                  temp[props.index].isActive = !temp[props.index].isActive;
                  return temp;
                });
              }}
              checked={props.item.isActive}
            ></Checkbox>
          </div>
        )}
      </div>
    </div>
  );
};

const DropZone = (props) => {
  const [hoverdCompId, sethoverdCompId] = React.useState(null);

  const renderItem = (item, index) => {
    switch (item.type) {
      case 'text':
        return (
          <InputComponent
            item={item}
            index={index}
            setItems={props.setItems}
            items={props.items}
          />
        );
      case 'textarea':
        return (
          <InputTextareaComponent
            item={item}
            index={index}
            setItems={props.setItems}
            items={props.items}
          />
        );
      case 'dropdown':
        return (
          <DropDownComponent
            item={item}
            index={index}
            setItems={props.setItems}
            items={props.items}
          />
        );
      case 'radio':
        return (
          <RadioComponent
            item={item}
            index={index}
            setItems={props.setItems}
            items={props.items}
          />
        );
      case 'checkbox':
        return (
          <CheckBoxComponent
            item={item}
            index={index}
            setItems={props.setItems}
            items={props.items}
          />
        );
      case 'date':
        return (
          <DateComponent
            item={item}
            index={index}
            setItems={props.setItems}
            items={props.items}
          />
        );
      default:
        break;
    }
  };

  const toggleHover = (e, item) => {
    sethoverdCompId(item.id);
  };
  return (
    <div>
      <Droppable droppableId={props.droppableId}>
        {(provided, snapshot) => (
          <div
            style={{
              minHeight: 500,
              backgroundColor: snapshot.isDraggingOver ? '#f5f5f5' : '',
            }}
            ref={provided.innerRef}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {props.items.length > 0
              ? props.items.map((item, index) => (
                  <DraggableItem
                    key={'di' + index}
                    item={item}
                    index={index}
                    hoverdCompId={hoverdCompId}
                    renderItem={renderItem}
                    toggleHover={toggleHover}
                  />
                ))
              : !snapshot.isDraggingOver && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: 500,
                    }}
                  >
                    <p>Drop items here</p>
                  </div>
                )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default DropZone;
