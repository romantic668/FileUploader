import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import moment from 'moment';




function File({ children, ...props }) {

    const { id } = useParams();
    const [file, setFile] = useState({});

    useEffect(() => {
        axios.get('https://localhost:44347/api/File/' + id)
            .then(res => {
                setFile(res.data);
            })
            .catch(err => console.log(err))
    }, [id]);

    return (
        <div className="card mx-auto mt-5" style={{ width: "18rem" }}>
            <ul className="list-group list-group-flush">
                <li className="list-group-item">ID : {file.id}</li>
                <li className="list-group-item">File Name: {file.fileName}</li>
                <li className="list-group-item">Save Name: {file.saveName}</li>
                <li className="list-group-item">File Size: {file.size + " k"}</li>
                <li className="list-group-item">Created Date: {moment(file.createdDate).format('MM/DD/YYYY')}</li>
                <li className="list-group-item">Updated Date: {moment(file.updatedDate).format('MM/DD/YYYY')}</li>

            </ul>
        </div>
    );
}


export default File;