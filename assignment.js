const express = require('express');
const session = require('express-session');
const { ObjectId } = require('mongodb');
const app = express()

const { addProduct, deleteProduct
    , getDB, insertUser, getRole } = require('./database');

app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: '156655hjkkjhgggghgg',
    cookie: { maxAge: 600000 }
}));

app.post('/add', async (req, res) => { 
    const nameInput = req.body.txtName;
    const priceInput = req.body.txtPrice;
    const categoryInput = req.body.txtCategory;
    if(categoryInput != "Sach" && categoryInput != "lego"){
        res.render("index", { errorMsg: 'category: sach or lego' })
        return;
    }
    const newProduct = { Name: nameInput, Price: priceInput, Category:categoryInput } 
    await addProduct(newProduct);
    res.redirect("/");
})

app.get('/delete', async (req, res) => {
    const id = req.query.id;
    await deleteProduct(id);
    res.redirect("/");
})

app.post('/register', async (req, res) => {
    const name = req.body.txtName;
    const pass = req.body.txtPassword;
    const role = req.body.role;
    insertUser({ name: name, pass: pass, role: role })
    res.redirect('/login')
})
app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/doLogin', async (req, res) => {
    const name = req.body.txtName;
    const pass = req.body.txtPassword;
    console.log(name)
    var role = await getRole(name, pass);
    console.log("role ", role)
    if (role != "-1") {
        req.session["User"] = {
            name: name,
            role: role
        }
    }
    res.redirect('/');
})

app.get('/', checkLogin, async (req, res) => {
    const dbo = await getDB();
    const allProducts = await dbo.collection("products").find({}).toArray();
    res.render('index', { data: allProducts, auth: req.session["User"]});
})

function checkLogin(req, res, next) {
    if (req.session["User"] == null) {
        res.redirect('/login')
    } else {
        next();
    }
}

const PORT = process.env.PORT || 5002;
app.listen(PORT)
console.log("app is running ", PORT)