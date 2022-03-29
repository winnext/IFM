import React, { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { Tooltip } from 'primereact/tooltip';
import { useAppSelector } from "../app/hook";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FacilityFileImport: React.FC = () => {
    const toast = useRef<any>();
    const refUpload = useRef<any>(null);
    const auth = useAppSelector((state) => state.auth);
    const [token, setToken] = useState(auth.auth.token);
    const history = useNavigate();

    const uploadCSV = (e:any) => {
        const file = e.files[0];
        const url = 'http://localhost:3001/facility/createfacilities';
        const formData = new FormData();

        formData.append('file', file);
        formData.append('fileName', file.name);
        const config = {
            headers: {
                'content-type': 'multipart/form-data', Authorization: "Bearer " + token,
            },
        };
        axios.post(url, formData, config).then((response) => {
            console.log(response.data);
            toast.current.show({ severity: 'success', summary: 'File uploaded', life: 3000 });
        })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'File not uploaded', life: 3000 });
            })

        refUpload.current.clear();
        function backToFacility() {
            history('/facility');
          }
          
          setTimeout(backToFacility, 1200);
        
    }
    return (
        <>
            <Toast ref={toast}></Toast>

            <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
            <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
            <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

            <div className="card">
                <h5>File Import</h5>
                <FileUpload
                    name="upfile[]"
                    accept="csv/*"
                    maxFileSize={1000000}
                    chooseLabel="Import"
                    className="mr-2 inline-block"
                    customUpload={true}
                    uploadHandler={uploadCSV}
                    ref={refUpload}
                    emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                />
            </div>
        </>
    )
};

export default FacilityFileImport;
