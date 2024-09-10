const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'member'
    }
})

dotenv.config();



const port = 7000

app.use(cors())

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/login', async (req, res) => {
    console.log(req.body)
    if(req.body.email == '' || req.body.password == ''){
        return res.send({
            message: 'กรุณากรอกข้อมูลให้ครบ',
            status: '0'
        })
        
             
    }
    let ids = await knex('users')
            .where({email: req.body.email, password: req.body.password})
            if(ids == 0){
                return res.send({
                    message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
                    status: 'error_user'
                })
            }  
    // res.send({
    //     message: 'เข้าสู่ระบบสำเร็จ',
    //     status: 'success',
    //     row: ids[0]
    // })
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
        time: Date(),
        email1: req.body.email,
    }
    const token = jwt.sign(data, jwtSecretKey);
    console.log('token=', token)
       //
      console.log("step 3");
      res.send({
        masages: "login success",
        status: "success",
        row: ids[0],
        token:token
      })
})




app.post('/insert', async (req, res) => {
    console.log(req.body)
    let username = req.body.username
    let password = req.body.password
    let email = req.body.email
    try {
        let ids = await knex('users')
                    .insert({username: username, password: password, email: email})
        res.send({
            ok: true,
            id: ids[0]
        })
    } catch (error) {
        res.status(500).send(error.message)
    }
})

app.post('/delete', async (req, res) => {
//     await knex('users')
//   .where({code: '01'})
//   .update({username: username, password: password, email: email})
    // UPDATE student SET name='Name01', age=age + 1 WHERE code='01'
    let username = req.body.username

    try {
        let ids = await knex('users')
            .where({username: username})
            .delete()
        res.send({
                ok: true,
                id: ids[0]
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).send({
            ok: false,
        });
    }

})

app.post('/update', async (req, res) => {
    let { id, username, password, email } = req.body;

    try {
        await knex('users')
            .where({ id: id })
            .update({ username: username, password: password, email: email });

        res.send({
            ok: true,
            id: id
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});



app.post('/search', async (req, res) => {
    try {
        let username = req.body.username; 
        
        let rows = await knex('users')
            .where({ username: username }) 
            .select(['users.username', 'users.password'], ['users.email']);
        
        res.send({
            ok: true,
            data: rows
        });
    } catch (error) {
        res.status(500).send({
            ok: false,
            error: error.message
        });
    }
});



app.get('/list', async (req, res) => {

    let rows = await knex('users')
    res.send({
        status: ('yes'),
        row: rows

    })

})

app.get('/user', async (req, res) => {
    try {
        let rows = await knex('users')
            .where({ username: req.query.user })
        res.send({
            status: ('yes'),
            row: rows

        })

    } catch (error) {
        res.status('500').send({error: error})
    }


})

// Main Code Here //
// Generating JWT
app.post("/user/generateToken", (req, res) => {
    // Validate User Here
    // Then generate JWT Token

    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
        time: Date(),
        userId: 12,
    }

    const token = jwt.sign(data, jwtSecretKey);
    console.log('token = ',token);
    res.send(token);
});

// Verification of JWT
app.get("/user/validateToken", (req, res) => {
    // Tokens are generally passed in header of request
    // Due to security reasons.

    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    try {
        const token = req.header(tokenHeaderKey);

        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
            return res.send("Successfully Verified");
        } else {
            // Access Denied
            return res.status(401).send(error);
        }
    } catch (error) {
        // Access Denied
        return res.status(401).send(error);
    }
});


 


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})