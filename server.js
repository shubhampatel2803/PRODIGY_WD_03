const express=require("express");
const cors=require("cors");
const http=require("http");
const {Server}=require("socket.io");

const routes=require("./routes/gameRoutes");

const app=express();
const server=http.createServer(app);
const io=new Server(server,{cors:{origin:"*"}});

app.use(cors());
app.use(express.json());
app.use("/api",routes);

let rooms={};

io.on("connection",(socket)=>{

    socket.on("createRoom",({roomId})=>{
        rooms[roomId]=[socket.id];
        socket.join(roomId);
        socket.emit("startGame",{symbol:"X"});
    });

    socket.on("joinRoom",({roomId})=>{
        if(rooms[roomId]){
            rooms[roomId].push(socket.id);
            socket.join(roomId);
            io.to(roomId).emit("startGame",{symbol:"O"});
        }
    });

    socket.on("move",(data)=>{
        socket.to(data.roomId).emit("move",data);
    });
});

server.listen(5000,()=>console.log("Server running"));
app.get("/", (req, res) => {
    res.send("Tic Tac Toe Backend Running 🚀");
});