const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;
const app = express();
 
app.use(express.static("site"));
app.use(express.json());

const userScheme = new Schema({
  name: String,
  phone: String,
  email: String,
  website: String
});
const User = mongoose.model("User", userScheme);
 
async function main() {
 
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/people");
        app.listen(3000);
        console.log("Сервер ожидает подключения по адресу http://localhost:3000");
    }
    catch(err) {
        return console.log(err);
    }
}
 
app.get("/api/users", async (req, res)=>{
    // получаем всех пользователей
    const users = await User.find({});
    res.send(users);
});
     
app.post("/api/users", async (req, res) =>{
    if(!req.body) return res.sendStatus(400);
    const Name = req.body.username;
    const Phone = req.body.phone;
    const Mail = req.body.email;
    const Site = req.body.website;
    const user = new User({name: Name, phone: Phone, email: Mail, website: Site});
    // сохраняем в бд
    await user.save();
    res.send(user);
});
      
app.delete("/api/users/:id", async(req, res)=>{
          
    const id = req.params.id;
    // удаляем по id 
    const user = await User.findByIdAndDelete(id);
    if(user) res.send(user);
    else res.sendStatus(404);
});
 
main();
// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", async() => {
      
    await mongoose.disconnect();
    console.log("Приложение завершило работу");
    process.exit();
});