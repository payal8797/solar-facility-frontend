import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { CREATE_FACILITY, UPDATE_FACILITY } from '../mutations/facilityMutations';
import { GET_FACILITIES } from '../queries/facilityQueries';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert } from '@mui/material';

const FacilityFormModal = ({ open, handleClose, facility, viewOnly, onSuccess, onError }) => {
  const { control, handleSubmit, reset, formState: { errors: formErrors }, setValue } = useForm({
    defaultValues: {
      name: '',
      nominalPower: '',
    },
  });
  const [errors, setErrors] = React.useState([]);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');

  const mutation = facility ? UPDATE_FACILITY : CREATE_FACILITY;

  const [submitFacility] = useMutation(mutation, {
    refetchQueries: [{ query: GET_FACILITIES }],
    onError({ graphQLErrors }) {
      setErrors(graphQLErrors);
      onError('An error occurred while submitting the facility.');
      setSnackbarMessage('An error occurred while submitting the facility.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    },
    onCompleted() {
      const message = facility ? 'Facility updated successfully.' : 'Facility created successfully.';
      onSuccess(message);
      setSnackbarMessage(message);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      reset();
      handleClose();
    },
  });

  React.useEffect(() => {
    if (open) {
      setErrors([]); // Clear errors when modal is opened
      if (facility) {
        setValue('name', facility.name);
        setValue('nominalPower', facility.nominalPower.toString());
      } else {
        reset({ name: '', nominalPower: '' });
      }
    }
  }, [open, facility, setValue, reset]);

  const onSubmit = async (data) => {
    if (!data.name || !data.nominalPower) {
      setErrors([{ message: 'Both fields are required' }]);
      return;
    }
    data.nominalPower = parseInt(data.nominalPower, 10);
    try {
      await submitFacility({ variables: { id: facility?.id, ...data } });
    } catch (error) {
      console.error('Error submitting facility:', error);
      onError('An error occurred while submitting the facility.');
    }
  };

  const handleCancel = () => {
    reset();
    handleClose();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>{facility ? (viewOnly ? 'View Facility' : 'Update Facility') : 'Add New Facility'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Facility name is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Facility Name"
                variant="outlined"
                fullWidth
                margin="normal"
                disabled={viewOnly}
                error={formErrors.name !== undefined}
                helperText={formErrors.name?.message}
              />
            )}
          />
          <Controller
            name="nominalPower"
            control={control}
            rules={{ required: 'Nominal Power is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nominal Power"
                type="number"
                variant="outlined"
                fullWidth
                margin="normal"
                disabled={viewOnly}
                error={formErrors.nominalPower !== undefined}
                helperText={formErrors.nominalPower?.message}
              />
            )}
          />
          {errors.map((error, index) => (
            <Alert key={index} severity="error">
              {error.message}
            </Alert>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          {!viewOnly && (
            <Button type="submit" variant="contained" color="primary">
              {facility ? 'Update' : 'Add'}
            </Button>
          )}
        </DialogActions>
      </form>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default FacilityFormModal;
