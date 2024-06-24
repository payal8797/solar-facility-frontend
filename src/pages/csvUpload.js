import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Container,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Switch,
  TextField, 
  Grid} from '@mui/material';
import Papa from 'papaparse';
import {uploadCSVData} from './../api/updateCSVData';
import {DataTableComponent} from './../components/DataTableCSV';
import {LineChartComponent} from './../components/LineChart';

const FileUpload = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [data, setData] = useState([]);
  const [interval, setInterval] = useState('all');
  const [filteredData, setFilteredData] = useState([]);
  const [showPower, setShowPower] = useState(true);
  const [showEnergy, setShowEnergy] = useState(true);
  const [viewFilters, setViewFilters] = useState(false);
  const [showDatainTable, setShowDatainTable] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  useEffect(() => {
    if (interval === 'all') {
      setFilteredData(data);
    } else {
      filterData();
    }
  }, [data, interval]);

  const filterData = () => {
    if (interval === '15-min') {
      const filtered = data.filter((row) => row.timestamp.getMinutes() % 15 === 0);
      setFilteredData(filtered);
    } else if (interval === 'hourly') {
      const filtered = data.filter((row, index) => index === 0 || row.timestamp.getMinutes() === 0);
      setFilteredData(filtered);
    } else if (interval === 'daily') {
      const filtered = data.filter((row, index) => index === 0 || (row.timestamp.getHours() === 0 && row.timestamp.getMinutes() === 0));
      setFilteredData(filtered);
    }
  };

  const handleIntervalChange = (event) => {
    setInterval(event.target.value);
  };

  const handlePowerToggle = () => {
    setShowPower(!showPower);
  };

  const handleEnergyToggle = () => {
    setShowEnergy(!showEnergy);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onSubmit = async (formData) => {
    try {
      if (!formData.csv || formData.csv.length === 0) {
        throw new Error('CSV file is required');
      }
  
      const file = formData.csv[0];
      setSelectedFile(file);
  
      const formDataObj = new FormData();
      formDataObj.append('csvfile', file);
  
      const uploadResponse = await uploadCSVData(formDataObj);
  
      console.log('Upload successful:', uploadResponse.data);
  
      // Parse CSV data locally for visualization
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const formattedData = results.data.map(row => {
            const activePower = parseFloat(row.active_power_kW);
            const energy = parseFloat(row.energy_kWh);
            
            if (isNaN(activePower) || isNaN(energy)) {
              console.error('Invalid data:', row);
            }
            
            return {
              timestamp: new Date(row.timestamp),
              activePower,
              energy
            };
          });
          setData(formattedData);
          setViewFilters(true);
        }
      });
  
    } catch (error) {
      console.error('Error uploading CSV file:', error);
    }
  };
  

  return (
    <><Container>
      <Box sx={{ p: 3, backgroundColor: '#fff', borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Facility Performance Dashboard
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <Grid container spacing={2} onSubmit={handleSubmit(onSubmit)}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="file"
                inputProps={{ accept: '.csv' }}
                {...register('csv', { required: 'CSV file is required' })}
                error={Boolean(errors.csv)}
                helperText={errors.csv ? errors.csv.message : 'Upload your CSV file'} />
            </Grid>
            <Grid item xs={10}>
              <Button type="submit" variant="contained" color="primary">
                Upload CSV
              </Button>
              </Grid>
              <Grid item xs={2}>
              {selectedFile &&
              <Button 
                onClick={()=> {
                    reset();
                    setData([]);
                    setViewFilters(false);
                    setSelectedFile(null);
                    setSelectedFile(false);
                  }} 
                variant="contained" 
                color="primary">
                Remove CSV
              </Button>}
            </Grid>
          </Grid>
        </Box>
      </Box>   
        {viewFilters &&
          <>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="interval-label">Time Interval</InputLabel>
              <Select
                labelId="interval-label"
                value={interval}
                onChange={handleIntervalChange}
                label="Time Interval"
              >
                <MenuItem value="all">All Data</MenuItem>
                <MenuItem value="15-min">15 Minutes</MenuItem>
                <MenuItem value="hourly">Hourly</MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
              </Select>
            </FormControl>
            <FormGroup row>
                <FormControlLabel
                  control={<Switch checked={showPower} onChange={handlePowerToggle} />}
                  label="Show Power" />
                <FormControlLabel
                  control={<Switch checked={showEnergy} onChange={handleEnergyToggle} />}
                  label="Show Energy" />
            </FormGroup>
            <Button onClick={()=> setShowDatainTable(!showDatainTable)}  variant="contained" color="primary" >
                 {showDatainTable ? "Hide table" : "Show data in table"} 
            </Button>
            </>
          }
        </Container>

        <LineChartComponent
          filteredData={filteredData}
          interval={interval}
          showPower={showPower}
          showEnergy={showEnergy} />
          
        {showDatainTable && filteredData.length > 0 && 
        <DataTableComponent
          filteredData={filteredData}
          showDatainTable={showDatainTable}
          columns={['Timestamp', 'Active Power (in kW)', 'Energy (in kW/h)']}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage} />
        }
     </>
    
  );
};

export default FileUpload;
