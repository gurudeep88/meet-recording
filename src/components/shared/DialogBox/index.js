import { Dialog } from "@material-ui/core";

export const DialogBox=(props)=> {
    
    const { onClose, open, children, fullWidth, maxWidth, dialog } = props;
  
    return (
      <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open} fullWidth={fullWidth} maxWidth={maxWidth} className={dialog}>
          {children}
      </Dialog>
    );
  }
  