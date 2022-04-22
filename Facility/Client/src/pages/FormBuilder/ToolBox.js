import React from "react";
import { Card } from "primereact/card";
import { Droppable, Draggable } from "react-beautiful-dnd";
import ITEMS from "./Items";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import { Calendar } from "primereact/calendar";

const ItemComponent = ({ type, icon }) => (
  <Card className="mt-2">
    {type === "text" && (
      <InputText
        placeholder={type.toUpperCase()}
        disabled
        style={{ width: "100%", borderColor: "black" }}
      />
    )}
    {type === "textarea" && (
      <InputTextarea
        placeholder={type.toUpperCase()}
        disabled
        style={{ width: "100%", borderColor: "black",resize:"none" }}
      />
    )}
    {type === "dropdown" && (
      <Dropdown
        placeholder={type.toUpperCase()}
        disabled
        style={{ width: "100%", borderColor: "black" }}
      />
    )}
    {type === "radio" && (
      <>
        <RadioButton disabled style={{border: "1px solid",borderRadius: "50%"}}  />
        <span className="ml-2" style={{ color: "#abb1b6" }}>
          {type.toUpperCase()}
        </span>
      </>
    )}
    {type === "checkbox" && (
      <>
        <Checkbox value={type} disabled style={{border: "1px solid"}}/>
        <span className="ml-2" style={{ color: "#abb1b6" }}>
          {type.toUpperCase()}
        </span>
      </>
    )}
    {type === "date" && (
      <Calendar
        disabled
        placeholder={type.toUpperCase()}
        showIcon
        style={{ width: "100%",border: "1px solid"}}
      />
    )}
  </Card>
);

const ToolBox = () => {
  return (
    <Droppable droppableId="Toolbox" isDropDisabled={true}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} isDraggingOver={snapshot.isDraggingOver}>
          {ITEMS.map((item, index) => (
            <Draggable key={item.type} draggableId={item.type} index={index}>
              {(provided, snapshot) => (
                <>
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    isDragging={snapshot.isDragging}
                  >
                    <ItemComponent type={item.type} icon={item.icon} />
                  </div>

                  {snapshot.isDragging && (
                    <ItemComponent type={item.type} icon={item.icon} />
                  )}
                </>
              )}
            </Draggable>
          ))}
        </div>
      )}
    </Droppable>
  );
};

export default ToolBox;
