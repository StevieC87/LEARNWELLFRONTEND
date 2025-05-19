
//! ADD ID OF THE FIELD  - PASS TO REDUX 

const FieldRenderer = ({ field, name, value, onChange }) => {
  ; console.log(field, name, value, 'field555554444');
  switch (field) {
    case "text":

      return (
        //! add custom class maybe after? 
        <div className="fielddivblock">
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">{field.name}</label>
          <input
            key={field.name}
            name={name}
            type="text"
            value={value}
            onChange={onChange}
          />
        </div>
      );
    case "textarea":
      return (
        <div className="fielddivblock">
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">{field.name}</label>
          <textarea
            key={field.name}
            name={field.name}
            value={value}
            onChange={onChange}
          />
        </div>
      );
    case "number":
      return (
        <div className="fielddivblock">
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">{field.name}</label>
          <input
            key={field.name}
            name={field.name}
            type="number"
            value={value}
            onChange={onChange}
          />
        </div>
      );
    case "checkbox":
      return (
        <div className="fielddivblock">
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">{field.name}</label>
          <input
            key={field.name}
            name={field.name}
            type="checkbox"
            checked={value}
            onChange={(e) =>
              onChange({ target: { name: field.name, value: e.target.checked } })
            }
          />
        </div>
      );
    case "date":
      return (
        <div className="fielddivblock">
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">{field.name}</label>
          <input
            key={field.name}
            name={field.name}
            type="date"
            value={value}
            onChange={onChange}
          />
        </div>
      );

    default:
      return null;
  }
};

export default FieldRenderer;
