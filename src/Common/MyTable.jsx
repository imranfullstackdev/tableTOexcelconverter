import React, { useState } from 'react';
import { Table, Form, Button, FormControl, InputGroup, Pagination, Container } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import './style.css'; // Import your CSS file

const MyTable = ({ data, setLoading }) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minRating, setMinRating] = useState('');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // for selecting rows
    const handleRowSelect = (rowId) => {
        console.log(rowId, "rorror")

        if (selectedRows.includes(rowId)) {
            // debugger
            setSelectedRows(selectedRows.filter(id => id !== rowId));
        } else {
            setSelectedRows([...selectedRows, rowId]);
        }
    };

    // for search allgorithm
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // for max price
    const handleMaxPriceChange = (event) => {
        setMaxPrice(event.target.value);
    };

    // for rating
    const handleMinRatingChange = (event) => {
        setMinRating(event.target.value);
    };

    // for sorting based on the  price and number
    const handleSort = (column) => {

        if (sortColumn === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
    };

    // for pagination
    const handlePaginationClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // for sorted data
    const sortedData = data.slice().sort((a, b) => {
        if (!sortColumn) return 0;
        const columnA = a[sortColumn];
        const columnB = b[sortColumn];
        if (typeof columnA === 'string' && typeof columnB === 'string') {
            return sortOrder === 'asc' ? columnA.localeCompare(columnB) : columnB.localeCompare(columnA);
        } else {
            return sortOrder === 'asc' ? columnA - columnB : columnB - columnA;
        }
    });

    // for search based on title and categories
    const filteredData = sortedData.filter(row => {
        return (
            (row.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (maxPrice === '' || row.price <= parseFloat(maxPrice)) &&
            (minRating === '' || row.rating >= parseFloat(minRating))
        );
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // for downloading the excel
    const downloadExcel = () => {

        if (selectedRows.length > 0) {
            const selectedData = data.filter(item => selectedRows.includes(item.id));
            const worksheet = XLSX.utils.json_to_sheet(selectedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'SelectedRows');
            XLSX.writeFile(workbook, 'selected_rows.xlsx');
        } else {

            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'SelectedRows');
            XLSX.writeFile(workbook, 'selected_rows.xlsx');
        }

    };


    // for pagination
    const renderPaginationItems = () => {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        const items = [];
        for (let number = 1; number <= totalPages; number++) {
            items.push(
                <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePaginationClick(number)}>
                    {number}
                </Pagination.Item>,
            );
        }
        return items;
    };
    return (
        <Container fluid>
            <div className="my-4">
                <InputGroup className="mb-3 my-3">
                    <FormControl
                        placeholder="Search by title or category"
                        aria-label="Search"
                        aria-describedby="basic-addon2"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className='m-2 rounded'
                    />
                    <FormControl
                        placeholder="Max price"
                        aria-label="Max price"
                        type="number"
                        value={maxPrice}
                        onChange={handleMaxPriceChange}
                        className='m-2 rounded'

                    />
                    <FormControl
                        placeholder="Min rating"
                        aria-label="Min rating"
                        type="number"
                        value={minRating}
                        onChange={handleMinRatingChange}
                        className='m-2 rounded'

                    />
                    <Button
                        className='m-2 rounded'
                        variant="outline-secondary" onClick={downloadExcel}>{selectedRows.length <= 0 ? "Download All " : "Download Selected Rows"}</Button>
                </InputGroup>

                <Table striped bordered hover className="custom-table">
                    <thead >
                        <tr>
                            <th></th>
                            <th >id</th>
                            <th >Title</th>
                            <th >Category</th>
                            <th >Description</th>
                            <th >Discount Percentage %</th>
                            <th onClick={() => handleSort('price')}>Price </th>
                            <th onClick={() => handleSort('rating')}>Rating</th>
                            <th >Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(row => (
                            <tr key={row.id}>
                                <td>
                                    <Form.Check
                                        type="checkbox"
                                        onChange={() => handleRowSelect(row.id)}
                                        checked={selectedRows.includes(row.id)}
                                    />
                                </td>
                                <td>{row.id}</td>
                                <td>{row.title}</td>
                                <td>{row.category}</td>
                                <td>{row.description}</td>
                                <td>{row.discountPercentage}</td>
                                <td>{row.price}</td>
                                <td>{row.rating}</td>
                                <td>{row.stock}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {currentItems.length<=0 && <h1 className='text-center align-center'>No Data Found !</h1>}

                <Pagination>{renderPaginationItems()}</Pagination>
            </div>
        </Container>
    );
};

export default MyTable;
