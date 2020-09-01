var app = require('express')()
var http = require('http').createServer(app);
var io = require('socket.io')(http)

var users=[]

app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
    socket.on('send message', (data)=>{
        // some logic to extract mentioned user in the message
        // create list of those users
        // iterate over the list of those users
        // check wether user exixt in dict or not i.e. in users dict
        // send message to valid user by users[key].emit('send message', msg)
        data=JSON.parse(data);
        console.log(data);
        var user=data.username;
        var  msg=data.msg;
        const regex = /@{1}[A-Za-z0-9_]+/gm;
        let m;
        var mentionedUsers=[]
        
        while ((m = regex.exec(msg)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            m.forEach((match, groupIndex) => {
                console.log(match.substring(1));
                mentionedUsers.push(match.substring(1));
            });
        }

        mentionedUsers.forEach((u)=>{
        
            if (users.hasOwnProperty(u)) {           
                users[u].emit('send message', msg)
            }
        });
        if (users.hasOwnProperty(user)) {           
            users[user].emit('send message', msg)
        }
    })

    socket.on('new', (username)=>{
       // console.log(username,"new user")
        if(users.hasOwnProperty(username))
        {
        // socket.emit('error','user exixt');

        socket.emit('error',username+' '+ 'exists')

        }else{
            users[username]=socket;
            // socket.emit('success','user exixt');
            socket.emit('success',"success");
        }
    })
})

http.listen(3000,() => {
    console.log('server is running')
})