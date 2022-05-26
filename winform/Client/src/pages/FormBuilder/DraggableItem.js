import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

export default function DraggableItem(props) {
  console.log(props);
  return (
    <Draggable
      key={props.item.key}
      draggableId={props.item.key}
      index={props.index}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          isDragging={snapshot.isDragging}
          {...provided.dragHandleProps}
        >
          <div>
            {
              <div className="p-d-flex p-flex-column">
                <div
                  onMouseEnter={(e) => props.toggleHover(e, props.item)}
                  style={{
                    cursor: 'pointer',
                    border:
                      props.hoverdCompId === props.item.key
                        ? '1px solid blue'
                        : '',
                    padding: 5,
                  }}
                >
                  {props.renderItem(props.item, props.index)}
                </div>
              </div>
            }
          </div>
        </div>
      )}
    </Draggable>
  );
}
