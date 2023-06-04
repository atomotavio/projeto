'use strict'

const formNovoAluno = document.getElementById('formNovoAluno')

formNovoAluno.addEventListener('submit', (event) => {
  const email = document.getElementById('emailNovo').value
  const senha = document.getElementById('senhaNovo').value
  event.preventDefault()
  novoAluno(email, senha)
})