const { ObjectId, MongoClient } = require('mongodb');
const url = "mongodb+srv://KhanhTran:Kt29888701@cluster0.uxw0c.mongodb.net/test";

async function getDB() {
    const client = await MongoClient.connect(url);
    const dbo = client.db("Assignment");
    return dbo;
}

async function addProduct(newProduct) {
    // const client = await MongoClient.connect(url);
    // const dbo = client.db("Assignment");
    const dbo = await getDB();
    await dbo.collection("products").insertOne(newProduct);
}


async function deleteProduct(id) {
    // const client = await MongoClient.connect(url);
    // const dbo = client.db("Assignment");
    const dbo = await getDB();
    await dbo.collection("products").deleteOne({ "_id": ObjectId(id) });
}

// async function getProductById(idInput) {
//     const dbo = await getDB()
//     // return dbo.collection("products").findOne({ _id: ObjectId(idInput) })
//     const search = await dbo.collection("products").findOne({ _id: ObjectId(id) });
//     return search;
// }

// async function updateProductById(id, nameInput, priceInput) {
//     // const dbo = await getDB()
//     dbo.collection("products").updateOne({ _id: ObjectId(id) }, { $set: { Name: nameInput, Price: priceInput } })
//     // const filter = { _id: ObjectId(id) };
//     // const newValue = { $set: { name: nameInput, age: ageInput, priceInput } };

//     const dbo = await getDB ();
//     await dbo.collection("products").updateOne(filter, newValue);
// }
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