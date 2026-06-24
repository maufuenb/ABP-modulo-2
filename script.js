const calculatorApp = {
  history: [],
  operationLabels: {
    1: "Suma",
    2: "Resta",
    3: "Multiplicacion",
    4: "Division",
  },

  sum(a, b) {
    return a + b;
  },

  subtract(a, b) {
    return a - b;
  },

  multiply(a, b) {
    return a * b;
  },

  divide(a, b) {
    return a / b;
  },

  getOperationName(option) {
    return this.operationLabels[option] ?? "Operacion desconocida";
  },

  addToHistory(record) {
    this.history.push(record);
  },

  showHistory() {
    if (this.history.length === 0) {
      console.log("Todavia no hay operaciones registradas.");
      return;
    }

    console.log("===== HISTORIAL DE OPERACIONES =====");
    this.history.forEach((record, index) => {
      console.log(
        `${index + 1}. ${record.description()} | Resultado: ${record.result}`
      );
    });
  },
};

function askNonEmptyText(message) {
  let value = "";

  while (!value) {
    const input = prompt(message);

    if (input === null) {
      const wantsExit = confirm("Cancelaste el ingreso. Queres salir de la aplicacion?");

      if (wantsExit) {
        return null;
      }

      continue;
    }

    value = input.trim();

    if (!value) {
      alert("Por favor, ingresá un texto válido.");
    }
  }

  return value;
}

function askNumber(message) {
  while (true) {
    const input = prompt(message);

    if (input === null) {
      const wantsExit = confirm("Cancelaste el ingreso. Queres salir de la aplicacion?");

      if (wantsExit) {
        return null;
      }

      continue;
    }

    const parsedValue = Number(input);

    if (!Number.isNaN(parsedValue)) {
      return parsedValue;
    }

    alert("Ingresá un número válido.");
  }
}

function askMenuOption() {
  const menu = [
    "Elegí una opción:",
    "1 - Sumar",
    "2 - Restar",
    "3 - Multiplicar",
    "4 - Dividir",
    "5 - Ver historial",
    "6 - Ver resumen del historial",
    "7 - Salir",
  ].join("\n");

  while (true) {
    const option = prompt(menu);

    if (option === null) {
      return 7;
    }

    const parsedOption = Number(option);

    if (parsedOption >= 1 && parsedOption <= 7) {
      return parsedOption;
    }

    alert("Seleccioná una opción entre 1 y 7.");
  }
}

function createOperationRecord(type, firstNumber, secondNumber, result) {
  return {
    type,
    firstNumber,
    secondNumber,
    result,
    description() {
      return `${this.type}: ${this.firstNumber} y ${this.secondNumber}`;
    },
  };
}

function calculateByOption(option, firstNumber, secondNumber) {
  switch (option) {
    case 1:
      return calculatorApp.sum(firstNumber, secondNumber);
    case 2:
      return calculatorApp.subtract(firstNumber, secondNumber);
    case 3:
      return calculatorApp.multiply(firstNumber, secondNumber);
    case 4:
      if (secondNumber === 0) {
        alert("No se puede dividir por cero.");
        return null;
      }

      return calculatorApp.divide(firstNumber, secondNumber);
    default:
      alert("La opción elegida no es válida.");
      return null;
  }
}

function summarizeHistory(history) {
  let totalResults = 0;
  let index = 0;

  while (index < history.length) {
    totalResults += history[index].result;
    index += 1;
  }

  const positiveResults = history.filter((record) => record.result >= 0);

  return {
    totalOperations: history.length,
    totalResults,
    positiveResults,
  };
}

function showHistorySummary() {
  if (calculatorApp.history.length === 0) {
    console.log("No hay datos suficientes para mostrar un resumen.");
    return;
  }

  const summary = summarizeHistory(calculatorApp.history);

  console.log("===== RESUMEN DEL HISTORIAL =====");
  console.log(`Operaciones realizadas: ${summary.totalOperations}`);
  console.log(`Suma de resultados: ${summary.totalResults}`);
  console.log(`Resultados positivos o cero: ${summary.positiveResults.length}`);

  for (let index = 0; index < summary.positiveResults.length; index += 1) {
    const record = summary.positiveResults[index];
    console.log(`- ${record.description()} | Resultado: ${record.result}`);
  }
}

function processOperation(option) {
  const firstNumber = askNumber("Ingresá el primer número:");

  if (firstNumber === null) {
    return false;
  }

  const secondNumber = askNumber("Ingresá el segundo número:");

  if (secondNumber === null) {
    return false;
  }

  const result = calculateByOption(option, firstNumber, secondNumber);

  if (result === null) {
    return false;
  }

  const operationName = calculatorApp.getOperationName(option);
  const record = createOperationRecord(operationName, firstNumber, secondNumber, result);

  calculatorApp.addToHistory(record);

  console.clear();
  console.log(`Operacion realizada: ${record.description()}`);
  console.log(`Resultado obtenido: ${result}`);
  alert(`El resultado de la ${operationName.toLowerCase()} es: ${result}`);

  return true;
}

function runCalculatorApp() {
  console.clear();
  console.log("===== INICIO DE LA APLICACION =====");

  const userName = askNonEmptyText("Bienvenido/a. Ingresá tu nombre:");

  if (userName === null) {
    alert("La aplicación finalizó sin iniciar.");
    return;
  }

  alert(`Hola, ${userName}. Revisá la consola para ver el detalle de cada operación.`);

  let shouldContinue = true;

  while (shouldContinue) {
    const option = askMenuOption();

    switch (option) {
      case 1:
      case 2:
      case 3:
      case 4:
        processOperation(option);
        break;
      case 5:
        console.clear();
        calculatorApp.showHistory();
        break;
      case 6:
        console.clear();
        showHistorySummary();
        break;
      case 7:
        shouldContinue = false;
        break;
      default:
        alert("Opción no válida.");
    }
  }

  console.log("===== FIN DE LA APLICACION =====");
  console.log("Gracias por usar la aplicación.");
  alert("Gracias por usar la aplicación. Hasta luego.");
}

document.getElementById("start-app").addEventListener("click", runCalculatorApp);
