const socket = io()

let user;
const chatBox=document.getElementById("chatBox")

chatBox.addEventListener("keyup",(event)=>{
    if(event.key === "Enter"){
        if(chatBox.value.trim().length > 0){

            socket.emit("message",{user:user,message:chatBox.value})
            chatBox.value=""
        }
    }
   
})
socket.on("messagesLogs", (data)=>{
   
        const pLogs =document.getElementById("messagesLogs")
        let messages=""
        
        data.forEach(message =>{
            messages= messages + `${message.user} dice:${message.message}<br>`    
        })
        pLogs.innerHTML=messages
})



Swal.fire({
    title:"Identificación",
    input:"text",
    text:"Ingresar mail",
   inputValidator:(value)=>{
       return !value && "Ingresa tu mail para continuar"
   },
   allowOutsideClick:false

}).then((result) => {
        user=result.value
        console.log(user)

    {
      Swal.fire({

        title: `Bienvenido ${result.value}`,
       
      });
    }
  })

  

