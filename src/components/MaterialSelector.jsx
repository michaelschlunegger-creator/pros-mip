function MaterialSelector({ label, options, value, onChange, disabled }) {
  return (
    <label className="control-group">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}>
        <option value="">Select material</option>
        {options.map((item) => (
          <option key={item.id} value={item.id}>
            {item.fullName}
          </option>
        ))}
      </select>
    </label>
  );
}

export default MaterialSelector;
