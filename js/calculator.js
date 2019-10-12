var Calculator = function () {

    var $result = this.result,
        $operation = this.operation,
        flag = false; // calculating flag

    this.numbers.click(e => {
        var value = $result.val(),
            input = e.target.innerText;

        if (input === '.' && value.indexOf('.') > 0 // only allow 1 decimal point
            ||
            value.length === 20) // limit 20 digits
            return;
        else if (input === '.' && value === '0') // add zero before decimal point
            $result.val('0.');
        else if (flag || value === '0') {
            flag = false;
            $result.val(input);
        } else
            $result.val(value + input);
    });

    this.functions.click(e => {
        var v_raw = $result.val(),
            v_num = parseFloat(v_raw),
            input = e.target.innerText,
            operation = $operation.val(),
            result = 0;
        switch (input) {
            case '←':
                result = v_raw.length === 1 ? 0 : v_raw.slice(0, v_raw.length - 1);
                break;
            case 'CE':
                result = 0;
                break;
            case 'C':
                operation = '';
                break;
            case '±':
                if (v_raw === '0')
                    return;
                else if (v_raw.indexOf('-') === 0)
                    result = v_raw.slice(1, v_raw.length);
                else
                    result = '-' + v_num;
                break;
            case '√':
                operation = 'sqrt(' + v_num + ')';
                result = Math.sqrt(v_num);
                break;
            case '%':
                operation = v_num + ' / 100';
                result = v_num / 100;
                break;
            case '1/x':
                operation = '1 / ' + v_num;
                result = 1 / v_num;
                break;
            case '=':
                result = eval(operation + v_num);
                operation = '';
                break;
            default:
                result = eval(operation + v_num);
                operation += v_num + ' ' + input + ' ';
                break;
        }
        flag = true;
        $operation.val(operation);
        $result.val(isNaN(result) ? 'Invalid input' : result);
    });
};