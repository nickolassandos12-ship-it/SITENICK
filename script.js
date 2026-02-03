// Função genérica para enviar dados ao servidor
async function enviarParaBackend(url, dados) {
    try {
        /* No Railway, não usamos localhost:3002. 
           Ao deixar apenas '${url}', o navegador entende que deve enviar 
           para o próprio endereço onde o site está hospedado.
        */
        const response = await fetch(url, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert(result.message);
        } else {
            alert("Erro no servidor: " + (result.error || "Erro desconhecido"));
        }
    } catch (error) {
        console.error("Erro ao enviar:", error);
        alert("Não foi possível conectar ao servidor. Verifique sua conexão.");
    }
}

// O restante dos eventos permanece igual, garantindo que as URLs comecem com /api
document.getElementById('formDoacao')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const dados = {
        tipo: 'doacao',
        endereco: document.getElementById('endDoacao').value,
        descricao: document.getElementById('descDoacao').value
    };
    enviarParaBackend('/api/ajudar', dados);
    e.target.reset();
});

document.getElementById('formPedido')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const dados = {
        tipo: 'pedido',
        endereco: document.getElementById('endPedido').value,
        descricao: document.getElementById('descPedido').value
    };
    enviarParaBackend('/api/ajudar', dados);
    e.target.reset();
});

document.getElementById('formVoluntario')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const dados = {
        nome: document.getElementById('nomeVol').value,
        telefone: document.getElementById('telVol').value,
        email: document.getElementById('emailVol').value
    };
    enviarParaBackend('/api/voluntarios', dados);
    e.target.reset();
});