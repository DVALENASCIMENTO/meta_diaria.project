function toggleEdit(id) { // Define a função 'toggleEdit' que aceita um parâmetro 'id'.
    const input = document.getElementById(id); // Seleciona o elemento de entrada pelo 'id' fornecido.
    const displayValue = document.getElementById(`display-${id}`); // Seleciona o elemento que exibe o valor atual, formatado.

    if (input.style.display === "none") { // Verifica se o campo de entrada está oculto.
        input.style.display = "inline-block"; // Exibe o campo de entrada.
        displayValue.style.display = "none"; // Oculta o valor exibido.

        // Remove a formatação para que o valor seja editável
        input.value = displayValue.textContent.replace(/\./g, '').replace(',', '.'); // Remove a formatação do valor exibido e coloca no campo de entrada.

        // Seleciona automaticamente o texto do campo de entrada
        input.select(); // Seleciona o conteúdo do campo de entrada para facilitar a edição.
    } else {
        input.style.display = "none"; // Oculta o campo de entrada.
        displayValue.style.display = "inline-block"; // Exibe o valor formatado novamente.

        // Formata o valor, tratando os dias como inteiros e os outros como decimais
        if (id === "diasMes" || id === "diasTrabalhados") { // Verifica se o 'id' é 'diasMes' ou 'diasTrabalhados'.
            displayValue.textContent = parseInt(input.value, 10); // Exibe como inteiro.
        } else {
            displayValue.textContent = formatarNumero(parseFloat(input.value.replace(',', '.'))); // Formata o valor como decimal.
        }

        // Salva o valor no localStorage
        localStorage.setItem(id, input.value); // Armazena o valor no localStorage usando o 'id' como chave.
    }
}

function calcularMeta() { // Define a função 'calcularMeta' para calcular as metas.
    const diasMes = parseInt(document.getElementById("diasMes").value, 10); // Obtém o valor de 'diasMes' e o converte para inteiro.
    const diasTrabalhados = parseInt(document.getElementById("diasTrabalhados").value, 10); // Obtém o valor de 'diasTrabalhados' e o converte para inteiro.
    const meta2 = parseFloat(document.getElementById("meta2").value.replace('.', '').replace(',', '.')); // Obtém e formata o valor de 'meta2' como decimal.
    const realizado = parseFloat(document.getElementById("realizado").value.replace('.', '').replace(',', '.')); // Obtém e formata o valor de 'realizado' como decimal.

    // Calcular dias a trabalhar
    const diasATrabalhar = diasMes - diasTrabalhados; // Calcula a quantidade de dias restantes para trabalhar.

    // Verifica se os dias a trabalhar são válidos para evitar divisão por zero
    if (diasATrabalhar <= 0) { // Verifica se os dias a trabalhar são zero ou negativos.
        alert("Verifique os dias trabalhados e do mês. Não é possível calcular com os valores atuais."); // Alerta o usuário sobre a impossibilidade de calcular.
        return; // Encerra a função.
    }

    // Calcula a Meta Diária
    const metaDiaria = (meta2 - realizado) / diasATrabalhar; // Calcula a meta diária com base nos valores fornecidos.

    // Garante que a Meta Diária não fique negativa
    const metaDiariaFormatada = metaDiaria < 0 ? 0 : metaDiaria; // Se a meta diária for negativa, define como 0.

    // Calcula a Tendência
    const tendencia = (realizado / diasTrabalhados) * (diasMes / meta2) * 100; // Calcula a tendência percentual.

    // Atualiza os resultados na tela
    document.getElementById("meta-diaria").textContent = formatarNumero(metaDiariaFormatada); // Exibe a meta diária formatada.
    document.getElementById("tendencia").textContent = tendencia.toFixed(2) + "%"; // Exibe a tendência com duas casas decimais.
    document.getElementById("dias-a-trabalhar").textContent = diasATrabalhar; // Exibe o número de dias a trabalhar.

    // Atualiza as estrelas conforme as metas alcançadas
    atualizarMetas(realizado, [ // Chama a função 'atualizarMetas' com os valores realizados e as metas.
        parseFloat(document.getElementById("meta1").value.replace('.', '').replace(',', '.')), // Converte e formata o valor de 'meta1'.
        meta2, // Usa o valor de 'meta2'.
        parseFloat(document.getElementById("meta3").value.replace('.', '').replace(',', '.')), // Converte e formata o valor de 'meta3'.
        parseFloat(document.getElementById("meta4").value.replace('.', '').replace(',', '.')), // Converte e formata o valor de 'meta4'.
        parseFloat(document.getElementById("meta5").value.replace('.', '').replace(',', '.')) // Converte e formata o valor de 'meta5'.
    ]);

    // Salva os valores dos inputs no localStorage
    salvarValoresInputs(); // Chama a função para salvar os valores dos campos de entrada.
    // Salva os resultados no localStorage
    salvarResultados(metaDiariaFormatada, tendencia, diasATrabalhar); // Chama a função para salvar os resultados calculados.
}

