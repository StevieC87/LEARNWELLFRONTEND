
import './modal.css'
export default function ModalYesNo(props) {

  const { textchoice, isOpen, getModalAnswer, buttontextconfirm, buttontextcancel, changeOpen, context } = props;

  if (!isOpen) return null;

  const callbackConfirmCancel = (confirmcancel) => {
    if (confirmcancel === 'confirm') {
      getModalAnswer(true);
    } else if (confirmcancel === 'cancel') {
      getModalAnswer(false);
    }
  }

  const onClickoutside = (e) => {
    if (e.target.className === 'modalouterdiv') {
      changeOpen(false);
    }
  }
  //FUNISH FUNCTONALITY
  //ADD AN X BUTTON

  return (
    <div className="modalouterdiv" onClick={(e) => onClickoutside(e)}>
      <div className="modalinner">
        <div className="flex flex-row">
          <span>{textchoice}</span>
          <svg onClick={() => changeOpen(false)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-x-lg cursor-pointer" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
          </svg>
        </div>


        <div className="flex flex-row justify-between pt-5">
          <button className={context === "delete" ? "button button-danger" : "button button-primary"}
            onClick={() => callbackConfirmCancel('confirm')}>{buttontextconfirm}
          </button>
          <button className="button button-secondary" onClick={() => callbackConfirmCancel('cancel')}>{buttontextcancel}
          </button>
        </div>
      </div>
    </div>
  );
}
