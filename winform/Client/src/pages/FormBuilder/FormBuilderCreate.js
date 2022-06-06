import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { v4 as uuid } from 'uuid';
import { DragDropContext } from 'react-beautiful-dnd';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import Toolbox from './ToolBox';
import DropZone from './DropZone';
import ITEMS from './Items';
import FormGenerate from '../FormGenerate/FormGenerate';
import FormBuilderService from '../../services/formBuilder';

function FormBuilderCreate() {
  const [items, setItems] = useState([]);
  const [formName, setFormName] = useState('');
  const [parentId, setParentId] = useState('');
  const toast = React.useRef(null);
  const navigate = useNavigate();
  const [displayResponsive, setDisplayResponsive] = useState(false);
  const [position, setPosition] = useState('center');

  const params = useLocation();
  const paramsId = useParams();
  console.log(params);
  console.log(paramsId);

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

  useLayoutEffect(() => {
    if (params.state) {
      localStorage.setItem('data', JSON.stringify(params.state.data));
      localStorage.setItem('formbuilderId', JSON.stringify(params.state.id));
    }
    setFormName(JSON.parse(localStorage.getItem('data')).name);
    setParentId(JSON.parse(localStorage.getItem('formbuilderId')));
  }, []);

  useEffect(() => {
    FormBuilderService.getProperties(paramsId.id)
      .then((res) => {
        console.log(res.data);

        const convertedData = res.data.map(function (item) {
          return {
            ...item,
            rules: { required: item.rules[0] },
            options: item.options.map(function (option) {
              return { optionsName: option };
            }),
          };
        });
        setItems(convertedData);
      })
      .catch((err) => {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: err.response ? err.response.data.message : err.message,
          life: 2000,
        });
      });
  }, [paramsId.id]);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const copy = (
    source,
    destination,
    droppableSource,
    droppableDestination,
    isBase,
  ) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const item = sourceClone[droppableSource.index];

    if (isBase) {
      destClone.splice(droppableDestination.index, 0, {
        type: item.type,
        label: '',
        defaultValue: '',
        rules: { required: false },
        // rules: [false],
        tag: ['deneme'],
        typeId: uuid(),
        key: uuid(),
        labelclass: 'TypeProperty',
        parent_id: paramsId.id,
        options: [],
        isActive: true,
        placeholder: '',
        label2: '',
        index: '',
      });
    } else {
      console.log('Droppable dest ', droppableDestination);
    }
    return destClone;
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    switch (source.droppableId) {
      case destination.droppableId:
        setItems((prevValue) =>
          reorder(prevValue, source.index, destination.index),
        );
        break;
      case 'Toolbox':
        setItems(copy(ITEMS, items, source, destination, true));
        break;
      default:
        break;
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Toast ref={toast} position="top-right" />
      <div className="grid">
        <div className="col-2">
          <Toolbox />
        </div>
        <div className="col-8">
          <div className="field">
            <h5 className="block">Form Name : {formName} </h5>
            <Button
              label="Form Show"
              icon="pi pi-book"
              onClick={() => onClick('displayResponsive')}
            />
          </div>
          <Card>
            <DropZone droppableId="form" items={items} setItems={setItems} />
          </Card>
        </div>
        <div className="col-2">
          <Button
            onClick={() => {
              const data = items;
              console.log(data);
              // console.log(dataNeo4j);
              const dataNeo4j = data.map((item) => {
                return {
                  key: item.key,
                  type: item.type,
                  typeId: item.typeId,
                  label: item.label,
                  tag: item.tag,
                  defaultValue: item.defaultValue,
                  labelclass: item.labelclass,
                  rules: [item.rules.required],
                  // parent_id: item.parent_id || parentId,
                  parent_id: parentId,
                  options: item.options?.map((option) => option.optionsName),
                  isActive: item.isActive,
                  placeholder: item.placeholder,
                  label2: item.label2,
                  index: item.index,
                };
              });
              console.log(dataNeo4j);
              //array'de tekrar eden elaman varsa true dönüyor
              function hasDuplicates(array) {
                return new Set(array).size !== array.length;
              }
              //property label girili değilse uyarı ver
              if (dataNeo4j.map((item) => item.label).includes('')) {
                toast.current.show({
                  severity: 'error',
                  summary: 'Error Message',
                  detail: 'Please fill all the property labels',
                  life: 4000,
                });
              } else {
                //aynı isimde property label varsa uyarı ver
                if (
                  hasDuplicates(dataNeo4j.map((item) => item.label)) === true
                ) {
                  toast.current.show({
                    severity: 'error',
                    summary: 'Error Message',
                    detail: 'Please fill different property labels',
                    life: 4000,
                  });
                } else {
                  if (dataNeo4j.length > 0) {
                    FormBuilderService.create(dataNeo4j)
                      .then((res) => {
                        navigate('/formtree');
                      })
                      .catch((err) => {
                        toast.current.show({
                          severity: 'error',
                          summary: 'Error',
                          detail: err.response
                            ? err.response.data.message
                            : err.message,
                          life: 2000,
                        });
                      });
                  }
                }
              }
            }}
          >
            Save
          </Button>
          <Button
            className="p-button-danger ml-2"
            onClick={() => {
              navigate('/formtree');
            }}
          >
            Cancel
          </Button>

          <Dialog
            header={formName}
            visible={displayResponsive}
            onHide={() => onHide('displayResponsive')}
            breakpoints={{ '960px': '75vw' }}
            style={{ width: '40vw' }}
          >
            <FormGenerate items={items} />
          </Dialog>
        </div>
      </div>
    </DragDropContext>
  );
}

export default FormBuilderCreate;
