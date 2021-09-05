import React, { useState } from 'react';
import DataTableCell from '@salesforce/design-system-react/components/data-table/cell';


function Update({ children, ...props }) {

    const [name, setName] = useState("");
    const [valid, setValid] = useState(true);

    const handleSubmit = (event, item, name) => {
        event.preventDefault();
        if (name.trim() === "") {
            setValid(false);
        } else {
            setValid(true);
            props.handleUpdate(item, name);
            setName('');
        }


    }

    const handleChange = e => {
        const val = e.target.value;
        setName(val);
        if (val.trim() !== '') {
            setValid(true);
        }
    }

    return (
        <DataTableCell {...props}>

            <form className="form-group row justify-content-around" autoComplete="off" onSubmit={(e) => handleSubmit(e, props.item, name)}>
                <input className={`col-8 ${valid ? "" : "invalid-field"}`} placeholder="Enter Name" name='name'
                    type='text'
                    value={name}
                    onChange={e => handleChange(e)} />

                <input className="btn-sm btn-primary col-3" type="submit" value="Update" />
            </form>
        </DataTableCell>
    );
}


export default Update;
