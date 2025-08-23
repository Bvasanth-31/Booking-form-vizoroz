import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings, deleteBooking,setSelectedBooking } from '../redux/BookingSlice';
import './Booking.css';

const Booking = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const bookings = useSelector((state) => state.booking.bookings);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10); 

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

   const handleEdit = (id) => {
  navigate(`/form/${id}`);
};


  
  const handleDelete =  (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      dispatch(deleteBooking(id));
    }
  };

  const columns = [
    { field: 'yard', headerName: 'Yard', flex: 1 },
    { field: 'linerName', headerName: 'Liner Name', flex: 1 },
    { field: 'referenceNumber', headerName: 'Reference Number', flex: 1 },
    { field: 'bookingDate', headerName: 'Booking Date', flex: 1 },
   
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => handleEdit(params.row.id)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
      <div className="app-container">
      <h1 >Booking List</h1>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <Button variant="contained" color="primary" onClick={() => navigate('/form')}>
           New Booking
        </Button>
      </div> 

      <DataGrid
        rows={bookings}
        columns={columns}
        pageSizeOptions={[5, 10, 20, 50]}
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={(model) => {
          setPage(model.page);
          setPageSize(model.pageSize);
        }}
        autoHeight
        disableRowSelectionOnClick
        getRowId={(row) => row.id}
      />
    </div>
  );
};
export default Booking;







