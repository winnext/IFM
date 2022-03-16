import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

interface Node{
    key: string,
    label: string,
    name: string,
    code: string,
    selectable?: boolean | undefined,
    children: Node[]
}

interface TreeState {
    classificationsOfFacility:Node[]
}

// Define the initial state using that type
const initialState: TreeState = {
    classificationsOfFacility: [
        {
          key: "0",
          name: "Class 1",
          code: "0",
          label: "0 : Class 1",
          selectable: false,
          children: [
            {
              key: "0-0",
              label: "0-0 : Class 1-0",
              name: "Root 1",
              code: "0-0",
              selectable: false,
              children: [
                {
                  key: "0-0-0",
                  label: "0-0-0 : Class 1-0-0",
                  code:"0-0-0",
                  name: "Node 1.1",
                  children:[]
                },
              ],
            },
          ],
        },
        {
          key: "1",
          label:"1 : Class 2",
          code:"1",
          name: "Class 2",
          children:[]
        },
    ],
}

export const treeSlice = createSlice({
    name: 'tree',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        save: (state,action:PayloadAction<Node[]>) => {
            state.classificationsOfFacility = action.payload
        }
    }
})

export const { save } = treeSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectTree = (state: RootState) => state.tree

export default treeSlice.reducer