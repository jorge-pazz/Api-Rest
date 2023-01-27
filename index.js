const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//CORS
const cors = require('cors');
app.use(cors());


//DATABASE

const connection = require('./database/configDB');
const games = require('./database/games');
const modelUser = require('./modelUser')


// JWT
const jwt = require('jsonwebtoken');
const jwtSecret = 'jncfeuifnceuniuncsdcdv';

function auth(req,res,next){

     const authToken =  req.headers['authorization'];

     //next();

     if(authToken != undefined){

        const bearer = authToken.split(' ');
        const tokenr = bearer[1];

        
     
        jwt.verify(tokenr,jwtSecret,(erro,data)=>{

            if(erro){
                res.status(401);
                res.json({erro: 'Token invalido ou expirado'}) 
            }else{
                
                req.token = tokenr;
                req.logge = {id: data.id, email: data.email}    
    
                console.log(data)
                next();

            }
            


        })         

        
     }else{
        res.status(401);
        res.json({erro: 'Token invalido ou expirado'})
     }
     
     

}


//BODY PARSER

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// ROUTER

app.get("/games",auth,(req,res)=>{

    games
        .findAll({
            raw: true,
            order:[['id','DESC']]
        })
        .then((games)=>{
            res.statusCode = 200;
            res.json(games);

        })
        .catch(()=>{
            res.statusCode = 400;
            let status =  (res.statusCode = 400)
            res.send(status)
        })


});

app.get("/game/:id",(req,res)=>{

    let id = req.params.id;

    if(isNaN(id)){
        res.statusCode = 400;
        let status =  (res.statusCode = 400);
        res.send(status)
    }else{
        
        id = parseInt(req.params.id);

        games
        .findByPk(id)
        .then((game)=>{
            res.statusCode = 200;
            res.json(game);
        })
        .catch(()=>{
            res.statusCode = 400;
            let status =  (res.statusCode = 400);
            res.send(status)
        })

    }


});


app.post("/game",(req,res)=>{

    let title = req.body.title
    let year = req.body.year;
    let price = req.body.price;
    
    

    games
        .create({title: title, year: year, price: price})
        .then(()=>{
            res.statusCode = 200;
            res.send('Cadastrado com Sucesso');
        })
        .catch((msgErro)=>{
            res.statusCode = 400;
            res.send('Erro ao cadastra - ' + msgErro);
        })

});


app.delete("/delete/:id",(req,res)=>{

    let id = req.params.id;

    if(isNaN(id)){
        res.statusCode = 404;
        let status =  (res.statusCode = 404);
        res.send(status)
    }else{
        id = Number(id);
      
        games
            .findByPk(id)
            .then((game)=>{

                if(game){
                    
                    games
                     .destroy({where:{id:id}})
            .           then(()=>{
                          res.statusCode = 200
                          res.send('Deletado com Sucesso');                
                        })
                        .catch(()=>{
                          res.statusCode = 400
                          res.send('Erro ao Deletar');   
                        })

                }else{
                    res.statusCode = 404;
                    let status =  (res.statusCode = 404);
                    res.send(status)
                }

                
            })
            .catch(()=>{
                res.statusCode = 404;
                let status =  (res.statusCode = 404);
                res.send(status)
            })
      
    }

})



app.put("/game/:id",(req,res)=>{

    let id = req.params.id;
    let title = req.body.title;
    let year = req.body.year;
    let price = req.body.price;


    if(isNaN(id)){
        res.statusCode = 404;
        let status =  (res.statusCode = 404);
        res.send(status)
    }else{
        id = Number(id);
      
        games
            .findByPk(id)
            .then((game)=>{


                if(title == undefined || title == ""){
                    title = game.title;
                }

                if(year == undefined || year == ""){
                    year = game.year;
                }

                if(price == undefined || price == ""){
                    price = game.price;
                }

                if(game){
                    
                    games
                     .update({title: title, year:year, price:price},{where:{id:id}})
            .           then(()=>{
                          res.statusCode = 200
                          res.send('Alterado com Sucesso');                
                        })
                        .catch(()=>{
                          res.statusCode = 400
                          res.send('Erro ao Alterar');   
                        })

                }else{
                    res.statusCode = 404;
                    let status =  (res.statusCode = 404);
                    res.send(status)
                }

                
            })
            .catch(()=>{
                res.statusCode = 404;
                let status =  (res.statusCode = 404);
                res.send(status)
            })
      
    }

});

app.post('/auth',((req,res)=>{

    let {email, password} = req.body;

    if(email != undefined){

        modelUser
            .findOne({where:{ email: email}})
            .then((user)=>{

                if(user.email != undefined){
                    

                    if(user.password == password){

                        //  IMP
                        jwt.sign({id: user.id, email: user.email}, jwtSecret,{expiresIn: '1h'},(error, token)=>{
                            
                            if(error){
                                res.status(400);
                                res.json({erro: 'Falha interna'}) 
                            }else{
                                res.status(200);
                                res.json({token: token})
                            }


                        })

                        
                    }else{
                        res.status(401);
                        res.json({erro: 'Credenciais invalidas'})
                    }

                }else{
                    res.status(404);
                    res.json({erro: 'Email não encontrado 2', email: user})
                }
                

            })
            .catch(()=>{
                //Status
                res.status(400);
                res.json({erro: "Email não encontrado AQUI"})
            })

    }else{
        res.status(400);
        res.json({erro: 'Email invalido'});
    }

}))




//SERVER
app.listen(8080,(msgErro)=>{


    if(msgErro){
        console.log('Erro ao contectar o Servidor - ' + msgErro);
    }else{
        console.log('Servidor Conectado com Sucesso!')
    }

})

