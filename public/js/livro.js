//const urlBase = 'https://backend-mongodb-pi.vercel.app/api'
const urlBase = 'http://localhost:4000/api'
const resultadoModal = new bootstrap.Modal(document.getElementById("modalMensagem"))
const access_token = localStorage.getItem("token") || null

//evento submit do formulário
document.getElementById('formLivro').addEventListener('submit', function (event) {
    event.preventDefault() // evita o recarregamento
    const idLivro = document.getElementById('id').value
    let livro = {}

    if (idLivro.length > 0) { //Se possuir o ID, enviamos junto com o objeto
        
        livro = {
            "_id": idLivro,
            "titulo": document.getElementById('titulo').value,
            "paginas": document.getElementById('paginas').value,
            "data_publicacao": document.getElementById('publicacao').value,
            "preco": document.getElementById('preco').value,
            "origem": {
                "autora": document.getElementById('autora').value,
                "editora": document.getElementById('editora').value
            }
        }
    } else {

        livro = {
            "titulo": document.getElementById('titulo').value,
            "paginas": document.getElementById('paginas').value,
            "data_publicacao": document.getElementById('publicacao').value,
            "preco": document.getElementById('preco').value,
            "origem": {
                "autora": document.getElementById('autora').value,
                "editora": document.getElementById('editora').value
            } 
        }
    }
    salvaLivro(livro)
})

async function salvaLivro(livro) {    
    if (livro.hasOwnProperty('_id')) { 
        await fetch(`${urlBase}/livros`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "access-token": access_token //envia o token na requisição
            },
            body: JSON.stringify(livro)
        })
            .then(response => response.json())
            .then(data => {
                // Verificar se o token foi retornado        
                if (data.acknowledged) {
                    alert('✔ Livro alterado com sucesso!')
                    //Limpar o formulário
                    document.getElementById('formLivro').reset()
                    //Atualiza a UI
                    carregaLivros()
                } else if (data.errors) {
                    // Caso haja erros na resposta da API
                    const errorMessages = data.errors.map(error => error.msg).join("\n");
                    // alert("Falha no login:\n" + errorMessages);
                    document.getElementById("mensagem").innerHTML = `<span class='text-danger'>${errorMessages}</span>`
                    resultadoModal.show();
                } else {
                    document.getElementById("mensagem").innerHTML = `<span class='text-danger'>${JSON.stringify(data)}</span>`
                    resultadoModal.show();
                }
            })
            .catch(error => {
                document.getElementById("mensagem").innerHTML = `<span class='text-danger'>Erro ao salvar o livro: ${error.message}</span>`
                resultadoModal.show();
            });

    } else { //caso não tenha o ID, iremos incluir (POST)
        // Fazer a solicitação POST para o endpoint dos livros
        await fetch(`${urlBase}/livros`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "access-token": access_token //envia o token na requisição
            },
            body: JSON.stringify(livro)
        })
            .then(response => response.json())
            .then(data => {
                // Verificar se o token foi retornado        
                if (data.acknowledged) {
                    alert('✔ Livro incluído com sucesso!')
                    //Limpar o formulário
                    document.getElementById('formLivro').reset()
                    //Atualiza a UI
                    carregaLivros()
                } else if (data.errors) {
                    // Caso haja erros na resposta da API
                    const errorMessages = data.errors.map(error => error.msg).join("\n");
                    // alert("Falha no login:\n" + errorMessages);
                    document.getElementById("mensagem").innerHTML = `<span class='text-danger'>${errorMessages}</span>`
                    resultadoModal.show();
                } else {
                    document.getElementById("mensagem").innerHTML = `<span class='text-danger'>${JSON.stringify(data)}</span>`
                    resultadoModal.show();
                }
            })
            .catch(error => {
                document.getElementById("mensagem").innerHTML = `<span class='text-danger'>Erro ao salvar o livro: ${error.message}</span>`
                resultadoModal.show();
            });
    }
}

async function carregaLivros() {
    const tabela = document.getElementById('dadosTabela')
    tabela.innerHTML = '' //Limpa a tabela antes de recarregar
    // Fazer a solicitação GET para o endpoint dos livros
    await fetch(`${urlBase}/livros`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "access-token": access_token //envia o token na requisição
        }
    })
        .then(response => response.json())
        .then(data => {

            data.forEach(livro => {

                tabela.innerHTML += `
                <tr>
                   <td>${livro.titulo}</td>
                   <td>${livro.paginas}</td>
                   <td>${livro.data_publicacao}</td>
                   <td>${livro.preco}</td>
                   <td>${livro.origem.autora}</td>
                   <td>${livro.origem.editora}</td>
                   <td>
                       <button class='btn btn-danger btn-sm' onclick='removeLivro("${livro._id}")'>🗑 Excluir </button>
                       <button class='btn btn-warning btn-sm' onclick='buscaLivroPeloId("${livro._id}")'>📝 Editar </button>
                    </td>           
                </tr>
                `
            })
        })
        .catch(error => {
            document.getElementById("mensagem").innerHTML = `<span class='text-danger'>Erro ao salvar o livro: ${error.message}</span>`
            resultadoModal.show();
        });
}

async function removeLivro(id) {
    if (confirm('Deseja realmente excluir o livro?')) {
        await fetch(`${urlBase}/livros/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "access-token": access_token //envia o token na requisição
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.deletedCount > 0) {
                    //alert('Registro Removido com sucesso')
                    carregaLivros() // atualiza a UI
                }
            })
            .catch(error => {
                document.getElementById("mensagem").innerHTML = `<span class='text-danger'>Erro ao salvar o livro: ${error.message}</span>`
                resultadoModal.show();
            });
    }
}

async function buscaLivroPeloId(id) {
    await fetch(`${urlBase}/livros/id/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "access-token": access_token //envia o token na requisição
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data[0]) { //Iremos pegar os dados e colocar no formulário.
                document.getElementById('id').value = data[0]._id
                document.getElementById('titulo').value = data[0].titulo
                document.getElementById('paginas').value = data[0].paginas
                document.getElementById('preco').value = data[0].preco
                document.getElementById('publicacao').value = data[0].data_publicacao
                document.getElementById('autora').value = data[0].origem.autora
                document.getElementById('editora').value = data[0].origem.editora               
            }
        })
        .catch(error => {
            document.getElementById("mensagem").innerHTML = `<span class='text-danger'>Erro ao salvar o livro: ${error.message}</span>`
            resultadoModal.show();
        });

}