const calculatorApp = {
  // Aca voy guardando todas las operaciones que se hacen para despues poder mostrarlas
  // o sacar un resumen sin tener que volver a calcular nada.
  history: [],
  // Esto me sirve para mostrar un nombre mas claro segun la opcion elegida en el menu,
  // asi no trabajo todo el tiempo con numeros sueltos.
  operationLabels: {
    1: "Suma",
    2: "Resta",
    3: "Multiplicacion",
    4: "Division",
  },

  // Operaciones basicas de la calculadora. Las separé en metodos para que despues
  // sea mas prolijo llamarlas desde el switch principal.
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

  // Devuelve el nombre de la operacion segun el numero del menu.
  // Si llega un valor raro, muestro un texto generico para evitar errores.
  getOperationName(option) {
    return this.operationLabels[option] ?? "Operacion desconocida";
  },

  // Cada operacion hecha se agrega al historial para que quede registro
  // de lo que se hizo durante la ejecucion.
  addToHistory(record) {
    this.history.push(record);
  },

  // Muestra por consola todo lo que se fue haciendo.
  // Cada linea incluye el numero de operacion, una descripcion y el resultado.
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

  // Repite hasta que el usuario escriba algo valido o decida salir.
  // Esto lo uso para asegurarme de no trabajar con un nombre vacio.
  while (!value) {
    const input = prompt(message);

    if (input === null) {
      // Si cancela, le pregunto si realmente quiere cerrar todo.
      // Si no quiere salir, lo mando de nuevo al prompt.
      const wantsExit = confirm("Cancelaste el ingreso. Queres salir de la aplicacion?");

      if (wantsExit) {
        return null;
      }

      continue;
    }

    value = input.trim();

    // trim() saca espacios al principio y al final, asi evito que me pasen "   "
    // y eso cuente como un nombre valido.
    if (!value) {
      alert("Por favor, ingresá un texto válido.");
    }
  }

  return value;
}

function askNumber(message) {
  // Este prompt se repite hasta que entre un numero.
  // Lo hice aparte para reutilizar la misma validacion en todas las operaciones.
  while (true) {
    const input = prompt(message);

    if (input === null) {
      const wantsExit = confirm("Cancelaste el ingreso. Queres salir de la aplicacion?");

      if (wantsExit) {
        return null;
      }

      continue;
    }

    // Convierto lo ingresado a numero para poder operar despues sin problemas.
    const parsedValue = Number(input);

    if (!Number.isNaN(parsedValue)) {
      return parsedValue;
    }

    alert("Ingresá un número válido.");
  }
}

