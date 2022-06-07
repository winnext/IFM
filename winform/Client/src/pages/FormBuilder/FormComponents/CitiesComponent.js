import React, { useEffect, useState, useRef } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox } from 'primereact/checkbox';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from 'primereact/radiobutton';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

function CitiesComponent(props) {
  const [displayResponsive, setDisplayResponsive] = useState(false);
  const [position, setPosition] = useState('center');

  //Form property sıralama indeksi
  useEffect(() => {
    props.setItems((prevValue) => {
      const temp = [...prevValue];
      temp[props.index].index = props.index;
      return temp;
    });
  }, [props.index]);

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
          label="Cancel"
          icon="pi pi-times"
          onClick={() => onHide(name)}
          className="p-button-text"
        />
        <Button
          label="Save"
          icon="pi pi-check"
          onClick={() => onHide(name)}
          autoFocus
        />
      </div>
    );
  };

  const data = [
    {
      optionsName: 'İstanbul',
    },
    {
      optionsName: 'Ankara',
    },
    {
      optionsName: 'İzmir',
    },
    {
      optionsName: 'Eskişehir',
    },
  ];

  const [inputList, setInputList] = useState(data);
  console.log(props.item.options.length);
  useEffect(() => {
    props.setItems((prevValue) => {
      const temp = [...prevValue];
      temp[props.index].options = inputList;
      return temp;
    });
  }, [props.item.options]);

  return (
    <div key={props.index} className="field">
      <Dropdown disabled placeholder="Cities" style={{ width: 250 }} />
      <div className="flex justify-content-between mt-2">
        <div>
          <Button
            className="p-button-rounded p-button-sm p-button-secondary"
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
      </Dialog>
    </div>
  );
}

export default CitiesComponent;
