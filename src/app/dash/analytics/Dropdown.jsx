/* 

export default function Dropdown({ options, onSelect, selectedOption }) {
  const handleSelect = (option) => {
    onSelect(option);
  };

  return (
    <div className="dropdown">
      <select
        value={selectedOption}
        onChange={(e) => handleSelect(e.target.value)}
        className="dropdown-select"
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
} */