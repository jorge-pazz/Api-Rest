const { Model } = require('sequelize');
const sequelize = require('sequelize');
const connection = require('../database/configDB');

const modelUser = connection.define('users',{

    name:{
        type: sequelize.STRING,
        allowNull: false
    },

    email:{
        type:sequelize.STRING,
        allowNull: false
    },

    password:{
        type:sequelize.STRING,
        allowNull: false

    }

})

modelUser
    .sync({force: false})
    .then(()=>{
        console.log('SUCESSO AO CRIAR E CONECTAR TABLE USER');
    })
    .catch((msgErro)=>{
        console.log('Erro ao Criar e conectar tabela user - ' + msgErro);
    })

module.exports = modelUser;    