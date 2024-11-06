import React from 'react';
import './input.css';

const Input = ({ setValue, type, value, style }) => {
    const handleChange = (event) => {
        if (type === "file") {
            // Для полей ввода файла передаем files
            setValue(event.target.files);
        } else {
            // Для остальных типов передаем значение
            setValue(event.target.value);
        }
    };

    return (
        <input 
            style={style}
            onChange={handleChange} 
            className='input_'
            type={type}
            value={type !== "file" ? value : undefined} // Устанавливаем value только для текстовых полей
        />
    );
}

export default Input;
