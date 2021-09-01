const { ObjectId, MongoClient } = require('mongodb');
const url = "mongodb+srv://KhanhTran:Kt29888701@cluster0.uxw0c.mongodb.net/test";
// const url = "mongodb:localhost:27017";

async function getDB() {
    const client = await MongoClient.connect(url);
    const dbo = client.db("Assignment");
    return dbo;
}

async function addProduct(newProduct) {
    const dbo = await getDB();
    await dbo.collection("products").insertOne(newProduct);
}

async function deleteProduct(id) {
    const dbo = await getDB();
    await dbo.collection("products").deleteOne({ "_id": ObjectId(id)});
}

async function getRole(nameInput,pass){
    const dbo = await getDB();
    const s = await dbo.collection("users").findOne({ name: nameInput, pass:pass });
    if(s==null)
        return "-1";
    else
        return s.role;
}

async function insertUser(newUser) {
    const dbo = await getDB();
    await dbo.collection("users").insertOne(newUser);
}
module.exports = {getDB,addProduct,deleteProduct,insertUser, getRole}