function atualizarMetas(realizado, metas) { // Define a função 'atualizarMetas' que aceita os valores realizados e as metas.
    for (let i = 0; i < metas.length; i++) { // Loop através das metas.
        const estrela = document.getElementById(`estrela${i + 1}`); // Seleciona a estrela correspondente ao índice.
        if (realizado >= metas[i]) { // Verifica se o valor realizado é maior ou igual à meta.
            estrela.style.backgroundColor = "#ff0"; // Define a cor da estrela como amarela se a meta foi alcançada.
        } else {
            estrela.style.backgroundColor = "#ccc"; // Define a cor padrão se a meta não foi alcançada.
        }
    }
}

function formatarNumero(valor) { // Define a função 'formatarNumero' para formatar um número.
    // Formata o número para o formato "32.500,81"
    const partes = valor.toFixed(2).split("."); // Converte o valor para duas casas decimais e separa em partes (inteiro e decimal).
    partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Formatação para milhares, inserindo pontos.
    return partes.join(","); // Substitui o ponto decimal por uma vírgula e retorna a string formatada.
}

function salvarValoresInputs() { // Define a função 'salvarValoresInputs' para armazenar os valores dos campos de entrada.
    const campos = ["diasMes", "diasTrabalhados", "meta2", "realizado", "meta1", "meta3", "meta4", "meta5"]; // Define um array com os IDs dos campos.
    campos.forEach(id => { // Itera sobre cada ID no array.
        const valor = document.getElementById(id).value; // Obtém o valor do campo de entrada correspondente.
        localStorage.setItem(id, valor); // Armazena o valor no localStorage usando o ID como chave.
    });
}

function salvarResultados(metaDiaria, tendencia, diasATrabalhar) { // Define a função 'salvarResultados' para armazenar resultados calculados.
    localStorage.setItem("metaDiaria", metaDiaria); // Armazena a meta diária no localStorage.
    localStorage.setItem("tendencia", tendencia); // Armazena a tendência no localStorage.
    localStorage.setItem("diasATrabalhar", diasATrabalhar); // Armazena os dias a trabalhar no localStorage.
}

function carregarResultados() { // Define a função 'carregarResultados' para recuperar os valores armazenados.
    const campos = ["diasMes", "diasTrabalhados", "meta2", "realizado", "meta1", "meta3", "meta4", "meta5"]; // Define um array com os IDs dos campos.
    campos.forEach(id => { // Itera sobre cada ID no array.
        const valor = localStorage.getItem(id); // Obtém o valor do localStorage usando o ID como chave.
        if (valor !== null) { // Verifica se o valor não é nulo.
            document.getElementById(id).value = valor; // Define o valor do campo de entrada com o valor recuperado.
            const displayValue = document.getElementById(`display-${id}`); // Seleciona o elemento que exibe o valor formatado.
            if (id === "diasMes" || id === "diasTrabalhados") { // Verifica se o ID é 'diasMes' ou 'diasTrabalhados'.
                displayValue.textContent = parseInt(valor, 10); // Exibe como inteiro.
            } else {
                displayValue.textContent = formatarNumero(parseFloat(valor.replace(',', '.'))); // Formata o valor com casas decimais.
            }
        }
    });

    // Carregar resultados salvos
    const metaDiaria = localStorage.getItem("metaDiaria"); // Obtém a meta diária do localStorage.
    const tendencia = localStorage.getItem("tendencia"); // Obtém a tendência do localStorage.
    const diasATrabalhar = localStorage.getItem("diasATrabalhar"); // Obtém os dias a trabalhar do localStorage.

    if (metaDiaria !== null) { // Verifica se a meta diária não é nula.
        document.getElementById("meta-diaria").textContent = formatarNumero(parseFloat(metaDiaria)); // Exibe a meta diária formatada.
    }
    if (tendencia !== null) { // Verifica se a tendência não é nula.
        document.getElementById("tendencia").textContent = parseFloat(tendencia).toFixed(2) + "%"; // Exibe a tendência com duas casas decimais.
    }
    if (diasATrabalhar !== null) { // Verifica se os dias a trabalhar não são nulos.
        document.getElementById("dias-a-trabalhar").textContent = parseInt(diasATrabalhar, 10); // Exibe os dias a trabalhar como inteiro.
    }
}

// Carregar os dados salvos ao carregar a página
window.onload = carregarResultados; // Define a função que será executada ao carregar a página como 'carregarResultados'.
