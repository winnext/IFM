import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import FormBuilderService from "../../services/formProperties";

const FormType = () => {
  const [formData, setFormData] = useState([]);
  const [selectedForm, setSelectedForm] = useState(undefined);

  const getForms = async() => {
    await  FormBuilderService.findAll().then((res) => {
      console.log(res.data[0]);
      setFormData(res.data[0]);
    });
  };

  useEffect( () => {
   getForms();
  }, []);

  const {
    handleSubmit,
    control,
    // watch,
    unregister,
    reset,
    formState: { errors },
  } = useForm();

  return (
    <div>
      <Dropdown
        optionLabel="name"
        value={selectedForm}
        options={formData}
        onChange={(e) => {
          const temp = selectedForm ? selectedForm.items : [];
          for (let item of temp) {
            unregister(item.label);
          }
          reset();
          setSelectedForm(e.value);
        }}
        placeholder="Select Type"
        style={{ width: '50%' }}
      />
    </div>
  );
};

export default FormType;
