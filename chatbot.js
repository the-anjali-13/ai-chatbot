let sendbtn = document.getElementById("send");
let text = document.getElementById("text");
let chatbox = document.getElementById("chatbox")

const chatHistory = [];
const generateResponse= async (incomingmsgli)=>{
    const API_KEY ="AIzaSyAkRWg-gVFMSyGZeBlXXtB3l_NkqgdKrQI";
    const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key="+API_KEY;

    chatHistory.push({
        role: "user",
        parts:[{text:text.value}]
        });

    const options ={
        method:"POST",
        headers: {
            "Content-Type":"application/json",
        },
        body:JSON.stringify({
           contents: chatHistory
           
        //    [{
        //     parts:[{text:text.value}]
        //     }]
        })
    };

    try{
        const response = await fetch(API_URL,options);
        const data = await response.json();
        if(!response.ok) throw new Error(data.eror.message);

        const apiresponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim();
        incomingmsgli.innerText = apiresponse;

        chatHistory.push({
            role: "model",
            parts:[{text:apiresponse}]
            })
    }
    catch(error){
        console.log(error);
        incomingmsgli.innerText = "Something went wrong, Check your internet Connection. ERROR: "+error;
        incomingmsgli.style.color="red";
        incomingmsgli.style.backgroundColor = "rgb(248, 185, 185)";
    }
    finally{
        chatbox.scrollTo({top:chatbox.scrollHeight, behavior:"smooth"});
    }


}


function createchatlist(msg,chattype){

    let chatli = document.createElement("li");
    let listpera = document.createElement("p");
    chatli.appendChild(listpera);

    if(chattype==="outgoing"){

        listpera.textContent = msg.trim();    
        chatli.classList.add("chat","outgoing-chat");
        return chatli;
    }
    else{

        listpera.textContent="Thinking...";
        chatli.classList.add("chat","incoming-chat");
        chatbox.appendChild(chatli);
        return chatli;
    }
    

}

function handleoutgoingchat(msg) {

    chatbox.appendChild(createchatlist(msg,"outgoing"));
    chatbox.scrollTo({top:chatbox.scrollHeight, behavior:"smooth"});

    let incomingmsgli = createchatlist("Thinking...","incoming")
    chatbox.appendChild(incomingmsgli);
    chatbox.scrollTo({top:chatbox.scrollHeight, behavior:"smooth"});
    generateResponse(incomingmsgli);
    
}

sendbtn.addEventListener("click",function(){

        
    if(text.value===""){
        alert("Enter some query.");
        return;
    }
    else{
        handleoutgoingchat(text.value);
        text.value="";
    }
});