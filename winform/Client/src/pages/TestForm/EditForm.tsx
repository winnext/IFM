import React from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import TestFormService from "../../services/testForm"

const EditForm = () => {
  const { search } = useLocation();
  const navigate = useNavigate();

  const [id, setId] = React.useState('');

  React.useEffect(() => {
    var temp = search.split('?id=')[1];
    if(!temp){
        navigate("/test-form")
        setId(temp)
        return
    }

    TestFormService.findOne(temp).then(res=>{
        console.log(res.data)
    })
    .catch(err=>{
        console.log(err)
    })

  }, []);

  return <div>EditForm</div>;
};

export default EditForm;
