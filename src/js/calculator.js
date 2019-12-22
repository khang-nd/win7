/* eslint-disable no-eval */
module.exports = (elements) => {
  const $result = elements.result;
  const $operation = elements.operation;
  let flag = false; // calculating flag

  elements.numbers.click((e) => {
    const value = $result.val();
    const input = e.target.innerText;

    if ((input === '.' && value.indexOf('.') > 0)
      || value.length === 20) {
      // only allow 1 decimal point and limit 20 digits
    } else if (input === '.' && value === '0') { // add zero before decimal point
      $result.val('0.');
    } else if (flag || value === '0') {
      flag = false;
      $result.val(input);
    } else { $result.val(value + input); }
  });

  elements.functions.click((e) => {
    const rawValue = $result.val();
    const numValue = parseFloat(rawValue);
    const input = e.target.innerText;
    let operation = $operation.val();
    let result = 0;
    switch (input) {
      case '←':
        result = rawValue.length === 1 ? 0 : rawValue.slice(0, rawValue.length - 1);
        break;
      case 'CE':
        result = 0;
        break;
      case 'C':
        operation = '';
        break;
      case '±':
        if (rawValue === '0') { return; }
        if (rawValue.indexOf('-') === 0) { result = rawValue.slice(1, rawValue.length); } else { result = `-${numValue}`; }
        break;
      case '√':
        operation = `sqrt(${numValue})`;
        result = Math.sqrt(numValue);
        break;
      case '%':
        operation = `${numValue} / 100`;
        result = numValue / 100;
        break;
      case '1/x':
        operation = `1 / ${numValue}`;
        result = 1 / numValue;
        break;
      case '=':
        result = eval(operation + numValue);
        operation = '';
        break;
      default:
        result = eval(operation + numValue);
        operation += `${numValue} ${input} `;
        break;
    }
    flag = true;
    $operation.val(operation);
    $result.val(isNaN(result) ? 'Invalid input' : result);
  });
};
