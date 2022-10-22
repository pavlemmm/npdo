export default function FormField({ name, label, type, pattern, refer, required }) {
    return (
        <div>
            <label htmlFor={name}>{label}: </label>
            <input type={type} name={name} pattern={pattern} ref={refer} required={required} />
        </div>
    );
}
