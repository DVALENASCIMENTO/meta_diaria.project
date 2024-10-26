function toggleEdit(id) { 
    const input = document.getElementById(id);
    const displayValue = document.getElementById(`display-${id}`);

    if (input && displayValue) {
        if (input.style.display === "none" || input.style.display === "") {
            input.style.display = "inline-block";
            displayValue.style.display = "none";
            input.value = displayValue.textContent.replace(/\./g, '').replace(',', '.');
            input.select();
        } else {
            input.style.display = "none";
            displayValue.style.display = "inline-block";

            if (id === "diasMes" || id === "diasTrabalhados") {
                displayValue.textContent = parseInt(input.value, 10);
            } else {
                displayValue.textContent = formatarNumero(parseFloat(input.value.replace(',', '.')));
            }

            localStorage.setItem(`meta_diaria_${id}`, input.value);
        }
    }
}

function calcularMeta() {
    const diasMes = parseInt(document.getElementById("diasMes").value, 10);
    const diasTrabalhados = parseInt(document.getElementById("diasTrabalhados").value, 10);
    const meta2 = parseFloat(document.getElementById("meta2").value.replace('.', '').replace(',', '.'));
    const realizado = parseFloat(document.getElementById("realizado").value.replace('.', '').replace(',', '.'));

    const diasATrabalhar = diasMes - diasTrabalhados;

    if (diasATrabalhar <= 0) {
        alert("Verifique os dias trabalhados e do mês. Não é possível calcular com os valores atuais.");
        return;
    }

    const metaDiaria = (meta2 - realizado) / diasATrabalhar;
    const metaDiariaFormatada = metaDiaria < 0 ? 0 : metaDiaria;
    const tendencia = (realizado / diasTrabalhados) * (diasMes / meta2) * 100;

    document.getElementById("meta-diaria").textContent = formatarNumero(metaDiariaFormatada);
    document.getElementById("tendencia").textContent = tendencia.toFixed(2) + "%";
    document.getElementById("dias-a-trabalhar").textContent = diasATrabalhar;

    atualizarMetas(realizado, [
        parseFloat(document.getElementById("meta1").value.replace('.', '').replace(',', '.')),
        meta2,
        parseFloat(document.getElementById("meta3").value.replace('.', '').replace(',', '.')),
        parseFloat(document.getElementById("meta4").value.replace('.', '').replace(',', '.')),
        parseFloat(document.getElementById("meta5").value.replace('.', '').replace(',', '.'))
    ]);

    salvarValoresInputs();
    salvarResultados(metaDiariaFormatada, tendencia, diasATrabalhar);

    // Chamada para desenhar o medidor com valores atualizados
    desenharMedidor(realizado, meta2);
}

function atualizarMetas(realizado, metas) {
    for (let i = 0; i < metas.length; i++) {
        const estrela = document.getElementById(`estrela${i + 1}`);
        if (realizado >= metas[i]) {
            estrela.style.backgroundColor = "#ff0";
        } else {
            estrela.style.backgroundColor = "#ccc";
        }
    }
}

function formatarNumero(valor) {
    const partes = valor.toFixed(2).split(".");
    partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return partes.join(",");
}

function salvarValoresInputs() {
    const campos = ["diasMes", "diasTrabalhados", "meta2", "realizado", "meta1", "meta3", "meta4", "meta5"];
    campos.forEach(id => {
        const valor = document.getElementById(id).value;
        localStorage.setItem(`meta_diaria_${id}`, valor);
    });
}

function salvarResultados(metaDiaria, tendencia, diasATrabalhar) {
    localStorage.setItem("meta_diaria_metaDiaria", metaDiaria);
    localStorage.setItem("meta_diaria_tendencia", tendencia);
    localStorage.setItem("meta_diaria_diasATrabalhar", diasATrabalhar);
}

function carregarResultados() {
    const campos = ["diasMes", "diasTrabalhados", "meta2", "realizado", "meta1", "meta3", "meta4", "meta5"];
    campos.forEach(id => {
        const valor = localStorage.getItem(`meta_diaria_${id}`);
        if (valor !== null) {
            document.getElementById(id).value = valor;
            const displayValue = document.getElementById(`display-${id}`);
            if (id === "diasMes" || id === "diasTrabalhados") {
                displayValue.textContent = parseInt(valor, 10);
            } else {
                displayValue.textContent = formatarNumero(parseFloat(valor.replace(',', '.')));
            }
        }
    });

    const metaDiaria = localStorage.getItem("meta_diaria_metaDiaria");
    const tendencia = localStorage.getItem("meta_diaria_tendencia");
    const diasATrabalhar = localStorage.getItem("meta_diaria_diasATrabalhar");

    if (metaDiaria !== null) {
        document.getElementById("meta-diaria").textContent = formatarNumero(parseFloat(metaDiaria));
    }
    if (tendencia !== null) {
        document.getElementById("tendencia").textContent = tendencia + "%";
    }
    if (diasATrabalhar !== null) {
        document.getElementById("dias-a-trabalhar").textContent = diasATrabalhar;
    }
}

function scrollToContent() {
    document.getElementById("main-content").scrollIntoView({
        behavior: 'smooth'
    });
}

function atualizarDataHora() {
    const agora = new Date();
    const opcoesData = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const opcoesHora = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const data = agora.toLocaleDateString('pt-BR', opcoesData);
    const hora = agora.toLocaleTimeString('pt-BR', opcoesHora);
    document.getElementById('data-hora').innerText = `${data} ${hora}`;
}

function desenharMedidor(valorAtual, valorMaximo) {
    const canvas = document.getElementById('metaGauge');
    if (!canvas || valorMaximo <= 0) return; // Verificação para garantir que o canvas existe e o valor máximo é válido
    
    const ctx = canvas.getContext('2d');
    const raio = 70; // Raio do arco
    const centroX = canvas.width / 2;
    const centroY = canvas.height;

    // Limpar o canvas antes de desenhar
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenho da base do medidor (fundo cinza claro)
    ctx.beginPath();
    ctx.arc(centroX, centroY, raio, Math.PI, 0, false);
    ctx.lineWidth = 15;
    ctx.strokeStyle = '#e0e0e0'; // Cor de fundo do arco
    ctx.stroke();

    // Calcular a porcentagem e o ângulo do progresso
    const porcentagem = Math.min(valorAtual / valorMaximo, 1);  // Limitar a porcentagem máxima em 1 (100%)
    const anguloProgresso = Math.PI * (1 - porcentagem); // Ângulo final do progresso

    // Definir a cor verde para o progresso do medidor
    const corProgresso = '#76c7c0';

    // Desenho do arco de progresso
    ctx.beginPath();
    ctx.arc(centroX, centroY, raio, Math.PI, anguloProgresso, false);
    ctx.lineWidth = 15;
    ctx.strokeStyle = corProgresso;
    ctx.stroke();

    // Exibição da porcentagem no centro do medidor
    ctx.font = '16px Arial';
    ctx.fillStyle = '#FFFFFF'; // Cor do texto em branco
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(porcentagem * 100)}%`, centroX, centroY - 20);
}


// Carregamento inicial dos resultados e configuração do medidor
document.addEventListener("DOMContentLoaded", () => {
    carregarResultados();
    atualizarDataHora();
    setInterval(atualizarDataHora, 1000);

    // Chamada inicial para desenhar o medidor com valores carregados
    const realizado = parseFloat(document.getElementById("realizado").value.replace(',', '.')) || 0;
    const meta2 = parseFloat(document.getElementById("meta2").value.replace(',', '.')) || 1;  // Evita divisão por zero
    desenharMedidor(realizado, meta2);
});
