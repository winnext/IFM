import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { v4 as uuid } from 'uuid';
import { DragDropContext } from 'react-beautiful-dnd';
import React, { useState, useEffect } from 'react';
import FormBuilderService from '../../services/formBuilder';
import { useNavigate, useLocation } from 'react-router-dom';
import Toolbox from './ToolBox';
import DropZone from './DropZone';
import { Card } from 'primereact/card';
import ITEMS from './Items';

function FormBuilderCreate() {
  const [items, setItems] = useState([]);
  const [formName, setFormName] = useState('');
  const [data, setData] = useState('');
  const navigate = useNavigate();

  const params = useLocation();
  console.log(params);

  useEffect(() => {
    if (params.state) {
      localStorage.setItem(
        'data',
        JSON.stringify(params.state.data.properties),
      );
      setData(JSON.parse(localStorage.getItem('data')));
    }
    setFormName(JSON.parse(localStorage.getItem('data')).name);
  }, []);

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
        id: uuid(),
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
              const data = {
                name: formName,
                items: items,
              };
              console.log(data);
              FormBuilderService.create(data).then((res) => {
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
