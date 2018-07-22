<template>
<div class="bot">
    <div class="header-bot">
        PreviBot
    </div>
    <div class="messages">
        <div class="message" v-for="(mensagem, index) in mensagens" :key="index" :class="{'from-watson': mensagem.watson, 'from-user': !mensagem.watson}">
            <div class="texto">
                <p v-for="(texto, index) in mensagem.textos" :key="index">{{texto}}</p>
            </div>
            <div class="sugestoes" v-for="(sugestao, index) in mensagem.sugestoes" :key="index" @click="buscarTemperatura(sugestao)">
                <div class="sugestao">{{sugestao.nome}}</div>
            </div>
        </div>
    </div>
    <div class="input">
        <input v-model="mensagem.text" v-on:keyup.enter="enviarMensagem" type="text" placeholder="Digite algo...">
    </div>
</div>
</template>

<script>
import axios from 'axios';

export default {
    data(){
        return {
            url: `http://localhost:3000/mensagem/`,
            mensagens: [
              {
                textos:[],
                watson: false,
                sugestoes:[
                  {
                    nome: ""
                  }
                ],
              }
            ],
            mensagem:{
              text:"",
              context: {}
            },
            temperatura:{
              hoje: "",
              setentaDuasHoras: "",
              quizeDias: ""
            }
        }
    },
    created() {
        axios.post(this.url, this.mensagem)
        .then((response) =>{
            this.mensagens.push({
              textos: response.data.output.text,
              watson: true,
              sugestoes: response.data.context.sugestoes
            })
        })
        .catch((error) =>{
            console.log(error);
        });
    },
    methods:{
      enviarMensagem(){
        this.mensagens.push({
          textos: [this.mensagem.text],
        });

        axios.post(this.url, this.mensagem)
        .then((response) => {
          this.mensagens.push({
              textos: response.data.output.text,
              watson: true,
              sugestoes: response.data.context.sugestoes
          });
            this.mensagem.text = "";
            this.mensagem.context = {};
        })
      },
      buscarTemperatura(sugestao){
        axios.get(`http://apiadvisor.climatempo.com.br/api/v1/weather/locale/${sugestao.id}/current?token=61963139b5c7c5ec370b3f08a7ab85a7`)
        .then((response) =>{
          this.temperatura.hoje = response.data.data.temperature;
          axios.get(`http://apiadvisor.climatempo.com.br/api/v1/forecast/locale/${sugestao.id}/hours/72?token=61963139b5c7c5ec370b3f08a7ab85a7`)
            .then((response) =>{
              this.temperatura.setentaDuasHoras = response.data.data[response.data.data.length - 1].temperature.temperature
              axios.get(`http://apiadvisor.climatempo.com.br/api/v1/forecast/locale/${sugestao.id}/days/15?token=61963139b5c7c5ec370b3f08a7ab85a7`)
              .then((response) =>{
                this.temperatura.quizeDias = response.data.data[response.data.data.length - 1].temperature.morning.max;
                this.enviarSugestao(sugestao, this.temperatura);
            })
          })
        })
        .catch((error) =>{
          console.log(error);
        })
      },
      enviarSugestao(sugestao, temperatura){
        this.mensagem = {
          text: sugestao.nome,
          context: {
            cidade: sugestao.cidade,
            temperatura: temperatura,
            informacoesValidas: true
          }
        };
        console.log(this.mensagem);
        this.enviarMensagem();
      }
    }
}
    
</script>

<style>
.bot {
  border-radius: 25px;
  box-shadow: 6px 6px 8px rgba(0, 0, 0, .12), 0 2px 32px rgba(0, 0, 0, .1);
  width: 360px;
  height: 580px;
  position: fixed;
  right: 15px;
  bottom: 15px;
  z-index: 1;
  border: solid #95c1db;
  font-family: sans-serif;
}
.bot .header-bot {
  width: 100%;
  height: 10%;
  border-radius: 20px 20px 0px 0px;
  background-color: #95c1db;
  text-align: center;
  font-weight: bold;
  color: #fff;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bot .messages {
  margin: 5px;
  overflow-y: auto;
  overflow-x: hidden;
  height: 78%;
}
.bot .messages .message {
  width: 100%;
}
.bot .messages .message.from-watson .texto p {
  margin-left: 5px;
  text-align: left;
}
.bot .messages .message.from-user .texto {
  background-color: #dbeef9;
  border-radius: 50px;
}
.bot .messages .message.from-user .texto p {
  margin-left: 15px;
  text-align: left;
}
.bot .messages .sugestoes {
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  text-align: center;
}
.bot .messages .sugestoes .sugestao {
  background-color: #95c1db;
  border-radius: 25px;
  margin-top: 5px;
}
.bot .messages .sugestoes .sugestao:hover {
  opacity: 0.8;
  cursor: pointer;
}
.bot .input {
  height: 10%;
  box-sizing: border-box;
  width: 100%;
  background-color: #fff;
  border-radius: 0 0 8px 8px;
  display: flex;
  align-items: center;
  padding: 5px;
}
.bot .input input {
  margin-left: 10px;
  width: 100%;
  border: none;
}
.bot .input input:focus {
  outline: none;
}
</style>