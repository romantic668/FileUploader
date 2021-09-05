import React from 'react';
import axios from 'axios';
import DataTable from '@salesforce/design-system-react/components/data-table';
import DataTableColumn from '@salesforce/design-system-react/components/data-table/column';
import DataTableCell from '@salesforce/design-system-react/components/data-table/cell';
import IconSettings from '@salesforce/design-system-react/components/icon-settings';
import moment from 'moment';
import Button from '@salesforce/design-system-react/components/button';
import Update from './Update';
import { Link } from 'react-router-dom';




const CustomDataTableCell = ({ children, ...props }) => (
    <DataTableCell {...props}>

        <a
            href={props.item.fileSrc}
            target="_blank"
            rel="noreferrer"

        >
            {children}
        </a>
    </DataTableCell>
);


const Delete = ({ children, ...props }) => (
    <DataTableCell {...props}>

        <Button label="Delete" variant="destructive" onClick={() => props.handleDelete(props.item.id)} />


    </DataTableCell>
);

const Details = ({ children, ...props }) => (
    <DataTableCell {...props}>
        <Link to={`/files/${props.item.id}`} target="_blank">details</Link>

    </DataTableCell>
);
CustomDataTableCell.displayName = DataTableCell.displayName;
Details.displayName = DataTableCell.displayName;
Update.displayName = DataTableCell.displayName;
Delete.displayName = DataTableCell.displayName;




export default class FileList extends React.Component {
    static displayName = 'FileUpload';

    constructor(props) {
        super(props);
        this.state = {
            fileName: "",
            selectedFile: {},
            isSelected: false,
            errors: {},
            items: [

            ],
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);




    }



    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'file' ? event.target.files[0] : target.value;
        if (target.type === 'file') {
            this.setState({
                isSelected: event.target.files[0] ? true : false
            });

        }
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    validate() {
        let temp = {};
        temp.fileName = this.state.fileName.trim() === "" ? false : true;
        temp.isSelected = this.state.isSelected;
        this.setState({
            errors: temp
        })
        return Object.values(temp).every(x => x === true);

    }

    resetForm() {
        this.setState({
            fileName: "",
            selectedFile: {},
            isSelected: false,
            errors: {},
        });
        document.getElementById('file-uploader').value = null;

    }

    handleSubmit(event) {

        event.preventDefault();
        if (this.validate()) {
            const formData = new FormData();
            var dateString = this.state.selectedFile.lastModifiedDate;

            formData.append('fileName', this.state.fileName);
            formData.append('selectedFile', this.state.selectedFile);
            formData.append('size', parseInt(this.state.selectedFile.size / 1000));
            formData.append('CreatedDate', moment(dateString).format('MM/DD/YYYY'));

            formData.append('updatedDate', moment().format('MM/DD/YYYY'));



            this.addFile(formData, this.resetForm);
        }
    }

    handleUpdate(item, name) {
        const formData = new FormData();
        formData.append('ID', item.id);
        formData.append('size', item.size.slice(0, -1));
        formData.append('CreatedDate', item.createdDate);
        formData.append('fileName', name);
        formData.append('saveName', item.saveName);
        formData.append('updatedDate', moment().format('MM/DD/YYYY'));
        this.editFile(formData);

    }

    handleDelete(id) {
        if (window.confirm('Are you sure to delete this record?'))
            this.filesAPI().delete(id)
                .then(res => this.refreshFileList())
                .catch(err => console.log(err))
    }

    applyErrorClass(field) {
        return ((field in this.state.errors && this.state.errors[field] === false) ? ' invalid-field' : "")
    }

    filesAPI(url = 'https://localhost:44347/api/File/') {
        return {
            fetchAll: () => axios.get(url),
            create: newRecord => axios.post(url, newRecord),
            update: (id, updateRecord) => axios.put(url + id, updateRecord),
            delete: id => axios.delete(url + id)
        }
    }

    refreshFileList() {
        this.filesAPI().fetchAll()
            .then(res => {
                const data = res.data.map(el => {
                    const obj = {};
                    obj.fileSrc = el.fileSrc;
                    obj.id = el.id.toString();
                    obj.fileName = el.fileName;
                    obj.saveName = el.saveName;

                    obj.size = el.size + " k";
                    obj.createdDate = moment(el.createdDate).format('MM/DD/YYYY');
                    obj.updatedDate = moment(el.updatedDate).format('MM/DD/YYYY');
                    return obj;
                })
                this.setState({
                    items: data
                })
            })
            .catch(err => console.log(err))
    }

    addFile = (formData, onSuccess) => {

        this.filesAPI().create(formData)
            .then(res => {
                onSuccess();
                this.refreshFileList();
            })
            .catch(err => console.log(err))
    }

    editFile = (formData) => {

        this.filesAPI().update(formData.get('ID'), formData)
            .then(res => {
                this.refreshFileList();
            })
            .catch(err => console.log(err))
    }
    componentDidMount() {
        this.refreshFileList();
    }


    render() {
        const columns = [
            <DataTableColumn
                key="fileName"
                label="File Name"
                property="fileName"
            >
                <CustomDataTableCell />
            </DataTableColumn>,

            <DataTableColumn
                key="size"
                label="Size"
                property="size"
            />,

            <DataTableColumn key="createdDate" label="Created Date" property="createdDate" />,

            <DataTableColumn key="updatedDate" label="Updated Date" property="updatedDate" />,
            <DataTableColumn key="updateName" label="Update Name" property="updateName" >
                <Update handleUpdate={this.handleUpdate} />
            </DataTableColumn>,

            <DataTableColumn key="delete" label="Delete" property="delete" >
                <Delete handleDelete={this.handleDelete} />
            </DataTableColumn>,





            <DataTableColumn key="details" label="Details" property="details">
                <Details />
            </DataTableColumn>,
        ];
        return (
            <IconSettings iconPath="/assets/icons">

                <form className="mt-4" autoComplete="off" noValidate onSubmit={this.handleSubmit}>
                    <div className="card mx-auto" style={{ width: "25rem" }}>
                        <div className="card-body">
                            <h1 className="slds-text-title_caps slds-p-vertical_medium">
                                Upload a file
                            </h1>
                            <div className="form-group">
                                <input type="file" id="file-uploader" className={"form-control-file" + this.applyErrorClass('isSelected')} name="selectedFile" onChange={this.handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>File Name</label>
                                <input type="text" className={"form-control" + this.applyErrorClass('fileName')} name="fileName" value={this.state.fileName} onChange={this.handleInputChange} placeholder="File Name" />
                            </div>
                            <div className="form-group mt-3">
                                <input className="btn btn-primary" type="submit" value="Submit" />
                            </div>
                        </div>
                    </div>
                </form>

                <div className="mt-4" style={{ overflow: 'auto' }}>
                    <DataTable
                        items={this.state.items}
                        id="DataTableExample-noRowHover"
                        noRowHover
                    >
                        {columns}
                    </DataTable>
                </div>


            </IconSettings>
        );
    }
}


