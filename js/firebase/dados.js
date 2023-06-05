'use strict'

/**
 * obtemDados.
 * Obtem dados da collection a partir do Firebase.
 * @param {string} collection - Nome da collection no Firebase
 * @return {object} - Uma tabela com os dados obtidos
 */
async function obtemDados(collection) {
    let spinner = document.getElementById('carregandoDados')
    let tabela = document.getElementById('tabelaDados')
    await firebase.database().ref(collection).orderByChild('materia').on('value', (snapshot) => {
        tabela.innerHTML = ''
        let cabecalho = tabela.insertRow()
        cabecalho.insertCell().textContent = 'Materia'
        cabecalho.insertCell().textContent = 'Professor'
        cabecalho.insertCell().textContent = 'Área'
        cabecalho.insertCell().textContent = 'Semestre'
        cabecalho.insertCell().textContent = 'Turno'
        cabecalho.insertCell().textContent = 'Ações'

        snapshot.forEach(item => {
            let db = item.ref._delegate._path.pieces_[0]
            let id = item.ref._delegate._path.pieces_[1]
            let novaLinha = tabela.insertRow()
            novaLinha.insertCell().innerHTML = '<small>' + item.val().materia + '</small>'
            novaLinha.insertCell().innerHTML = '<small>' + item.val().professor + '</small>'
            novaLinha.insertCell().textContent = item.val().area
            novaLinha.insertCell().textContent = item.val().semestre
            novaLinha.insertCell().textContent = item.val().turno
            novaLinha.insertCell().innerHTML = `<button class='btn btn-sm btn-danger' onclick=remover('${db}','${id}')><i class="bi bi-trash"></i></button>
        <button class='btn btn-sm btn-warning' onclick=carregaDadosAlteracao('${db}','${id}')><i class="bi bi-pencil-square"></i></button>`
        })
        let rodape = tabela.insertRow()
        rodape.insertCell().innerHTML = totalRegistros(collection)
    })
    spinner.classList.add('d-none')
}

/**
 * obtemDados.
 * Obtem dados da collection a partir do Firebase.
 * @param {string} db - Nome da collection no Firebase
 * @param {integer} id - Id do registro no Firebase
 * @return {object} - Os dados do registro serão vinculados aos inputs do formulário.
 */

async function carregaDadosAlteracao(db, id) {
    await firebase.database().ref(db + '/' + id).on('value', (snapshot) => {
        document.getElementById('id').value = id
        document.getElementById('materia').value = snapshot.val().materia
        document.getElementById('professor').value = snapshot.val().professor
        document.getElementById('area').value = snapshot.val().area
        document.getElementById('turno').value = snapshot.val().turno
        document.getElementById('semestre').value = snapshot.val().semestre
        if (snapshot.val().area === 'Exatas') {
            document.getElementById('area-0').checked = true
        } else {
            document.getElementById('area-1').checked = true
        }
        if (snapshot.val().semestre === 'Primeiro') {
            document.getElementById('semestre-0').checked = true
        } else if (snapshot.val().semestre === 'Segundo') {
            document.getElementById('semestre-1').checked = true
        } else {
            document.getElementById('semestre-2').checked = true
        }
        if (snapshot.val().turno === 'Manhã') {
            document.getElementById('turno-0').checked = true
        } else if (snapshot.val().semestre === 'Tarde') {
            document.getElementById('turno-1').checked = true
        } else {
            document.getElementById('turno-2').checked = true
        }
    })

    document.getElementById('materia').focus()
}

/**
 * incluir.
 * Inclui os dados do formulário na collection do Firebase.
 * @param {object} event - Evento do objeto clicado
 * @param {string} collection - Nome da collection no Firebase
 * @return {null} - Snapshot atualizado dos dados
 */

function salvar(event, collection) {
    event.preventDefault()
    if (document.getElementById('materia').value === '') {
        alerta('⚠️ É obrigatório informar a materia!', 'warning')
    }
    else if (document.getElementById('professor').value === '') {
        alerta('⚠️ É obrigatório informar o professor!', 'warning')
    }
    else if (document.getElementById('id').value !== '') {
        alterar(event, collection)
    }
    else {
        incluir(event, collection)
    }
}

async function incluir(event, collection) {
    let usuarioAtual = firebase.auth().currentUser
    let botaoSalvar = document.getElementById('btnSalvar')
    botaoSalvar.innerHTML = 'Salvando...'
    event.preventDefault()
    const form = document.forms[0];
    const data = new FormData(form);
    const values = Object.fromEntries(data.entries());
    return await firebase.database().ref(collection).push({
        materia: values.materia,
        professor: values.professor,
        turno: values.turno,
        area: values.area,
        semestre: values.semestre,
        dataInclusao: new Date()
    })
        .then(() => {
            alerta(`✅ Registro incluído com sucesso!`, 'success')
            document.getElementById('formCadastro').reset()
            botaoSalvar.innerHTML = '<i class="bi bi-save-fill"></i> Salvar'
        })
        .catch(error => {
            alerta('❌ Falha ao incluir: ' + error.message, 'danger')
        })
}

async function alterar(event, collection) {
    let usuarioAtual = firebase.auth().currentUser
    let botaoSalvar = document.getElementById('btnSalvar')
    botaoSalvar.innerText = 'Aguarde...'
    event.preventDefault()
    const form = document.forms[0];
    const data = new FormData(form);
    const values = Object.fromEntries(data.entries());
    return await firebase.database().ref().child(collection + '/' + values.id).update({
        materia: values.materia,
        professor: values.professor,
        turno: values.turno,
        area: values.area,
        semestre: values.semestre,
        usuarioAlteracao: {
            uid: usuarioAtual.uid,
            nome: usuarioAtual.displayName,
            urlImagem: usuarioAtual.photoURL,
            email: usuarioAtual.email,
            dataAlteracao: new Date()
        }
    })
        .then(() => {
            alerta('✅ Registro alterado com sucesso!', 'success')
            document.getElementById('formCadastro').reset()
            document.getElementById('id').value = ''
            botaoSalvar.innerHTML = '<i class="bi bi-save-fill"></i> Salvar'
        })
        .catch(error => {
            console.error(error.code)
            console.error(error.message)
            alerta('❌ Falha ao alterar: ' + error.message, 'danger')
        })
}

/**
 * remover.
 * Remove os dados da collection a partir do id passado.
 * @param {string} db - Nome da collection no Firebase
 * @param {integer} id - Id do registro no Firebase
 * @return {null} - Snapshot atualizado dos dados
 */
async function remover(db, id) {
    if (window.confirm("⚠️Confirma a exclusão do registro?")) {
        let dadoExclusao = await firebase.database().ref().child(db + '/' + id)
        dadoExclusao.remove()
            .then(() => {
                alerta('✅ Registro removido com sucesso!', 'success')
            })
            .catch(error => {
                console.error(error.code)
                console.error(error.message)
                alerta('❌ Falha ao excluir: ' + error.message, 'danger')
            })
    }
}


/**
 * totalRegistros
 * Retornar a contagem do total de registros da collection informada
 * @param {string} collection - Nome da collection no Firebase
 * @param {integer} id - Id do registro no Firebase
 * @return {null} - Snapshot atualizado dos dados
 */

function totalRegistros(collection) {
    var retorno = '...'
    firebase.database().ref(collection).on('value', (snap) => {
        if (snap.numChildren() === 0) {
            retorno = '⚠️ Ainda não há nenhum registro cadastrado!'
        } else {
            retorno = `Total: <span class="badge fundo-laranja-escuro"> ${snap.numChildren()} </span>`
        }
    })
    return retorno
}
