import React, { Component } from 'react';
import { Widget, handleNewUserMessage, addResponseMessage, addUserMessage, renderCustomComponent, toggleInputDisabled,toggleInputEnabled, dropMessages } from 'react-chat-widget';
import axios from "axios";
import 'react-chat-widget/lib/styles.css';
import botimg from './images/bot.png';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nomUser : "lms_bot",
        };
        const min = 1;
        const max = 10000;
        const rand = min + Math.random() * (max - min);
        global.idUser = rand
    }
    useEffect (msg) {
        addResponseMessage('Welcome to this awesome chat!');
      };
    
    handleNewUserMessage  (newMessage) {
        const BOT_URL = process.env.BOT_URL; 
        //post request
        axios.post(BOT_URL, {
            type: 'text',
            text: newMessage
        })
        .then(function (response) {
            console.log(response.data);
            const res = response.data.responses.map((item) => {
                console.log(item.type)
                if (item.type == "text"){
                        console.log(item)
                        let obj = item
                        console.log(obj)
                        console.log(obj.type)
                        console.log(obj.text)
                        if (obj.type == "text"){
                      //  toggleInputEnabled()
                            addResponseMessage(obj.text)
                            
                        } else if (obj.type == "nomPrenomForm"){
                       
                           addResponseMessage(obj.text)
                           renderCustomComponent(NameReply);
                        } else if (obj.type == "slider"){
                      addResponseMessage(obj.text)
                            console.log("slider")
                            renderCustomComponent(SliderReply,{mins:obj.mins, maxs:obj.maxs,steps:obj.steps,defaults:obj.defaults});
                            
                        } else if (obj.type == "datepicker"){
                     
                      addResponseMessage(obj.text)
                            console.log("datepicker")
                            renderCustomComponent(DatePickerReply,{mins:obj.mins, maxs:obj.maxs,steps:obj.steps,defaults:obj.defaults});
                        } else if (obj.type == "ratiob"){
                       
                            addResponseMessage(obj.text)
                            renderCustomComponent(RatioBReply,{choices:obj.choices});
                        } else if (obj.type == "table"){
                     
                            addResponseMessage(obj.text)
                            renderCustomComponent(TableReply,{tableinfo:obj.table});
                        } else if (obj.type == "champNbr"){
                      
                            addResponseMessage(obj.text)
                            renderCustomComponent(NumberReply);
                        } else if (obj.type == "bntConnexion"){
                       
                            addResponseMessage(obj.text)
                            renderCustomComponent(btnConnexionReply);
                        } else if (obj.type == "btnChoixPiece"){
                      
                            addResponseMessage(obj.text)
                            renderCustomComponent(btnPieceReply);
                        } else if (obj.type == "choixPiece"){
                      
                            addResponseMessage(obj.text)
                            renderCustomComponent(selectImageReply);
                        }
                     }
                }
            )
            //console.log(response.data.responses[1].text);
        })
            .catch(function (error) {
                console.log(error);
            });
    }

    correct () {
        console.log("success");
    }

 
    render() {
        return (
            <div className="App">

                <Widget
                    handleNewUserMessage={this.handleNewUserMessage}
                    title="Your chatbot"
                    subtitle="Votre assistant"
                    profileAvatar={botimg}
                    senderPlaceHolder="Tapez votre message ..."
                    draggableCancel="input,textarea"s
                />
            </div>
        );
    }
}

export default App;