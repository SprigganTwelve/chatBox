
class ModalProps {
    constructor(
        open,
        onClose,
        ModalComponent = () => <></>,
        onContinueHandler= ()=>{},
        showCancelAndConfirmButtons = false,
    ){
        this.open = open
        this.onClose = onClose
        this.ModalComponent = ModalComponent
        this.onContinueHandler = onContinueHandler
        this.showCancelAndConfirmButtons = showCancelAndConfirmButtons

    }

}


export { ModalProps }
