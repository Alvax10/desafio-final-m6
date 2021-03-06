import { Router } from "@vaadin/router";
import { state } from "../state";

class JoinRoom extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open'});
    }
    connectedCallback() {
        this.render();
        
        const currentState = state.getState();
        const formEl = this.shadow.querySelector(".join-room__form");
        const inputRoomIdEl = (this.shadow.querySelector(".input-room-id") as HTMLInputElement);

        formEl.addEventListener("submit", (e: any) => {
            e.preventDefault();
            currentState.roomId = inputRoomIdEl.value.toString();
            
            state.accessToRoom(()=> {
                // Esta sección setea la información dada anteriormente y la sube a la rtdb, luego de que ambos hayan seteado su información a la rtdb chequea si ambos jugadores están online y los lleva a instrucciones, de lo contrario los lleva a una página donde les avisa que no pueden acceder.

                state.loadInfoToTheRtdb();
                state.listenRoom();
                state.suscribe(() => {

                    if (window.location.pathname.toString() == "/join-room" && currentState["rtdb"]["player-1"]["online"] == true && currentState["rtdb"]["player-2"]["online"] == true) {
    
                        Router.go("/instructions");
                    }
                    if (window.location.pathname.toString() == "/join-room" && currentState["rtdb"]["player-1"]["online"] == false || currentState["rtdb"]["player-2"]["online"] == false) {

                        console.error("One of the players isn't connected");
                    }
                });
            });
        });
    } 
    render() {
        const divEl = document.createElement("div");
        const style = document.createElement("style");

        style.innerHTML = `
            .general-container {
                height: 100vh;
                display: flex;
                align-items: center;
                flex-direction: column;
            }
            @media (min-height: 800px) {
                .general-container {
                    justify-content: space-evenly;
                }
            }
            .title__game {
                margin: 25px 0;
                font-size: 80px;
                max-width: 400px;
                padding-left: 40px;
                color: rgba(0, 144, 72, 1);
                font-family: 'American Typewriter', sans;
            }
            @media (min-width: 500px) {
                .title__game {
                    padding-left: 70px;
                }
            }
            .join-room__form {
                display:flex;
                flex-direction: column;
            }
            .input-room-id {
                height: 80px;
                width: 275px;
                font-size: 35px;
                padding: 5px 10px;
                background: #FFFFFF;
                align-items: center;
                border-radius: 10px;
                justify-content: center;
                border: 10px solid #182460;
            }
            .button {
                width: 322px;
                height: 87px;
                margin: 20px 0;
                color: #D8FCFC;
                font-size: 45px;
                text-align: center;
                align-items: center;
                border-radius: 10px;
                justify-content: center;
                background-color: #006CFC;
                border: 10px solid #001997;
                font-family: 'Odibee Sans', cursive;
            }
            .img__container {
                display: flex;
                align-items: center;
                justify-content: space-evenly;
            }
        `;

        divEl.innerHTML = `
            <div class="general-container">
                <h2 class="title__game">
                    Piedra Papel ó Tijera
                </h2>
                <form class="join-room__form">
                    <input type="text" class="input-room-id" placeholder="Room Id" />
                    <button class="button">  Ingresar a la Sala </button>
                </form>
                
                <div class="img__container">
                    <hand-comp hand="scissor"></hand-comp>
                    <hand-comp hand="rock"></hand-comp>
                    <hand-comp hand="paper"></hand-comp>
                </div>
            </div>
        `;

        this.shadow.appendChild(divEl);
        this.shadow.appendChild(style);
    }
}

customElements.define("join-room", JoinRoom);