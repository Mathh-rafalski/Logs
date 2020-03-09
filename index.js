const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser")
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'logs'
})
var server = app.listen(80);
connection.connect(function (err) {
    if (err) {
        console.error('erro conectando ao banco: ' + err.stack);
        return;
    }
    console.log('Banco conectado')
});

var myLogger = function (req, res, next) {
    console.log('LOGGED')
    var url = req.url
    var ip = req.connection.remoteAddress
    var user_agent = req.get('user-agent');
    var data = new Date();
    let dia = data.getDate();
    let mes = data.getMonth();
    let ano = data.getFullYear();
    let hora = data.getHours();
    let min = data.getMinutes();
    let seg = data.getSeconds();
    data = ano + "-" + mes + "-" + dia + "-" + " " + hora + ":" + min + ":" + seg;
    console.log(data)
    let sql = "INSERT INTO `logs` (`rota`,`ip`,`user_agent`,`data_hora`) VALUES ('" + url + "', '" + ip + "','" + user_agent + "','" + data + "')";
    connection.query(sql, function (err, result) {

    });
    next()
};
app.get('/', function (req, res) {
    let num = Math.floor(Math.random() * (6 - 1) + 1);
    console.log(num)
    if (num == 1) {

        res.send("fala fi")
    }
    if (num == 2) {

        res.send("É")
    }
    if (num == 3) {

        res.send("pegadinha")
    }
    if (num == 4) {

        res.send("garaio")
    }
    if (num == 5) {

        res.send("kkk")
    }
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(myLogger)


app.get('/ranking', function (req, res) {
    let sql = 'select rota,count(id) as Acessos from logs group by rota order by Acessos desc';
    let i = 1;
    let dados = ['Rotas | Acessos']
    connection.query(sql, function (err, result, fields) {
        if (err) {
            res.json(err)
        } else {
            result.forEach(element => {
                let string = element["rota"] + " | " + element["Acessos"]
                string = string.replace('[', '')
                string = string.replace('"', '')
                /*if (i < string.length) {
                i = string.length
                }*/

                dados.push(string)
            });
            /*dados.forEach(element => {
                if (element.length < i) {
                    for(element.length;element.length < i;) {
                        console.log(element.substr(element))
                        element += " "
                    }
                }
                dados.push(element)
            });*/
            res.header("Content-Type", 'application/json');
            res.send(JSON.stringify(dados, null, 4));
            // res.json(dados)
        };
    })
})