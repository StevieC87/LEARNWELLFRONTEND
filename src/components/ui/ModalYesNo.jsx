import SoftModal from './SoftModal.jsx';

// A yes/no question: the question as the title and the two answers under it.
// Escape, the × and a click on the dimmed page close it without an answer.
export default function ModalYesNo(props) {

  const { textchoice, isOpen, getModalAnswer, buttontextconfirm, buttontextcancel, changeOpen, context } = props;

  return (
    <SoftModal open={Boolean(isOpen)} onClose={() => changeOpen(false)} title={textchoice} role="alertdialog" width={440}
      foot={(
        <>
          <button type="button" data-autofocus className={`ui-btn ${context === "delete" ? "ui-btn-danger" : "ui-btn-primary"}`} onClick={() => getModalAnswer(true)}>
            {buttontextconfirm}
          </button>
          <button type="button" className="ui-btn ui-btn-secondary" onClick={() => getModalAnswer(false)}>
            {buttontextcancel}
          </button>
        </>
      )} />
  );
}
