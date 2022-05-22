import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { v4 as uuid } from 'uuid';
import { DragDropContext } from 'react-beautiful-dnd';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import FormBuilderService from '../../services/formBuilder';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Toolbox from './ToolBox';
import DropZone from './DropZone';
import { Card } from 'primereact/card';
import ITEMS from './Items';
import { Toast } from 'primereact/toast';

function FormBuilderCreate() {
  const [items, setItems] = useState([]);
  const [formName, setFormName] = useState('');
  const [parentId, setParentId] = useState('');
  const toast = React.useRef(null);
  const navigate = useNavigate();

  const params = useLocation();
  const paramsId = useParams();
  console.log(params);
  console.log(paramsId);

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
            <label className="block">Form Name : {formName} </label>
            {/* <InputText
              style={{ width: '50%' }}
              onChange={(e) => setFormName(e.target.value)}
            /> */}
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
                  parent_id: item.parent_id||parentId,
                  options: item.options?.map((option) => option.optionsName),
                  isActive: item.isActive,
                };
              });
              console.log(dataNeo4j);
              FormBuilderService.create(dataNeo4j).then((res) => {
                navigate('/formbuilder');
              });
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </DragDropContext>
  );
}

export default FormBuilderCreate;
