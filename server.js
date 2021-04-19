let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http) ;


let mongoClient = require("mongodb").MongoClient;
let url = "mongodb://localhost:27017"


app.get("/" , (req,res) => {
    res.sendFile(__dirname + "/index.html" )
})



io.on("connection", (socket) => {
    console.log("Client Connected to Application") ;
   
    socket.on('chat message' , (mes) => {
       

     
      // database area  ;
        var name = mes.name ;
      var message = mes.message ;
      var d = new Date();

      mongoClient.connect(url, {useUnifiedTopology: true },(err1,client)=>{
        if(!err1){
            let db = client.db("SocketIO");
            db.collection("Chat").insertOne({
             
                Name: name,
                Message : message , 
                Time : d 
            }, 
                
                (err2,result)=>{
                 
                    if(!err2){
                        console.log(result.insertedCount);
                    }else {
                        console.log(err2.message);
                    }
                  
                    client.close();    
            
                });
                
            }
        });
        
            console.log("Record Save Successfully  !") ;
            io.emit('chat message', mes);
       
        });
       
    });



// server done 
http.listen(9090,()=>{
    console.log('Running on port : 9090') ;
})