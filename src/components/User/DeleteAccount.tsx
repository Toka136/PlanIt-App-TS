import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import type {  deleteUserType } from "../../Types/TaskType"

 const ConfirmDialog = ({ open_confirm, handleClose, handleDelete,isLoading }: deleteUserType) =>{
  return <Dialog
  slotProps={{ paper: { style: { background: "#0A0A0A" ,textAlign:"center",color:"white"} }}}
        open={open_confirm}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="text-white">
          {"Confirm Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ color: '#9CA3AF' }}>
            Are you sure you want to delete this item? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={()=>handleDelete()} 
            color="error" 
            variant="contained" 
            autoFocus
          >
            {isLoading?<div className="flex justify-center items-center"><CircularProgress color="inherit" /></div>:
           <div>Delete</div> }
          </Button>
        </DialogActions>
      </Dialog>}
export default ConfirmDialog