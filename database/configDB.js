const sequelize = require('sequelize');
const connection = new sequelize('games','root','Vital20',{

    host: 'localhost',
    dialect: 'mysql'

});


connection
    .authenticate()
    .then(()=>{
        console.log('Conectado com sucesso o BANCO DE DADOS!');
    })
    .catch((msgErro)=>{
        console.log('Erro ao conectar o banco de dados - ' + msgErro);
    })



module.exports = connection;