import React, { useState, useEffect, InputHTMLAttributes } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Chips } from 'primereact/chips';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Toast } from "primereact/toast";


interface Params {
    nodeKey: string;
    formKey: any;
}


const Form = () => {
    
    const [name, setName] = useState("");
    const [tag, setTag] = useState<string[]>([]);

    return (
        <div>
            <div className="field">
                <h5 style={{ marginBottom: "0.5em" }}>Name</h5>
                <InputText
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    style={{ width: '100%' }}
                />
            </div>
            <div className="field structureChips">
                <h5 style={{ marginBottom: "0.5em" }}>Tag</h5>
                <Chips value={tag} onChange={(e) => setTag(e.value)} style={{ width: "100%" }} />
            </div>

        </div>
    );
};

export default Form;
