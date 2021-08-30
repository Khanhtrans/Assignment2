const express = require('express');
const session = require('express-session');
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

app.post('/add', async (req, res) => { // gọi hàm add
    const nameInput = req.body.txtName;
    const priceInput = req.body.txtPrice;
    //kiểm tra xem nhập $ hay chưa
    // if (priceInput.slice(-1) !== "$") {
    //     res.render("index", {errorMsg: 'Nguoi dung chua nhap don vi tien te'});
    //     return;
    // }
    const newProduct = { Name: nameInput, Price: priceInput} //khởi tạo 1 hàm newproduct để lưu sau khi thêm vào
    //req.body là liên kết vớidòng 18, 22 bên index
    // nếu tên nhỏ hơn 3 kí tự sẽ quay lại trang index và báo lỗi
    // if (nameInput.length < 4) { 
    //     res.render("index", { errorMsg: 'name less than 4 characters' })
    //     return;
    // }

    // price quá 1000
    // if(priceInput.length < 1000){ 
    //     res.render("index",{errorPri:'quá 1000'})
    //     // return;
    // }

    //chữ cái đầu tiên ko là số
    // const fw = nameInput.chartAt(0);
    // if(!isNaN(0)){
    //     res.render('index',{errorFw:"your first char have to word"});
    //     return;
    // }
    await addProduct(newProduct);
    res.redirect("/");
})

app.get('/delete', async (req, res) => {
    const id = req.query.id; //lấy dữ liệu từ database(id lấy từ database)
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
    // if(req.session["User"] == null){// kiểm tra xem người dùng đăng nhạp hay chưa
    //     res.redirect('/login')
    // } //allProducts là một mảng
    const dbo = await getDB();
    const allProducts = await dbo.collection("products").find({}).toArray();

    res.render('index', { data: allProducts, auth: req.session["User"] })
    // res.render('index', {data: allProducts.slice(0,2)}); //hien thi 2 san pham dau tien
})

function checkLogin(req, res, next) {
    if (req.session["User"] == null) {// kiểm tra xem người dùng đăng nhạp hay chưa
        res.redirect('/login')
    } else {
        next();
    }
}

const PORT = process.env.PORT || 5002;
app.listen(PORT)
console.log("app is running ", PORT)