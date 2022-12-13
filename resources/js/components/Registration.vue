<template>
  <v-app >
     <v-main>
        <v-container fluid fill-height>
           <v-layout align-center justify-center>
              <v-flex xs12 sm8 md4>
                 <v-card class="elevation-12">
                    <v-toolbar dark color="primary">
                       <v-toolbar-title>{{isRegister ? stateObj.register.name : stateObj.login.name}} form</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                    <form ref="form" @submit.prevent="isRegister ? register() : login()">
                           
                          <v-text-field v-if="isRegister"
                             v-model="name"
                             name="name"
                             label="Username"
                             type="text"
                             placeholder="Full name"
                             required
                          ></v-text-field>

                          <v-text-field
                             v-model="email"
                             name="email"
                             label="Email"
                             type="text"
                             placeholder="Email"
                             required
                          ></v-text-field>

                          <v-select v-if="isRegister"
                            v-model="select"
                            :items="countries"
                            label="Country"
                            item-text="name"
                            item-value="name"
                            v-on:change="changePhonePrefix(select)"
                          >
                            <template v-slot:item="slotProps" >
                              <i :class="['mr-2', 'em', 'em-flag-'+emojiCountryCode(slotProps.item.flag).toLowerCase()]"></i>
                              {{slotProps.item.name}}
                            </template>
                          </v-select>
                          
                          <validation-provider v-if="isRegister"
                            v-slot="{ errors }"
                            name="phoneNumber"
                            :rules="{
                              required: true,
                              regex: '^([\+])\\d{3} \\d{2} \\d{3}-\\d{2}-\\d{2}$'
                            }"
                          >
                            <v-text-field
                              v-model="phoneNumber"
                              :error-messages="errors"
                              label="Phone Number"
                              required
                            ></v-text-field>
                          </validation-provider>

                           <v-text-field
                             v-model="password"
                             name="password"
                             label="Password"
                             type="password"
                             placeholder="password"
                             required
                          ></v-text-field>

                          

                          <v-text-field v-if="isRegister"
                             v-model="confirmPassword"
                             name="confirmPassword"
                             label="Confirm Password"
                             type="password"
                             placeholder="cocnfirm password"
                             required
                          ></v-text-field>
                          <div class="red--text"> {{errorMessage}}</div>
                          <v-btn type="submit" class="mt-4" color="primary" value="log in">{{isRegister ? stateObj.register.name : stateObj.login.name}}</v-btn>
                          <div class="grey--text mt-4" v-on:click="isRegister = !isRegister;">
                             {{toggleMessage}}  
                          </div>
                     </form>
                    </v-card-text>
                 </v-card>
               
              </v-flex>
           </v-layout>
        </v-container>
     </v-main>
  </v-app>
</template>

<script>
import  countryInfo from '../../countries.json';
const { emojiCountryCode } = require('country-code-emoji');
import { required, regex } from 'vee-validate/dist/rules';
import { extend, ValidationProvider, setInteractionMode } from 'vee-validate';
import axios from 'axios';


setInteractionMode('eager')


  extend('required', {
    ...required,
    message: '{_field_} can not be empty',
  })

  extend('regex', {
    ...regex,
    message: '{_field_} {_value_} does not match +972 53 111-22-33',
  })

export default {
 name: "App",
 components: {
      ValidationProvider,
    },
 data() {
   return {
     name: "",
     email: "",
     select: null,
     countries: countryInfo,
     phoneNumber: '',
     password: "",
     confirmPassword: "",
     isRegister : false,
     errorMessage: "",
     stateObj: {
        register :{
           name: 'Register',
           message: 'Aleady have an Acoount? login.'
        },
        login : {
           name: 'Login',
           message: 'Register'
        }
     }
   };
 },
 methods: {
   login() {
     console.log(this.name + " logged in")
   },
   register() {
      if(this.password == this.confirmPassword){
         this.isRegister = false;
         this.errorMessage = "";

         const data = {};
         data.name = this.name;
         data.email = this.email;
         data.country = this.select;
         data.phoneNumber = this.phoneNumber;
         data.password = this.password;
         data.password_confirmation = this.confirmPassword;

         axios
         .post(`api/register`, data)
         .then(response => {
         this.info = response.data.bpi
         console.log("success!");
         })
         .catch(error => {
         console.log(error)
         this.errored = true
         })
         .finally(() => this.loading = false)
      }
      else {
        this.errorMessage = "password did not match"
      }
   },
   emojiCountryCode:emojiCountryCode,
   changePhonePrefix(name) {
    const prefixCode = this.countries.filter(val => val.name === name)[0].idd;
    this.phoneNumber = prefixCode;
  }
  
 },
     computed: {
      toggleMessage : function() { 
         return this.isRegister ? this.stateObj.register.message : this.stateObj.login.message }
   }
};
</script>