function askMenuOption() {
  // Armo el menu como texto para mostrarlo en un solo prompt.
  // Asi queda mas ordenado y es facil cambiar opciones si hace falta.
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

  // Solo dejo avanzar si la opcion esta dentro del rango del menu.
  // Si escribe cualquier otra cosa, vuelvo a pedir el dato.
  while (true) {
    const option = prompt(menu);

    if (option === null) {
      // Si cancela aca, lo tomo como salir.
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
  // Cada registro guarda los datos de la cuenta y una descripcion para mostrarla despues.
  // Lo deje como objeto para tener todo junto: tipo, numeros usados y resultado.
  return {
    type,
    firstNumber,
    secondNumber,
    result,
    description() {
      // Esta funcion arma un texto simple para no repetir el formato en varios lugares.
      return `${this.type}: ${this.firstNumber} y ${this.secondNumber}`;
    },
  };
}

function calculateByOption(option, firstNumber, secondNumber) {
  // Segun la opcion elegida, llamo a la operacion que corresponda.
  // Esta funcion centraliza el calculo y tambien algunas validaciones.
  switch (option) {
    case 1:
      return calculatorApp.sum(firstNumber, secondNumber);
    case 2:
      return calculatorApp.subtract(firstNumber, secondNumber);
    case 3:
      return calculatorApp.multiply(firstNumber, secondNumber);
    case 4:
      // Antes de dividir, controlo que el segundo numero no sea cero.
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

  // Aca sumo todos los resultados del historial.
  // Lo hice con while para practicar otra forma de recorrer arrays.
  while (index < history.length) {
    totalResults += history[index].result;
    index += 1;
  }

  // Tambien separo las operaciones cuyo resultado dio positivo o cero,
  // asi despues puedo mostrarlas aparte en el resumen.
  const positiveResults = history.filter((record) => record.result >= 0);

  // Devuelvo un objeto resumen para tener toda esa info agrupada.
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

  // Uso el resumen para mostrar algunos datos generales del historial.
  // La idea es no listar todo de nuevo, sino dar una vista mas corta.
  const summary = summarizeHistory(calculatorApp.history);

  console.log("===== RESUMEN DEL HISTORIAL =====");
  console.log(`Operaciones realizadas: ${summary.totalOperations}`);
  console.log(`Suma de resultados: ${summary.totalResults}`);
  console.log(`Resultados positivos o cero: ${summary.positiveResults.length}`);

  // Aca recorro solo las operaciones con resultado positivo o cero.
  for (let index = 0; index < summary.positiveResults.length; index += 1) {
    const record = summary.positiveResults[index];
    console.log(`- ${record.description()} | Resultado: ${record.result}`);
  }
}

function processOperation(option) {
  // Pido los dos numeros necesarios para hacer la cuenta.
  // Si el usuario cancela en alguno de los dos pasos, corto esta operacion.
  const firstNumber = askNumber("Ingresá el primer número:");

  if (firstNumber === null) {
    return false;
  }

  const secondNumber = askNumber("Ingresá el segundo número:");

  if (secondNumber === null) {
    return false;
  }

  // Aca se hace el calculo segun la opcion elegida en el menu.
  const result = calculateByOption(option, firstNumber, secondNumber);

  if (result === null) {
    return false;
  }

  // Armo el registro de la operacion para guardarlo en el historial
  // y poder reutilizar esos datos despues.
  const operationName = calculatorApp.getOperationName(option);
  const record = createOperationRecord(operationName, firstNumber, secondNumber, result);

  calculatorApp.addToHistory(record);

  // Limpio consola para que quede mas prolijo lo ultimo que se hizo
  // y no se mezcle con mensajes anteriores.
  console.clear();
  console.log(`Operacion realizada: ${record.description()}`);
  console.log(`Resultado obtenido: ${result}`);
  alert(`El resultado de la ${operationName.toLowerCase()} es: ${result}`);

  return true;
}

function runCalculatorApp() {
  // Arranco limpiando la consola para que la ejecucion empiece mas ordenada.
  console.clear();
  console.log("===== INICIO DE LA APLICACION =====");

  // Primero pido el nombre para hacer el ingreso un poco mas personalizado.
  // Ademas me sirve para asegurar que el usuario interactuo con la app antes del menu.
  const userName = askNonEmptyText("Bienvenido/a. Ingresá tu nombre:");

  if (userName === null) {
    alert("La aplicación finalizó sin iniciar.");
    return;
  }

  alert(`Hola, ${userName}. Revisá la consola para ver el detalle de cada operación.`);

  // Esta variable controla cuando termina el programa.
  let shouldContinue = true;

  // Este bucle mantiene la app funcionando hasta que el usuario elija salir.
  // En cada vuelta muestro el menu y ejecuto lo que corresponda.
  while (shouldContinue) {
    const option = askMenuOption();

    switch (option) {
      case 1:
      case 2:
      case 3:
      case 4:
        // Estas opciones comparten el mismo flujo: pedir datos, calcular y guardar.
        processOperation(option);
        break;
      case 5:
        // Aca muestro el historial completo de operaciones.
        console.clear();
        calculatorApp.showHistory();
        break;
      case 6:
        // Aca muestro una version resumida del historial.
        console.clear();
        showHistorySummary();
        break;
      case 7:
        // Esta opcion corta el while principal.
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

// El programa arranca cuando se hace click en el boton del HTML.
// O sea, hasta que no se toque ese boton, la app no empieza.
document.getElementById("start-app").addEventListener("click", runCalculatorApp);
