function salvar(event, collection){
    event.preventDefault() 
    if(document.getElementById('materia').value === ''){
        alerta('❗ É obrigatório informar a materia.','danger')        
    } else if(document.getElementById('professor').value === ''){
        alerta('❗ É obrigatório informar o professor.','danger')               
    } else {
        incluir(event, collection)
    }
}

async function incluir(event, collection){
    event.preventDefault()
    let usuarioAtual = firebase.auth().currentUser
    let botaoSalvar = document.getElementById('btnSalvar')
    botaoSalvar.innerHTML = 'Salvando...'
    let turno = ''
    if(document.getElementById('turno-0').value !=='' ){
        turno = 'manha'
    } else if(document.getElementById('turno-1').value !=='' ){
        turno = 'tarde'
    } else if(document.getElementById('turno-2').value !=='' ){
        turno = 'noite'
    }
    let area = ''
    if(document.getElementById('area-0').value !=='' ){
        area = 'exatas'
    } else if(document.getElementById('area-1').value !=='' ){
        area = 'humanas'
    }
    let semestre = ''
    if(document.getElementById('semestre-0').value !=='' ){
        semestre = 'primeiro'
    } else if(document.getElementById('semestre-1').value !=='' ){
        semestre = 'segundo'
    } else if(document.getElementById('semestre-2').value !=='' ){
        semestre = 'terceiro'
    }
    return await firebase.database().ref(collection).push({
        materia: document.getElementById('materia').value,
        professor: document.getElementById('professor').value,
        turno: turno,
        area: area,
        semestre: semestre,
        usuario: usuarioAtual.uid
    })
    .then(()=> {
        alerta('✔ Registro incluído com sucesso','success')
        //vamos limpar o formulário
        document.getElementById('formCadastro').reset()
    })
    .catch(error => {
        alerta('❌Erro na inclusão '+ error.message, 'danger')
    })
}