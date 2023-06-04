'use strict'

const formLogin = document.getElementById('formLogin')
const botaoGoogle = document.getElementById('loginGoogle')

formLogin.addEventListener('submit', (event) => {
    event.preventDefault()
    const email = document.getElementById('email').value
    const senha = document.getElementById('senha').value
    loginFirebase(email, senha)
}
)

botaoGoogle.addEventListener('click', (event) => {
    event.preventDefault()
    loginGoogle()
}
)
