const sequelize = require('sequelize');
const connection = require('./configDB');

const database = connection.define('jogos',{

    
    title:{
        type: sequelize.STRING,
        allowNull: false
    },
    year:{
        type: sequelize.DATE,
        allowNull:false
    },
    price:{
        type: sequelize.DOUBLE,
        
    }

})

database
    .sync({force:false})
    .then(()=>{
        console.log('Tabela cadastrada com SUCESSO!');
    })
    .catch((msgErro)=>{
        console.log('Erro ao cadastrar a tabela - ' + msgErro);
    })

module.exports = database;    