import React from 'react';
import { MenuItem, FormControl, Select, InputLabel } from '@mui/material';

function CustomSelect({ handleChange, formData, type, ratesData }) {
    return (
        <FormControl
            sx={{
                width: "50%",
            }}
        >
            {type == 'referal' ? (
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formData.operation}
                    label="Выбрать"
                    name="operation"
                    onChange={handleChange}
                    sx={{
                        borderRadius: "0",
                        border: "1px solid #000000",
                        p: "0",
                        '& .MuiSelect-select': {
                            p: "3px",
                        },
                        fontFamily: 'Stolzl',
                    }}
                >
                    <MenuItem
                        value={"WITHDRAW"}
                        sx={{
                            fontFamily: 'Stolzl',
                        }}
                    >На кошелек</MenuItem>
                    <MenuItem
                        value={"DEPOSIT"}
                        sx={{
                            fontFamily: 'Stolzl',
                        }}
                    >Открыть основной счет</MenuItem>
                </Select>
            ) : (
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formData.depositTerm}
                    label="Выбрать"
                    name="depositTerm"
                    onChange={handleChange}
                    sx={{
                        borderRadius: "0",
                        border: "1px solid #000000",
                        p: "0",
                        '& .MuiSelect-select': {
                            p: "3px",
                        },
                        fontFamily: 'Stolzl',
                    }}
                >
                     {ratesData.map((rate, key) => {
                        const rateNumber = Number(rate.period)
                        // Преобразование значения period в читаемую форму
                        let period;
                        switch (rateNumber) {
                            case 1:
                                period = "1 год";
                                break;
                            case 2:
                                period = "2 года";
                                break;
                            case 3:
                                period = "3 года";
                                break;
                            case 4:
                                period = "4 года";
                                break;
                            case 5:
                                period = "5 лет";
                                break;
                            default:
                                period = rate.period; // на случай, если период не указан в списке
                        }
                        return (
                            <MenuItem
                            key={key}
                        value={rateNumber}
                        sx={{
                            fontFamily: 'Stolzl',
                        }}
                    >{period}</MenuItem>
                        )
                    })}
                </Select>
            )}
        </FormControl>
    );
}

export default CustomSelect;
