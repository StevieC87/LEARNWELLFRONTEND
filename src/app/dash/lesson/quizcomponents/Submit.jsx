

export default function SubmitButton(props) {

    const { callbackfunction } = props
    return (
        <button
            className="button button-primary quizsubmit"
            onClick={(e) => {
                // Handle submit action
                callbackfunction()
            }}
        >
            Submit
        </button>
    )
}