import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_FACILITIES } from '../queries/facilityQueries';
import { DELETE_FACILITY } from '../mutations/facilityMutations';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
  IconButton, Container, Box, TextField, TablePagination, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, CircularProgress, Snackbar, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FacilityFormModal from '../components/FacilityFormModal';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAuth } from '../context/authContext';

const FacilityList = () => {
  const { loading, error, data } = useQuery(GET_FACILITIES);
  const [deleteFacility] = useMutation(DELETE_FACILITY, {
    refetchQueries: [{ query: GET_FACILITIES }],
  });
  const [modalOpen, setModalOpen] = React.useState(false);
  const [viewOnly, setViewOnly] = React.useState(false);
  const [selectedFacility, setSelectedFacility] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const { isLoggedIn } = useAuth();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [facilityToDelete, setFacilityToDelete] = React.useState(null);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  if (!isLoggedIn) {
    return <p>Please log in to access this page.</p>;
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) return <p>Error: {error.message}</p>;

  const handleDelete = (facility) => {
    setFacilityToDelete(facility);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteFacility({ variables: { id: facilityToDelete.id } })
      .then(() => {
        setSnackbarMessage(`Facility ${facilityToDelete.name} deleted successfully`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch((error) => {
        setSnackbarMessage(`Error deleting facility ${facilityToDelete.name}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      })
      .finally(() => setDeleteDialogOpen(false));
  };

  const handleEdit = (facility) => {
    setViewOnly(false);
    setSelectedFacility(facility);
    setModalOpen(true);
  };

  const handleView = (facility) => {
    setSelectedFacility(facility);
    setModalOpen(true);
    setViewOnly(true);
  };

  const handleCreate = () => {
    setSelectedFacility(null);
    setViewOnly(false);
    setModalOpen(true);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to the first page on a new search
  };

  const filteredFacilities = data.facilities?.filter((facility) =>
    facility.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSnackbarClose = () => {
    setSnackbarMessage('');
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} mt={6}>
        <TextField
          label="Search by Facility Name"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Button variant="contained" color="primary" onClick={handleCreate}>
          Add New Facility
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Nominal Power</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFacilities && filteredFacilities.length > 0 ? (
              filteredFacilities.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((facility) => (
                <TableRow key={facility.id}>
                  <TableCell>{facility.name}</TableCell>
                  <TableCell>{facility.nominalPower}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleView(facility)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton color="primary" onClick={() => handleEdit(facility)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(facility)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">No facilities found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredFacilities ? filteredFacilities.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          showFirstButton
          showLastButton
        />
      </TableContainer>
      <FacilityFormModal
        open={modalOpen}
        viewOnly={viewOnly}
        handleClose={() => setModalOpen(false)}
        facility={selectedFacility}
        onSuccess={(message) => {
          setSnackbarMessage(message);
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        }}
        onError={(message) => {
          setSnackbarMessage(message);
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }}
      />
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the facility "{facilityToDelete?.name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} sx={{ color: 'red' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FacilityList;
